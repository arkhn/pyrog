import * as jwt from 'jsonwebtoken'
import { Prisma as PrismaClient } from './generated/prisma-client'
import { Prisma as PrismaBinding } from './generated/prisma-binding'

export interface Context {
    binding: PrismaBinding
    client: PrismaClient
    request: any
}

export function getUserId(ctx: Context) {
    const Authorization = ctx.request.get('Authorization')
    if (Authorization) {
        const token = Authorization.replace('Bearer ', '')
        const { userId } = jwt.verify(token, process.env.APP_SECRET) as { userId: string }
        return userId
    }

    throw new AuthError()
}

export class AuthError extends Error {
    constructor() {
        super('Not authorized')
    }
}

// Recursively queries all nested attributes of a given attribute.
export const getRecAttribute = async (attribute, context: Context) => {
    const directAttributes = await context.client.attribute({
        id: attribute.id,
    }).attributes()

    return directAttributes.map(async (attribute) => {
        return {
            ...attribute,
            attributes: await getRecAttribute(attribute, context),
        }
    })
}

export const recData = (attributePath: string[]) => {
    if (attributePath.length == 0) {
        return null
    }
    else if (attributePath.length == 1) {
        return {
            name: attributePath.pop()
        }
    }
    else {
        return {
            name: attributePath.pop(),
            attributes: {
                create: [
                    recData(attributePath)
                ]
            }
        }
    }
}

export const recAttributeCreation = async (context: Context, info, attributePath: string[], parentId) => {
    if (attributePath.length == 0) {
        return null
    }

    const attributeName = attributePath.pop()
    let attributes = await context.client.attributes({
        where: {
            name: attributeName,
            attribute: {
                id: parentId,
            }
        }
    })

    if (attributes.length > 1) {
        // Problem
    }
    else if (attributes.length == 1) {
        await recAttributeCreation(context, info, attributePath, attributes[0].id)
    }
    else {
        let attribute = {
            attribute: {
                connect: {
                    id: parentId
                }
            },
            name: attributeName,
        }

        if (attributePath.length > 0) {
            attribute['attributes'] = {
                create: [
                    recData(attributePath)
                ]
            }
        }

        await context.client.createAttribute({
            ...attribute,
        })
    }
}

export const checkAttribute = async (parent, args, context: Context, info) => {
    // Resource exists ?
    const resources = await context.client.resources({
        where: {
            name: args.resource,
            database: {
                name: args.database
            }
        }
    })

    if (resources.length > 1) {
        // Problem
    }
    else if (resources.length == 1) {
        let attributePath = args.attributePath.reverse()
        const attributeName = attributePath.pop()

        let attributes = await context.client.attributes({
            where: {
                name: attributeName,
                resource: {
                    id: resources[0].id,
                }
            }
        })

        if (attributes.length > 1) {
            // Problem
        }
        else if (attributes.length == 1) {
            // Recursive creation
            await recAttributeCreation(context, info, attributePath, attributes[0].id)
        }
        else {
            let attribute = {
                resource: {
                    connect: {
                        id: resources[0].id,
                    }
                },
                name: attributeName,
            }

            if (attributePath.length > 0) {
                attribute['attributes'] = {
                    create: [
                        recData(attributePath)
                    ]
                }
            }

            await context.client.createAttribute({
                ...attribute,
            })
        }
    }
    else {
        await context.client.createResource({
            database: {
                connect: {
                    name: args.database,
                }
            },
            name: args.resource,
            attributes: {
                create: [
                    recData(args.attributePath.reverse())
                ]
            }
        })
    }
}

export const getAttribute = async (parent, args, context: Context, info) => {
    // TODO: info should not be passed to this query;
    // here, we do it because it can happen that attributePath
    // is of size 1, therefore this is the only query that is ran
    // by this function.
    const initialAttributes = await context.client.attributes({
        where: {
            name: args.attributePath[0],
            resource: {
                name: args.resource,
                database: {
                    name: args.database,
                }
            }
        }
    })

    if (initialAttributes.length > 1) {
        //Problem
    }

    let attributes = initialAttributes

    for (let i = 1; i < args.attributePath.length; i++) {
        if (i != args.attributePath.length - 1) {
            attributes = await context.client.attributes({
                where: {
                    name: args.attributePath[i],
                    attribute: {
                        id: attributes[0].id,
                    }
                }
            })
        } else {
            // TODO: rendre info optionnel pour renvoyer tous
            // les champs disponibles
            attributes = await context.client.attributes({
                where: {
                    name: args.attributePath[i],
                    attribute: {
                        id: attributes[0].id,
                    }
                }
            })
        }
    }

    return attributes[0]
}

export const recAttributes = async (context: Context, parentIsResource: boolean, parentId: string, acc: string[]) => {
    console.log(`recAttributes ${parentIsResource} ${acc}`)

    let attributes
    if (parentIsResource) {
        attributes = await context.client.attributes({
            where: {
                resource: {
                    id: parentId,
                }
            }
        })

        console.log(`${attributes.length} children for ${acc}`)

        return attributes.map(async (attribute: any) => {
            let a = await recAttributes(context, false, attribute.id, [...acc, attribute.name])

            return {
                ...attribute,
                attributes: a,
            }
        })
    } else {
        attributes = await context.client.attributes({
            where: {
                attribute: {
                    id: parentId,
                }
            }
        })

        console.log(`${attributes.length} children for ${acc}`)

        return attributes.map(async (attribute: any) => {
            let a = await recAttributes(context, false, attribute.id, [...acc, attribute.name])

            return {
                ...attribute,
                attributes: a,
            }
        })
    }
}

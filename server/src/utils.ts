import { GraphQLResolveInfo } from 'graphql'
import * as jwt from 'jsonwebtoken'

import { Prisma as PrismaClient } from './generated/prisma-client'
import { Prisma as PrismaBinding } from './generated/prisma-binding'

export interface Context {
    binding: PrismaBinding
    client: PrismaClient
    request?: any
    response?: any
    connection?: any
}

// Inspiré du code de forwardTo de prisma-binding
// https://github.com/graphql-binding/graphql-binding/blob/master/src/utils/index.ts#L73
// sur une recommandation de nilan
// https://github.com/graphql-binding/graphql-binding/issues/40
// Cette fonction est un simple wrapper qui appelle la fonction getUserId
// avant de faire suivre la requête au callback.
export const checkAuth = (callback: (parent, args, context: Context, info: GraphQLResolveInfo) => any) => {
    return <PARENT, ARGS>(
        parent: PARENT,
        args: ARGS,
        context: Context,
        info: GraphQLResolveInfo,
    ) => {
        getUserId(context)

        return callback(parent, args, context, info)
    }
}

export const checkIsAdmin = (callback: (parent, args, context: Context, info: GraphQLResolveInfo) => any) => {
    return async <PARENT, ARGS>(
        parent: PARENT,
        args: ARGS,
        context: Context,
        info: GraphQLResolveInfo,
    ) => {
        const userId = getUserId(context)
        const user = await context.client.user({ id: userId })

        if (user.role != 'ADMIN') {
            throw new PermissionError()
        }

        return callback(parent, args, context, info)
    }
}

export const getUserId = (context: Context) => {
    // Token appears in different places depending
    // on whether the request is HTTP or WS
    const Authorization = context.request ?
        context.request.get('Authorization') :
        (context.connection.context.Authorization || null)

    if (Authorization) {
        const token = Authorization.replace('Bearer ', '')
        const { userId } = jwt.verify(token, process.env.APP_SECRET) as { userId: string }
        return userId
    }

    throw new AuthError()
}

export class AuthError extends Error {
    constructor() {
        super('Not authenticated')
    }
}

export class PermissionError extends Error {
    constructor() {
        super('Not authorized')
    }
}

export class ServerError extends Error {
    constructor() {
        super('Internal Error')
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

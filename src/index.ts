import { GraphQLServer } from 'graphql-yoga'
import { importSchema } from 'graphql-import'
import { Prisma } from './generated/prisma'
import { Context } from './utils'

const recData = (attributePath: string[]) => {
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

const recAttributeCreation = async (context: Context, info, attributePath: string[], parentId) => {
    if (attributePath.length == 0) {
        return null
    }

    const attributeName = attributePath.pop()
    let attributes = await context.db.query.attributes({
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
        let data = {
            attribute: {
                connect: {
                    id: parentId
                }
            },
            name: attributeName,
        }

        if (attributePath.length > 0) {
            data['attributes'] = {
                create: [
                    recData(attributePath)
                ]
            }
        }

        await context.db.mutation.createAttribute({
            data: data
        })
    }
}

const checkAttribute = async (parent, args, context: Context, info) => {
    // Resource exists ?
    const resources = await context.db.query.resources({
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

        let attributes = await context.db.query.attributes({
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
            let data = {
                resource: {
                    connect: {
                        id: resources[0].id,
                    }
                },
                name: attributeName,
            }

            if (attributePath.length > 0) {
                data['attributes'] = {
                    create: [
                        recData(attributePath)
                    ]
                }
            }

            await context.db.mutation.createAttribute({
                data: data
            })
        }
    }
    else {
        await context.db.mutation.createResource({
            data: {
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
            }
        }, info)
    }
}

const getAttribute = async (parent, args, context: Context, info) => {
    // TODO: info should not be passed to this query;
    // here, we do it because it can happen that attributePath
    // is of size 1, therefore this is the only query that is ran
    // by this function.
    const initialAttributes = await context.db.query.attributes({
        where: {
            name: args.attributePath[0],
            resource: {
                name: args.resource,
                database: {
                    name: args.database,
                }
            }
        }
    }, info)

    if (initialAttributes.length > 1) {
        //Problem
    }

    let attributes = initialAttributes

    for (let i = 1; i < args.attributePath.length; i++) {
        if (i != args.attributePath.length - 1) {
            attributes = await context.db.query.attributes({
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
            attributes = await context.db.query.attributes({
                where: {
                    name: args.attributePath[i],
                    attribute: {
                        id: attributes[0].id,
                    }
                }
            }, info)
        }
    }

    return attributes[0]
}

const recAttributes = async (context: Context, parentIsResource: boolean, parentId: string, acc: string[]) => {
    console.log(`recAttributes ${parentIsResource} ${acc}`)

    let attributes
    if (parentIsResource) {
        attributes = await context.db.query.attributes({
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
        attributes = await context.db.query.attributes({
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

const resolvers = {
    Query: {
        databases(parent, args, context: Context, info) {
            return context.db.query.databases({
                where: {
                    ...args.where,
                }
            }, info)
        },
        resources(parent, args, context: Context, info) {
            return context.db.query.resources({
                where: {
                    ...args.where,
                }
            }, info)
        },
        attributes(parent, args, context: Context, info) {
            return context.db.query.attributes({
                where: {
                    ...args.where,
                }
            }, info)
        },
        inputColumns(parent, args, context: Context, info) {
            return context.db.query.inputColumns({
                where: {
                    ...args.where,
                }
            }, info)
        },
        database(parent, args, context: Context, info) {
            return context.db.query.database({
                where: {
                    ...args.where,
                }
            }, info)
        },
        resource(parent, args, context: Context, info) {
            return context.db.query.resource({
                where: {
                    ...args.where,
                }
            }, info)
        },
        attribute(parent, args, context: Context, info) {
            return context.db.query.attribute({
                where: {
                    ...args.where,
                }
            }, info)
        },
        inputColumn(parent, args, context: Context, info) {
            return context.db.query.inputColumn({
                where: {
                    ...args.where,
                }
            }, info)
        },
        async getAttribute(parent, args, context: Context, info) {
            // Build attribute in database if doesn't already exist
            const att = await checkAttribute(parent, JSON.parse(JSON.stringify(args)), context, info)

            return getAttribute(parent, args, context, info)
        },
        async getResource(parent, args, context: Context, info) {
            const resources = await context.db.query.resources({
                where: {
                    name: args.resource,
                    database: {
                        name: args.database,
                    }
                }
            }, info)

            if (resources.length == 1) {
                return resources[0]
            }
            else {
                // Problem
            }
        },
        async getRecResource(parent, args, context: Context, info) {
            const resources = await context.db.query.resources({
                where: {
                    name: args.resource,
                    database: {
                        name: args.database,
                    }
                }
            })

            if (resources.length == 1) {
                const resourceId = resources[0].id

                let attributes = await recAttributes(context, true, resources[0].id, [resources[0].name])

                return {
                    ...resources[0],
                    attributes,
                }
            }
            else {
                // TODO: Problem
            }
        }
    },
    Mutation: {
        createResourceTreeInDatabase(parent, args, context: Context, info) {
            try {
                let json_query = require('../../fhir-store/graphql/' + args.resource + '.json')

                return context.db.mutation.createResource({
                    data: {
                        database: {
                            connect: {
                                name: args.database
                            }
                        },
                        name: (<any>json_query).name,
                        attributes: (<any>json_query).attributes,
                    }
                })
            } catch (error) {
                // TODO: return something consistent
                console.log('Problem boy')
            }
        },
        async updateAttributeNoId(parent, args, context: Context, info) {
            let attribute = await getAttribute(parent, {
                database: args.database,
                resource: args.resource,
                attributePath: args.attributePath,
            }, context, info)

            return context.db.mutation.updateAttribute({
                data: args.data,
                where: {
                    id: attribute.id,
                }
            }, info)
        },
        updateAttribute(parent, args, context: Context, info) {
            return context.db.mutation.updateAttribute({
                data: {
                    ...args.data,
                },
                where: {
                    id: args.id,
                }
            }, info)
        },
        updateInputColumn(parent, args, context: Context, info) {
            return context.db.mutation.updateInputColumn({
                data: {
                    ...args.data,
                },
                where: {
                    id: args.id,
                }
            }, info)
        },
        updateResource(parent, args, context: Context, info) {
            return context.db.mutation.updateResource({
                data: {
                    ...args.data,
                },
                where: {
                    id: args.id,
                }
            }, info)
        },
        updateJoin(parent, args, context: Context, info) {
            return context.db.mutation.updateJoin({
                data: {
                    ...args.data,
                },
                where: {
                    id: args.id,
                }
            }, info)
        },
    },
    Subscription: {
        resource: {
            subscribe: (parent, args, context, info) => {
                return context.db.subscription.resource({
                    where: {
                        node: {
                            id: args.id,
                        }
                    }
                }, info)
            },
        },
        attribute: {
            subscribe: (parent, args, context, info) => {
                return context.db.subscription.attribute({
                    where: {
                        node: {
                            id: args.id,
                        }
                    }
                }, info)
            },
        },
        inputColumn: {
            subscribe: (parent, args, context, info) => {
                return context.db.subscription.inputColumn({
                    where: {
                        node: {
                            id: args.id,
                        }
                    }
                }, info)
            },
        },
        join: {
            subscribe: (parent, args, context, info) => {
                return context.db.subscription.join({
                    where: {
                        node: {
                            id: args.id,
                        }
                    }
                }, info)
            },
        },
    }
}

const endPoint = (process.env.NODE_ENV === "docker") ? "http://prisma:4466" : "https://eu1.prisma.sh/public-neonswoop-398/graphql-typescript-boilerplate/dev"

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: req => ({
        ...req,
        db: new Prisma({
            endpoint: endPoint, // the endpoint of the Prisma API
            debug: true, // log all GraphQL queries & mutations sent to the Prisma API
            // secret: 'mysecret123', // only needed if specified in `database/prisma.yml`
        }),
    }),
})

server.start(() => console.log('Server is running on http://localhost:4000'))

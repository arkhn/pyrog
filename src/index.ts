import { GraphQLServer } from 'graphql-yoga'
import { importSchema } from 'graphql-import'
import { Prisma } from './generated/prisma'
import { Context } from './utils'

const resolvers = {
    Query: {
        customQuery(parent, args, context: Context, info) {
            let r = context.db.query.mapping({
                where: {
                    ...args.whereDatabase,
                }
            }).then((response) => {
                console.log(response)
            })

            console.log('here')
            console.log(r)

            return r
        },
        mappings(parent, args, context: Context, info) {
            return context.db.query.mappings({
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
        mapping(parent, args, context: Context, info) {
            return context.db.query.mapping({
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
    },
    Mutation: {
        updateResourcePrimaryKey(parent, args, context: Context, info) {
            return context.db.mutation.updateResource({
                data: {
                    primaryKey: args.primaryKey,
                },
                where: {
                    id: args.id,
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
            })
        },
        updateInputColumn(parent, args, context: Context, info) {
            return context.db.mutation.updateInputColumn({
                data: {
                    ...args.data,
                },
                where: {
                    id: args.id,
                }
            })
        },
        deleteInputColumn(parent, args, context: Context, info) {
            return context.db.mutation.deleteInputColumn({
                where: {
                    id: args.id,
                }
            })
        },
    },
    Subscription: {
        resourceSubscription: {
            subscribe: (parent, args, ctx, info) => {
                return ctx.db.subscription.resource({
                    where: {
                        node: {
                            id: args.id,
                        }
                    }
                }, info)
            },
        },
        attributeSubscription: {
            subscribe: (parent, args, ctx, info) => {
                return ctx.db.subscription.attribute({
                    where: {
                        node: {
                            id: args.id,
                        }
                    }
                }, info)
            },
        },
        inputColumnSubscription: {
            subscribe: (parent, args, ctx, info) => {
                return ctx.db.subscription.inputColumn({
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


const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: req => ({
        ...req,
        db: new Prisma({
            endpoint: 'https://eu1.prisma.sh/public-neonswoop-398/graphql-typescript-boilerplate/dev', // the endpoint of the Prisma API
            debug: true, // log all GraphQL queries & mutations sent to the Prisma API
            // secret: 'mysecret123', // only needed if specified in `database/prisma.yml`
        }),
    }),
})

server.start(() => console.log('Server is running on http://localhost:4000'))

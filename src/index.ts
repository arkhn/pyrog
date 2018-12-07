import { GraphQLServer } from 'graphql-yoga'
import { importSchema } from 'graphql-import'
import { Prisma } from './generated/prisma'
import { Context } from './utils'

// const checkAttribute = async (parent, args, context: Context, info) => {
//     // Make sure database, resource and attribute exist
//     // before returning attribute
//     const databaseExists = await context.db.exists.Database({
//         name: args.database,
//     })
//
//     if (databaseExists) {
//         console.log('Database OK')
//
//         // This query is supposed to be injective
//         const resources = await context.db.query.resources({
//             where: {
//                 name: args.resource,
//                 database: {
//                     name: args.database,
//                 }
//             }
//         })
//
//         console.log('Resource loaded')
//
//         if (resources.length > 0) {
//             console.log(`Resource OK (${resources.length})`)
//
//             const attributes = await context.db.query.attributes({
//                 where: {
//                     name: args.attribute,
//                     resource: {
//                         id: resources[0].id,
//                     },
//                 }
//             })
//
//             console.log(`Attribute loaded (${attributes.length})`)
//
//             if (attributes.length > 0) {
//                 console.log(`Attribute OK (${attributes.length})`)
//                 return attributes[0]
//             } else {
//                 console.log('Attribute NO')
//                 return context.db.mutation.createAttribute({
//                     data: {
//                         name: args.attribute,
//                         resource: {
//                             connect: {
//                                 id: resources[0].id,
//                             }
//                         }
//                     }
//                 })
//             }
//         } else {
//             console.log('Resource NO')
//             return context.db.mutation.createAttribute({
//                 data: {
//                     name: args.attribute,
//                     resource: {
//                         create: {
//                             name: args.resource,
//                             database: {
//                                 connect: {
//                                     name: args.database,
//                                 }
//                             }
//                         }
//                     }
//                 }
//             })
//         }
//     } else {
//         console.log('Database NO')
//         return context.db.mutation.createAttribute({
//             data: {
//                 name: args.attribute,
//                 resource: {
//                     create: {
//                         name: args.resource,
//                         database: {
//                             create: {
//                                 name: args.database,
//                             }
//                         }
//                     }
//                 }
//             }
//         })
//     }
// }

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
            await context.db.mutation.createAttribute({
                data: {
                    resource: {
                        connect: {
                            id: resources[0].id,
                        }
                    },
                    name: attributeName,
                    attributes: {
                        create: [
                            recData(attributePath)
                        ]
                    }
                }
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
            let att = await checkAttribute(parent, JSON.parse(JSON.stringify(args)), context, info)

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
            })

            if (initialAttributes.length > 1) {
                //Problem
            }

            let attributes = initialAttributes

            for (let i = 1; i < args.attributePath.length; i++) {
                if (i != args.attributePath.length - 1) {
                    console.log(args.attributePath[i])
                    attributes = await context.db.query.attributes({
                        where: {
                            name: args.attributePath[i],
                            attribute: {
                                id: attributes[0].id,
                            }
                        }
                    })
                } else {
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
        },
    },
    Mutation: {
        // async checkAttribute(parent, args, context: Context, info) {
        //     return checkAttribute(parent, args, context, info)
        // },
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
        updateResource(parent, args, context: Context, info) {
            return context.db.mutation.updateResource({
                data: {
                    ...args.data,
                },
                where: {
                    id: args.id,
                }
            })
        },
    },
    Subscription: {
        // customAttributeSubscription: {
        //     subscribe: async (parent, args, context, info) => {
        //         const attribute = await checkAttribute(parent, args, context, info)
        //         console.log(attribute.id)
        //
        //         return context.db.subscription.attribute({
        //             where: {
        //                 node: {
        //                     id: attribute.id,
        //                 }
        //             }
        //         }, info)
        //     },
        // },
        // resourceSubscription: {
        //     subscribe: (parent, args, context, info) => {
        //         return context.db.subscription.resource({
        //             where: {
        //                 node: {
        //                     id: args.id,
        //                 }
        //             }
        //         }, info)
        //     },
        // },
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

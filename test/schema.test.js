import { GraphQLServer } from 'graphql-yoga'

import { Prisma as PrismaClient } from '../src/generated/prisma-client'
import { Prisma as PrismaBinding } from '../src/generated/prisma-binding'
import resolvers from '../src/resolvers'

const endpoint = 'http://localhost:4466'

describe('Graphql server', () => {
    test('Graphql-yoga server can start & stop', async () => {
        const serverInstance = new GraphQLServer({
            typeDefs: './src/schema.graphql',
            resolvers,
            context: request => ({
                ...request,
                binding: new PrismaBinding({
                    endpoint,
                    debug: true,
                }),
                client: new PrismaClient({
                    endpoint,
                    debug: true,
                }),
            }),
            resolverValidationOptions: {
                requireResolversForResolveType: false,
            },
        })

        // Start server without callback
        const server = await serverInstance.start()

        // Close server
        expect(server.close()).toHaveProperty("_connections", 0);
    })
})

const prismaBindingInstance = () => {
    return new PrismaBinding({
        endpoint,
    })
}

describe('Prisma binding', () => {
    test('Send direct request', async () => {
        expect(
            await prismaBindingInstance().request(
                `query {
                    databases {
                        name
                    }
                }`,
                {}
            )
        ).toEqual({
            data: {
                databases: [
                    {
                        name: "Crossway"
                    }
                ]
            }
        })
    })

    test('Use `query` method', async () => {
        expect(
            await prismaBindingInstance().query.databases({}, `{name}`)
        ).toEqual([
            {
                name: "Crossway"
            }
        ])
    })
})

const prismaClientInstance = new PrismaClient({
    endpoint,
})

describe('Prisma client', () => {
    test('Query - databases', async () => {
        expect(
            await prismaClientInstance.database({ name: "Crossway" })
        ).toEqual(expect.objectContaining(
            {
                name: "Crossway"
            }
        ))
    })
});

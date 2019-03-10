import { graphql } from 'graphql'
import { importSchema } from 'graphql-import'
import {
    makeExecutableSchema,
    addMockFunctionsToSchema,
    mockServer,
} from 'graphql-tools'
import { GraphQLServer } from 'graphql-yoga'
import { Prisma } from 'prisma-binding'

import { resolvers } from '../src/resolvers'


const typeDefs = importSchema('./src/schema.graphql')

const testInstance = () => {
    return new Prisma({
        typeDefs,
        endpoint: 'https://eu1.prisma.sh/public-neonswoop-398/graphql-typescript-boilerplate/dev',
    })
}

describe('Server', () => {
    test('Graphql-yoga server can start & stop', async () => {
        const serverInstance = new GraphQLServer({
            typeDefs: './src/schema.graphql',
            resolvers,
            context: req => ({
                ...req,
                db: new Prisma({
                    endpoint: 'https://eu1.prisma.sh/public-neonswoop-398/graphql-typescript-boilerplate/dev',
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

    test('Can query Prisma instance directly', async () => {
        expect(
            await testInstance().request(
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
})

describe('Resolver (Queries & Mutations)', () => {
    test('Query - databases', async () => {
        expect(
            await resolvers.Query.databases({}, {}, {db: testInstance()}, `{name}`)
        ).toEqual([
            {
                name: "Crossway"
            }
        ])
    })
});

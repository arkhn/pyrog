import { graphql } from 'graphql'
import { importSchema } from 'graphql-import'
import { makeExecutableSchema } from 'graphql-tools'
import { GraphQLServer } from 'graphql-yoga'

import { Prisma as PrismaClient } from '../src/generated/prisma-client'
import { Prisma as PrismaBinding } from '../src/generated/prisma-binding'
import resolvers from '../src/resolvers'

const endpoint = 'http://localhost:4466'

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
    describe('Queries', () => {
        test('database', async () => {
            expect(
                await prismaClientInstance.database({ name: "Crossway" })
            ).toEqual(expect.objectContaining({ name: "Crossway" }))
        })

        test('databases', async () => {
            expect(
                await prismaClientInstance.databases()
            ).toEqual(expect.arrayContaining([
                expect.objectContaining({ name: "Crossway" })
            ]))
        })
    })
});

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

describe.skip('Graphql server', () => {
    let server
    let executableSchema

    beforeAll(async () => {
        // console.log(serverInstance)
        const typeDefs = importSchema('./src/schema.graphql')
        executableSchema = makeExecutableSchema({ typeDefs })
        server = await serverInstance.start()
    })

    test('Query allDatabases', async () => {
        expect(
            await graphql(serverInstance.executableSchema, `query {allDatabases { id }}`)
            // await graphql(executableSchema, `query {allDatabases { id }}`)
            // await server.post(`query {allDatabases { id }}`)
        ).toEqual(expect.arrayContaining([{
            name: "Crossway"
        }]))
    })

    afterAll(() => {
        server.close()
    })
})

import { graphql } from 'graphql'
import { importSchema } from 'graphql-import'
import { makeExecutableSchema, mockServer } from 'graphql-tools'
import { GraphQLServer } from 'graphql-yoga'
const stringifyObject = require('stringify-object');

import { Prisma as PrismaClient } from '../src/generated/prisma-client'
import { Prisma as PrismaBinding } from '../src/generated/prisma-binding'
import resolvers from '../src/resolvers'

const endpoint = 'http://localhost:4466'
const debug = false

const prismaBindingInstance = () => {
    return new PrismaBinding({
        endpoint,
        debug,
    })
}

describe('Prisma binding', () => {
    test('Send direct request', async () => {
        expect(
            await prismaBindingInstance().request(`query { sources { name } }`, {})
        ).toEqual({
            data: {
                sources: expect.arrayContaining([
                    expect.objectContaining({ name: "Mimic" })
                ])
            }
        })
    })

    test('Use `query` method', async () => {
        expect(
            await prismaBindingInstance().query.sources({}, `{name}`)
        ).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: "Mimic" })
        ]))
    })
})

const prismaClientInstance = new PrismaClient({
    endpoint,
    debug,
})

describe('Prisma client', () => {
    describe('Queries', () => {
        test('source', async () => {
            expect(
                await prismaClientInstance.source({ name: "Mimic" })
            ).toEqual(expect.objectContaining({ name: "Mimic" }))
        })

        test('sources', async () => {
            expect(
                await prismaClientInstance.sources()
            ).toEqual(expect.arrayContaining([
                expect.objectContaining({ name: "Mimic" })
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
            debug,
        }),
        client: new PrismaClient({
            endpoint,
            debug,
        }),
    }),
    resolverValidationOptions: {
        requireResolversForResolveType: false,
    },
})

const sendPostRequest = async (query, variables) => {
    return await fetch(`http://0.0.0.0:${process.env.SERVER_PORT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables,
        })
    }).then(response => {
        return response.json()
    })
}

describe('Graphql server', () => {
    let server
    // Définition de différents cas à tester.
    // On rentre d'abord le nom du endpoint, puis les
    // attributs et enfin les variables.
    const useCases = [
        [
            'allSources',
            null,
            null,
        ],
        [
            'availableResources',
            {
                source: "Mimic"
            },
            null,
        ]
    ]

    beforeAll(async () => {
        server = await serverInstance.start()
    })

    describe.each(useCases)('Should request authentication', (queryName, queryAttr, queryVar) => {
        test(queryName, async () => {
            // Création d'un string représentant les requêtes à tester.
            const queryAttributes = stringifyObject(queryAttr, { singleQuotes: false, })
            const query = `query { ${queryName} ${queryAttr ? `(${queryAttributes.slice(1, queryAttributes.length -1)})` : ""} { id }}`

            expect(
                await sendPostRequest(query, {})
            ).toEqual(expect.objectContaining({
                errors: expect.arrayContaining([
                    expect.objectContaining({ message: "Not authorized" })
                ])
            }))
        })
    })

    describe.skip('Queries', () => {
        test('allSources', async () => {
            expect(
                await sendPostRequest(`query { allSources { id name }}`, {})
            ).toEqual({
                data: {
                    allSources: expect.arrayContaining([
                        expect.objectContaining({ name: "Mimic" })
                    ])
                }
            })
        })
    })

    afterAll(() => {
        server.close()
    })
})

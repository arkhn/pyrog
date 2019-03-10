import { GraphQLServer } from 'graphql-yoga'

import { Prisma as PrismaClient } from './generated/prisma-client'
import { Prisma as PrismaBinding } from './generated/prisma-binding'
import resolvers from './resolvers'

const endpoint = 'http://localhost:4466'

const server = new GraphQLServer({
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
})

server.start(() => console.log('🚀 Server is running on http://localhost:4000'))

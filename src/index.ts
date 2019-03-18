import { GraphQLServer } from 'graphql-yoga'

import 'graphql-import-node'
import * as Schema from './schema.graphql'

import { Prisma as PrismaClient } from './generated/prisma-client'
import { Prisma as PrismaBinding } from './generated/prisma-binding'
import resolvers from './resolvers'

const endpoint = 'http://localhost:4466'

const server = new GraphQLServer({
    typeDefs: Schema,
    // Resolvers have different types in various dependencies.
    // A quick workaround consists in any-casting resolvers.
    // This issue can be tracked here:
    // https://github.com/prisma/graphqlgen/issues/15#issuecomment-461024244
    resolvers: resolvers as any,
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

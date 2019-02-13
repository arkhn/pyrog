import { GraphQLServer } from 'graphql-yoga'
import { Prisma } from './generated/prisma'
import { resolvers } from './resolvers'


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

server.start(() => console.log('🚀 Server is running on http://localhost:4000'))

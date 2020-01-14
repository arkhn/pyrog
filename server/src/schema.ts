import { nexusPrismaPlugin } from 'nexus-prisma'
import { makeSchema } from 'nexus'

import * as resolvers from 'resolvers'

export const schema = makeSchema({
  types: resolvers,
  plugins: [nexusPrismaPlugin()],
  outputs: {
    schema: __dirname + '/generated/schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  typegenAutoConfig: {
    sources: [
      {
        source: '@prisma/photon',
        alias: 'photon',
      },
      {
        source: require.resolve('./context'),
        alias: 'Context',
      },
    ],
    contextType: 'Context.Context',
  },
})

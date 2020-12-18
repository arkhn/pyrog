import { nexusPrisma } from 'nexus-plugin-prisma'
import { makeSchema } from 'nexus'

import * as resolvers from 'resolvers'

export const schema = makeSchema({
  types: resolvers,
  plugins: [
    nexusPrisma({
      experimentalCRUD: true,
    }),
  ],
  outputs: {
    schema: __dirname + '/generated/schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
})

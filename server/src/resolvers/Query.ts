import { idArg, nonNull, nullable, queryType } from 'nexus'

import { getDefinition } from 'fhir'
import { sources } from './Source'

export const Query = queryType({
  definition(t) {
    t.nullable.field('me', {
      type: 'User',
      resolve: async (_, __, ctx) => ctx.user || null,
    })

    t.crud.credential()

    t.crud.templates()

    t.crud.template()

    t.list.field('sources', {
      type: 'Source',
      resolve: sources,
    })

    t.crud.source()

    t.crud.resource()

    t.crud.attribute()
    t.crud.attributes({ filtering: true })

    t.nullable.field('structureDefinition', {
      type: 'StructureDefinition',
      args: {
        definitionId: nonNull(idArg()),
      },
      resolve: async (_, { definitionId }) => getDefinition(definitionId),
    })
  },
})

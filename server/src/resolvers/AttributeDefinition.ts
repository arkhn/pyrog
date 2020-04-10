import { objectType } from '@nexus/schema'

import { typeExtensions } from 'fhir/definitions'

export const AttributeDefinition = objectType({
  name: 'AttributeDefinition',
  definition(t) {
    t.field('id', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.definition.id
      },
    })

    t.field('attribute', {
      type: 'JSON',
      resolve: (parent: any) => {
        return parent
      },
    })

    t.list.field('extensions', {
      type: 'StructureDefinition',
      description: 'List of extensions on this type',
      resolve: async (parent: any) => [
        ...(await typeExtensions(parent.definition.id)),
        ...(await typeExtensions(parent.types[0])),
      ],
    })
  },
})

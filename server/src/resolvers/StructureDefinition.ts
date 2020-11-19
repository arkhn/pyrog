import { objectType } from '@nexus/schema'

export const StructureDefinition = objectType({
  name: 'StructureDefinition',
  definition(t) {
    t.field('id', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.meta.id
      },
    })

    t.field('type', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.meta.type
      },
    })

    t.field('name', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.meta.name
      },
    })

    t.field('derivation', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.meta.derivation
      },
    })

    t.field('kind', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.meta.kind
      },
    })

    t.field('url', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.meta.url
      },
    })

    t.field('publisher', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.meta.publisher
      },
    })

    t.list.field('attributes', {
      type: 'AttributeDefinition',
      description: 'Structured version of the attributes',
      resolve: (parent: any) => parent.attributes,
    })
  },
})

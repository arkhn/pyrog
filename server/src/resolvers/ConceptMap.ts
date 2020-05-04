import { objectType } from '@nexus/schema'

export const ConceptMap = objectType({
  name: 'ConceptMap',
  definition(t) {
    t.field('id', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.id
      },
    })

    t.field('title', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.title
      },
    })

    t.field('name', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.name
      },
    })
  },
})

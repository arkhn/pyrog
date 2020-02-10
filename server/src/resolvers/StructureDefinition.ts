import { objectType } from 'nexus'
import { getDefinition } from 'fhir'

export const StructureDefinition = objectType({
  name: 'StructureDefinition',
  definition(t) {
    t.field('id', {
      type: 'String',
      resolve: (parent: any) => {
        const def = getDefinition(parent.id)
        if (!def) {
          throw new Error(`Could not find definition ${parent.id}`)
        }
        return def.$meta.id
      },
    })

    t.field('type', {
      type: 'String',
      resolve: (parent: any) => {
        const def = getDefinition(parent.id)
        if (!def) {
          throw new Error(`Could not find definition ${parent.id}`)
        }
        return def.$meta.type
      },
    })

    t.field('name', {
      type: 'String',
      resolve: (parent: any) => {
        const def = getDefinition(parent.id)
        if (!def) {
          throw new Error(`Could not find definition ${parent.id}`)
        }
        return def.$meta.name
      },
    })

    t.field('display', {
      type: 'JSON',
      description: 'Structured version of a definition',
      resolve: (parent: any) => {
        const def = getDefinition(parent.id)
        if (!def) {
          throw new Error(`Could not find definition ${parent.id}`)
        }
        return def
      },
    })
  },
})

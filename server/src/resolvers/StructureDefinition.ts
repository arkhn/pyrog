import { objectType } from 'nexus'
import { getDefinition } from 'fhir'
import { allDefinitions } from 'fhir/definitions'

import { NexusGenInputs } from 'generated/nexus'

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

    t.list.field('profiles', {
      type: 'StructureDefinition',
      description: 'List of profiles on this resource',
      resolve: (parent: any) => searchDefinitions({ type: parent.id }),
    })
  },
})

export const searchDefinitions = (
  filter: NexusGenInputs['StructureDefinitionWhereFilter'],
) => {
  const defs = allDefinitions()
  const { derivation, kind, type } = filter
  return defs
    .filter(d => (derivation ? derivation === d.$meta.derivation : true))
    .filter(d => (kind ? kind === d.$meta.kind : true))
    .filter(d => (type ? type === d.$meta.type : true))
    .map(({ $meta: { type, name, id } }) => ({ id, name, type, display: null }))
}

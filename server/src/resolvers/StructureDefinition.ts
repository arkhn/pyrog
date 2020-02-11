import { objectType } from 'nexus'
import { resourceProfiles, resourcesPerKind } from 'fhir/definitions'

import { NexusGenInputs } from 'generated/nexus'
import { StructureDefinition as StructDef } from 'types'
import { mapObj } from 'nexus/dist/core'

export const StructureDefinition = objectType({
  name: 'StructureDefinition',
  definition(t) {
    t.field('id', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.def.$meta.id
      },
    })

    t.field('type', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.def.$meta.type
      },
    })

    t.field('name', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.def.$meta.name
      },
    })

    t.field('display', {
      type: 'JSON',
      description: 'Structured version of a definition',
      resolve: (parent: any) => {
        return parent.def
      },
    })

    t.list.field('profiles', {
      type: 'StructureDefinition',
      description: 'List of profiles on this resource',
      resolve: async (parent: any) => {
        const res = await resourceProfiles(parent.def.$meta.type)
        return res.map(graphqlize)
      },
    })
  },
})

export const searchDefinitions = async (
  filter: NexusGenInputs['StructureDefinitionWhereFilter'],
) => {
  const { derivation, kind, type } = filter

  let res: StructDef[]
  if (derivation && kind && !type) {
    res = await resourcesPerKind(derivation, kind)
  } else if (!derivation && !kind && type) {
    res = await resourceProfiles(type)
  } else {
    throw new Error(
      'Can only use filters derivation and kind together, and type alone',
    )
  }
  return res.map(graphqlize)
}

const graphqlize = (r: StructDef) => ({
  id: r.$meta.id,
  def: r,
})

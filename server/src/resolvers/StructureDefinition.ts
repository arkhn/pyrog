import { objectType, FieldResolver } from 'nexus'
import axios from 'axios'

import {
  resourceProfiles,
  resourcesPerKind,
  cacheDefinition,
} from 'fhir/definitions'
import { StructureDefinition as StructDef } from 'types'
import { FHIR_API_URL } from '../constants'

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

export const searchDefinitions: FieldResolver<
  'Query',
  'structureDefinitions'
> = async (_, { filter }) => {
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

export const refreshDefinition: FieldResolver<
  'Mutation',
  'refreshDefinition'
> = async (_, { definitionId }) => {
  try {
    const { data } = await axios.get(
      `${FHIR_API_URL}/StructureDefinition/${definitionId}`,
    )
    const def = await cacheDefinition(data)
    return graphqlize(def)
  } catch (err) {
    throw new Error(err.response ? err.response.data : err.message)
  }
}

const graphqlize = (r: StructDef) => ({
  id: r.$meta.id,
  def: r,
})

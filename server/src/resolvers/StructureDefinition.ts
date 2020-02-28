import { objectType, FieldResolver } from 'nexus'
import axios from 'axios'

import {
  resourceProfiles,
  resourcesPerKind,
  cacheDefinition,
} from 'fhir/definitions'
import { CachedDefinition } from 'types'
import { FHIR_API_URL } from '../constants'

export const StructureDefinition = objectType({
  name: 'StructureDefinition',
  definition(t) {
    t.field('id', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.$meta.id
      },
    })

    t.field('type', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.$meta.type
      },
    })

    t.field('name', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.$meta.name
      },
    })

    t.field('derivation', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.$meta.derivation
      },
    })

    t.field('kind', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.$meta.kind
      },
    })

    t.field('url', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.$meta.url
      },
    })

    t.field('publisher', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.$meta.publisher
      },
    })

    t.field('display', {
      type: 'JSON',
      description: 'Structured version of a definition',
      resolve: (parent: any) => parent,
    })

    t.list.field('profiles', {
      type: 'StructureDefinition',
      description: 'List of profiles on this resource',
      resolve: async (parent: any) => resourceProfiles(parent.$meta.type),
    })
  },
})

export const searchDefinitions: FieldResolver<
  'Query',
  'structureDefinitions'
> = async (_, { filter }) => {
  const { derivation, kind, type } = filter

  let res: CachedDefinition[]
  if (derivation && kind && !type) {
    res = await resourcesPerKind(derivation, kind)
  } else if (!derivation && !kind && type) {
    res = await resourceProfiles(type)
  } else {
    throw new Error(
      'Can only use filters derivation and kind together, and type alone',
    )
  }
  return res
}

export const refreshDefinition: FieldResolver<
  'Mutation',
  'refreshDefinition'
> = async (_, { definitionId }) => {
  try {
    const { data } = await axios.get(
      `${FHIR_API_URL}/StructureDefinition/${definitionId}`,
    )
    return cacheDefinition(data)
  } catch (err) {
    throw new Error(err.response ? err.response.data : err.message)
  }
}

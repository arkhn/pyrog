import { objectType, FieldResolver } from '@nexus/schema'
import axios from 'axios'
import { Definition } from '@arkhn/fhir.ts'

import { getDefinition } from 'fhir'
import {
  resourceProfiles,
  resourcesPerKind,
  cacheDefinition,
  typeExtensions,
} from 'fhir/definitions'
import { FHIR_API_URL } from '../constants'

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

    t.list.field('extensions', {
      type: 'StructureDefinition',
      description: 'List of allowed extensions on this type',
      resolve: async (parent: any) =>
        // the the definition is not a root type (eg: observation-bodyweight), we need to return
        // extensions on observation-bodyweight (definition.id) and Observation (definition.type).
        parent.meta.type === parent.meta.id
          ? typeExtensions(parent.meta.id)
          : [
              ...(await typeExtensions(parent.meta.id)),
              ...(await typeExtensions(parent.meta.type)),
            ],
    })

    t.list.field('profiles', {
      type: 'StructureDefinition',
      description: 'List of profiles on this resource',
      resolve: async (parent: any) => resourceProfiles(parent.meta.type),
    })
  },
})

export const searchDefinitions: FieldResolver<
  'Query',
  'structureDefinitions'
> = async (_, { filter }) => {
  const { derivation, kind, type } = filter

  let res: Definition[]
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

export const searchProfiles: FieldResolver<'Query', 'usedProfiles'> = async (
  _,
  { sourceId },
  ctx,
) => {
  const source = await ctx.prisma.source.findOne({
    where: { id: sourceId },
    include: { template: true },
  })
  if (!source) {
    throw new Error(`source ${sourceId} does not exist`)
  }

  const resources = await ctx.prisma.resource.findMany({
    where: { source: { id: sourceId } },
  })

  const definitions = await Promise.all(
    resources.map(r => getDefinition(r.definitionId)),
  )

  const profileIds = definitions
    .filter(def => !!def && def.meta.id !== def.meta.type)
    .map(def => def!.meta.id)

  // Remove duplicates
  return profileIds.filter((id, index) => profileIds.indexOf(id) === index)
}

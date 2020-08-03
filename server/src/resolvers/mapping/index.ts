import { PrismaClient } from '@prisma/client'

import {
  MAPPING_VERSION_1,
  MAPPING_VERSION_2,
  MAPPING_VERSION_3,
  MAPPING_VERSION_4,
  MAPPING_VERSION_5,
  MAPPING_VERSION_6,
  MAPPING_VERSION_7,
  MAPPING_VERSION_8,
  CURRENT_MAPPING_VERSION,
} from '../../constants'
import handleV6 from './v6'
import handleV7 from './v7'
import handleV8 from './v8'
import { getDefinition } from 'fhir'

// copy all the resources from the mapping and their attributes.
// this is done through a single query matching the graph of the mapping.
export const importMapping = async (
  prismaClient: PrismaClient,
  sourceId: string,
  mapping: any,
) => {
  const { resources, version } = mapping
  if (!version) {
    throw new Error('Missing mapping version')
  }
  if (!resources) {
    throw new Error('Missing "resources" key in mapping')
  }
  switch (version) {
    case MAPPING_VERSION_1:
      throw new Error(
        `Your mapping version (v${MAPPING_VERSION_1}) is no longer supported. Please upgrade your export.`,
      )
    case MAPPING_VERSION_2:
      throw new Error(
        `Your mapping version (v${MAPPING_VERSION_2}) is no longer supported. Please upgrade your export.`,
      )
    case MAPPING_VERSION_3:
      throw new Error(
        `Your mapping version (v${MAPPING_VERSION_3}) is no longer supported. Please upgrade your export.`,
      )
    case MAPPING_VERSION_4:
      throw new Error(
        `Your mapping version (v${MAPPING_VERSION_4}) is no longer supported. Please upgrade your export.`,
      )
    case MAPPING_VERSION_5:
      throw new Error(
        `Your mapping version (v${MAPPING_VERSION_5}) is no longer supported. Please upgrade your export.`,
      )
    case MAPPING_VERSION_6:
      return handleV6(prismaClient, sourceId, resources)
    case MAPPING_VERSION_7:
      return handleV7(prismaClient, sourceId, resources)
    case MAPPING_VERSION_8:
      return handleV8(prismaClient, sourceId, resources)
    default:
      throw new Error(`Unknown mapping version: "${version}"`)
  }
}

export const exportMapping = async (
  prismaClient: PrismaClient,
  sourceId: string,
  includeComments: boolean,
): Promise<string> => {
  const source = await prismaClient.source.findOne({
    where: { id: sourceId },
    include: { template: true },
  })
  if (!source) {
    throw new Error(`source ${sourceId} does not exist`)
  }

  let resources = await prismaClient.resource.findMany({
    where: { source: { id: source.id } },
    include: {
      source: true,
      filters: { include: { sqlColumn: true } },
      attributes: {
        include: {
          ...(includeComments && {
            comments: { include: { author: { select: { email: true } } } },
          }),
          inputGroups: {
            include: {
              inputs: {
                include: {
                  sqlValue: {
                    include: { joins: { include: { tables: true } } },
                  },
                },
              },
              conditions: {
                include: {
                  column: true,
                },
              },
            },
          },
        },
      },
    },
  })

  // augment the mapping of each resource with its definition
  // and its source id. This is now required by fhir-river when
  // running from a mapping file.
  resources = await Promise.all(
    resources.map(async r => {
      const def = await getDefinition(r.definitionId)
      return {
        ...r,
        definition: def?.meta,
      }
    }),
  )

  return JSON.stringify({
    source: { id: source.id, name: source.name },
    template: { name: source.template.name },
    resources,
    version: CURRENT_MAPPING_VERSION,
  })
}

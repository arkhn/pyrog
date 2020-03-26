import { PrismaClient } from '@prisma/client'

import {
  MAPPING_VERSION_1,
  MAPPING_VERSION_2,
  MAPPING_VERSION_3,
  MAPPING_VERSION_4,
  MAPPING_VERSION_5,
  MAPPING_VERSION_6,
  CURRENT_MAPPING_VERSION,
} from '../../constants'
import handleV1 from './v1'
import handleV2 from './v2'
import handleV3 from './v3'
import handleV4 from './v4'
import handleV5 from './v5'
import handleV6 from './v6'
import { getDefinition } from 'fhir'

// copy all the resources from the mapping and their attributes.
// this is done through a single query matching the graph of the mapping.
export const importMapping = async (
  prismaClient: PrismaClient,
  sourceId: string,
  mapping: string,
) => {
  const { version, resources } = JSON.parse(mapping)
  if (!version) {
    throw new Error('Missing mapping version')
  }
  if (!resources) {
    throw new Error('Missing "resources" key in mapping')
  }
  switch (version) {
    case MAPPING_VERSION_1:
      return handleV1(prismaClient, sourceId, resources)
    case MAPPING_VERSION_2:
      return handleV2(prismaClient, sourceId, resources)
    case MAPPING_VERSION_3:
      return handleV3(prismaClient, sourceId, resources)
    case MAPPING_VERSION_4:
      return handleV4(prismaClient, sourceId, resources)
    case MAPPING_VERSION_5:
      return handleV5(prismaClient, sourceId, resources)
    case MAPPING_VERSION_6:
      return handleV6(prismaClient, sourceId, resources)
    default:
      throw new Error(`Unknown mapping version: "${version}"`)
  }
}

export const exportMapping = async (
  prismaClient: PrismaClient,
  sourceId: string,
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
          inputs: {
            include: {
              sqlValue: {
                include: { joins: { include: { tables: true } } },
              },
            },
          },
        },
      },
    },
  })

  // augment the mapping of each resource with its definition
  // and its source id. This is now required by fhir-pipe when
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
    source: { name: source.name, hasOwner: source.hasOwner },
    template: { name: source.template.name },
    resources,
    version: CURRENT_MAPPING_VERSION,
  })
}

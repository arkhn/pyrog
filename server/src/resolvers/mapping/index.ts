import { PrismaClient, Source } from '@prisma/client'

import {
  MAPPING_VERSION_1,
  MAPPING_VERSION_2,
  MAPPING_VERSION_3,
  MAPPING_VERSION_4,
  MAPPING_VERSION_5,
  MAPPING_VERSION_6,
  MAPPING_VERSION_7,
  MAPPING_VERSION_8,
  MAPPING_VERSION_9,
  CURRENT_MAPPING_VERSION,
  MAPPING_VERSION_10,
} from '../../constants'
import handleV10 from './v10'
import { getDefinition } from 'fhir'
import { ExportedSource } from 'types'

// copy all the resources from the mapping and their attributes.
// this is done through a single query matching the graph of the mapping.
export const importMapping = async (
  prismaClient: PrismaClient,
  source: Source,
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
      throw new Error(
        `Your mapping version (v${MAPPING_VERSION_6}) is no longer supported. Please upgrade your export.`,
      )
    case MAPPING_VERSION_7:
      throw new Error(
        `Your mapping version (v${MAPPING_VERSION_7}) is no longer supported. Please upgrade your export.`,
      )
    case MAPPING_VERSION_8:
      throw new Error(
        `Your mapping version (v${MAPPING_VERSION_8}) is no longer supported. Please upgrade your export.`,
      )
    case MAPPING_VERSION_9:
      throw new Error(
        `Your mapping version (v${MAPPING_VERSION_9}) is no longer supported. Please upgrade your export.`,
      )
    case MAPPING_VERSION_10:
      return handleV10(prismaClient, source, resources)
    default:
      throw new Error(`Unknown mapping version: "${version}"`)
  }
}

export const exportMapping = async (
  prismaClient: PrismaClient,
  sourceId: string,
  includeComments: boolean,
): Promise<string> => {
  const source = await prismaClient.source.findUnique({
    where: { id: sourceId },
    include: { template: true, credential: { include: { owners: true } } },
  })
  if (!source) {
    throw new Error(`source ${sourceId} does not exist`)
  }

  let resources = await prismaClient.resource.findMany({
    where: { source: { id: source.id } },
    include: {
      source: true,
      primaryKeyOwner: { select: { name: true, id: true } },
      filters: {
        include: {
          sqlColumn: {
            include: {
              joins: {
                include: {
                  tables: {
                    include: { owner: { select: { name: true, id: true } } },
                  },
                },
              },
              owner: { select: { name: true, id: true } },
            },
          },
        },
      },
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
                    include: {
                      joins: {
                        include: {
                          tables: {
                            include: {
                              owner: { select: { name: true, id: true } },
                            },
                          },
                        },
                      },
                      owner: { select: { name: true, id: true } },
                    },
                  },
                },
              },
              conditions: {
                include: {
                  sqlValue: {
                    include: {
                      joins: {
                        include: {
                          tables: {
                            include: {
                              owner: { select: { name: true, id: true } },
                            },
                          },
                        },
                      },
                      owner: { select: { name: true, id: true } },
                    },
                  },
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
    source: {
      id: source.id,
      name: source.name,
      credential: {
        owners: source.credential?.owners,
        model: source.credential?.model,
      },
    },
    template: { name: source.template.name },
    resources,
    version: CURRENT_MAPPING_VERSION,
  } as ExportedSource)
}

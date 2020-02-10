import { Photon } from '@prisma/photon'

import {
  MAPPING_VERSION_1,
  MAPPING_VERSION_2,
  CURRENT_MAPPING_VERSION,
  MAPPING_VERSION_3,
} from '../../constants'
import handleV1 from './v1'
import handleV2 from './v2'
import handleV3 from './v3'

// copy all the resources from the mapping and their attributes.
// this is done through a single query matching the graph of the mapping.
export const importMapping = async (
  photon: Photon,
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
      return handleV1(photon, sourceId, resources)
    case MAPPING_VERSION_2:
      return handleV2(photon, sourceId, resources)
    case MAPPING_VERSION_3:
      return handleV3(photon, sourceId, resources)
    default:
      throw new Error(`Unknown mapping version: "${version}"`)
  }
}

export const exportMapping = async (
  photon: Photon,
  sourceId: string,
): Promise<string> => {
  const source = await photon.sources.findOne({
    where: { id: sourceId },
    include: { template: true },
  })
  if (!source) {
    throw new Error(`source ${sourceId} does not exist`)
  }

  const resources = await photon.resources({
    where: { source: { id: source.id } },
    include: {
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
  return JSON.stringify({
    source: { name: source.name, hasOwner: source.hasOwner },
    template: { name: source.template.name },
    resources,
    version: CURRENT_MAPPING_VERSION,
  })
}

import {
  Photon,
  Resource,
  AttributeCreateWithoutResourceInput,
} from '@prisma/photon'
import { AttributeWithInputs } from 'types'

import { clean, buildInputsQuery, buildFiltersQuery } from './utils'

const cleanResourceV6 = (resource: Resource) => {
  const r = clean(resource)
  delete r.definition
  delete r.source
  return r
}

export const buildAttributesV6 = (
  attributes: AttributeWithInputs[],
): AttributeCreateWithoutResourceInput[] | null =>
  attributes.map(a => {
    const attr: AttributeCreateWithoutResourceInput = clean(a)
    if (a.inputs && a.inputs.length) {
      attr.inputs = { create: buildInputsQuery(a.inputs) }
    } else {
      delete attr.inputs
    }
    return attr
  })

export default (photon: Photon, sourceId: string, resources: any[]) =>
  Promise.all(
    resources.map(async (r: any) => {
      return photon.resources.create({
        data: {
          ...cleanResourceV6(r),
          attributes: {
            create: buildAttributesV6(r.attributes),
          },
          filters: {
            create: buildFiltersQuery(r.filters),
          },
          source: {
            connect: { id: sourceId },
          },
        },
      })
    }),
  )

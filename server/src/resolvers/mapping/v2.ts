import { Photon, Resource } from '@prisma/photon'

import { clean, buildAttributesQuery } from './utils'

type ResourceV2 = Resource & {
  definition: any
}

const cleanResourceV2 = (resource: ResourceV2) => {
  const r = clean(resource)
  delete r.definition
  return r
}

export default (photon: Photon, sourceId: string, resources: any[]) =>
  Promise.all(
    resources.map(async (r: any) => {
      const definitionId = r.definition.id
      return photon.resources.create({
        data: {
          ...cleanResourceV2(r),
          definitionId,
          attributes: {
            create: buildAttributesQuery(r.attributes),
          },
          source: {
            connect: { id: sourceId },
          },
        },
      })
    }),
  )

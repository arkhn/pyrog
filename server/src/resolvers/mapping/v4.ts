import { Photon, Resource } from '@prisma/photon'

import { clean, buildAttributesQuery } from './utils'

const cleanResourceV4 = (resource: Resource) => {
  const r = clean(resource)
  delete r.definition
  delete r.source
  return r
}
export default (photon: Photon, sourceId: string, resources: any[]) =>
  Promise.all(
    resources.map(async (r: any) => {
      return photon.resources.create({
        data: {
          ...cleanResourceV4(r),
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

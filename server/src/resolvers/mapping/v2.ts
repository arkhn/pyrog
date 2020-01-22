import { Photon } from '@prisma/photon'

import { clean, buildAttributesQuery } from './utils'

export default (photon: Photon, sourceId: string, resources: any[]) =>
  Promise.all(
    resources.map(async (r: any) =>
      photon.resources.create({
        data: {
          ...clean(r),
          attributes: {
            create: buildAttributesQuery(r.attributes),
          },
          source: {
            connect: { id: sourceId },
          },
        },
      }),
    ),
  )

import { PrismaClient } from '@prisma/client'

import { clean, buildAttributesQueryPreV7 } from './utils'

export default (
  prismaClient: PrismaClient,
  sourceId: string,
  resources: any[],
) =>
  Promise.all(
    resources.map(async (r: any) => {
      return prismaClient.resource.create({
        data: {
          ...clean(r),
          attributes: {
            create: buildAttributesQueryPreV7(r.attributes),
          },
          source: {
            connect: { id: sourceId },
          },
        },
      })
    }),
  )

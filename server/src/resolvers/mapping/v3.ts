import { PrismaClient } from '@prisma/client'

import { clean, buildAttributesQuery } from './utils'

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
            create: buildAttributesQuery(r.attributes),
          },
          source: {
            connect: { id: sourceId },
          },
        },
      })
    }),
  )

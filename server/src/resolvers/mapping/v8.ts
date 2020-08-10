import { PrismaClient } from '@prisma/client'
import { ResourceWithAttributes } from 'types'

import {
  cleanResource,
  checkAuthors,
  buildFiltersQuery,
  buildAttributesQuery,
} from './utils'

export default async (
  prismaClient: PrismaClient,
  sourceId: string,
  resources: ResourceWithAttributes[],
) => {
  await checkAuthors(prismaClient, resources)

  return Promise.all(
    resources.map((r: any) =>
      prismaClient.resource.create({
        data: {
          ...cleanResource(r),
          attributes: {
            create: buildAttributesQuery(r.attributes),
          },
          filters: {
            create: buildFiltersQuery(r.filters),
          },
          source: {
            connect: { id: sourceId },
          },
        },
      }),
    ),
  )
}

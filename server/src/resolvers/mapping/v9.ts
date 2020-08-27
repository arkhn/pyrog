import { PrismaClient } from '@prisma/client'
import { ResourceWithAttributes } from 'types'

import {
  cleanResource,
  checkAuthors,
  buildFiltersQuery,
  buildAttributesQueryV9,
} from './utils'

export default async (
  prismaClient: PrismaClient,
  sourceId: string,
  resources: ResourceWithAttributes[],
) => {
  await checkAuthors(prismaClient, resources)

  return resources.map((r: any) =>
    prismaClient.resource.create({
      data: {
        ...cleanResource(r),
        attributes: {
          create: buildAttributesQueryV9(r.attributes),
        },
        filters: {
          create: buildFiltersQuery(r.filters),
        },
        source: {
          connect: { id: sourceId },
        },
      },
    }),
  )
}

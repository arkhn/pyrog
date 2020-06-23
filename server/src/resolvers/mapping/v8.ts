import { PrismaClient, Resource } from '@prisma/client'

import {
  clean,
  checkAuthors,
  buildFiltersQuery,
  buildAttributesQuery,
} from './utils'

const cleanResourceV8 = (resource: Resource) => {
  const r = clean(resource)
  delete r.definition
  delete r.source
  delete r.primaryKeyOwner
  return r
}

export default async (
  prismaClient: PrismaClient,
  sourceId: string,
  resources: any[],
) => {
  await checkAuthors(prismaClient, resources)
  return Promise.all(
    resources.map(async (r: any) => {
      return prismaClient.resource.create({
        data: {
          ...cleanResourceV8(r),
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
      })
    }),
  )
}

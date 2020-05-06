import { PrismaClient, Resource } from '@prisma/client'

import { clean, buildFiltersQuery, buildAttributesQuery } from './utils'

const cleanResourceV7 = (resource: Resource) => {
  const r = clean(resource)
  delete r.definition
  delete r.source
  return r
}

export default (
  prismaClient: PrismaClient,
  sourceId: string,
  resources: any[],
  existingUsers: string[],
) =>
  Promise.all(
    resources.map(async (r: any) => {
      return prismaClient.resource.create({
        data: {
          ...cleanResourceV7(r),
          attributes: {
            create: buildAttributesQuery(r.attributes, existingUsers),
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

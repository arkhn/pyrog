import { PrismaClient, Resource } from '@prisma/client'

import { clean, buildAttributesQuery, buildFiltersQuery } from './utils'

const cleanResourceV5 = (resource: Resource) => {
  const r = clean(resource)
  delete r.definition
  delete r.source
  return r
}

export default (
  prismaClient: PrismaClient,
  sourceId: string,
  resources: any[],
) =>
  Promise.all(
    resources.map(async (r: any) => {
      return prismaClient.resource.create({
        data: {
          ...cleanResourceV5(r),
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

import { PrismaClient, Resource } from '@prisma/client'

import { clean, buildAttributesQueryPreV7 } from './utils'

type ResourceV2 = Resource & {
  definition: any
}

const cleanResourceV2 = (resource: ResourceV2) => {
  const r = clean(resource)
  delete r.definition
  return r
}

export default (
  prismaClient: PrismaClient,
  sourceId: string,
  resources: any[],
) =>
  Promise.all(
    resources.map(async (r: any) => {
      const definitionId = r.definition.id
      return prismaClient.resource.create({
        data: {
          ...cleanResourceV2(r),
          definitionId,
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

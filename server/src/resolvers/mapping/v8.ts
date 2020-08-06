import { PrismaClient } from '@prisma/client'
import { ResourceWithAttributes } from 'types'

import {
  cleanResource,
  checkAuthors,
  buildFiltersQuery,
  buildAttributesQuery,
  updateReferences,
} from './utils'

export default async (
  prismaClient: PrismaClient,
  sourceId: string,
  resources: ResourceWithAttributes[],
) => {
  await checkAuthors(prismaClient, resources)

  const idsMapping: { [oldId: string]: string } = {}
  const prevSourceId = resources[0].sourceId
  const newResources = (await Promise.all(
    resources.map(async (r: any) => {
      const res = await prismaClient.resource.create({
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
        include: {
          attributes: {
            include: {
              inputGroups: { include: { inputs: true } },
            },
          },
        },
      })
      idsMapping[r.id] = res.id
      return res
    }),
  )) as ResourceWithAttributes[]

  return Promise.all(
    newResources.map(r =>
      updateReferences(prismaClient, r, idsMapping, prevSourceId),
    ),
  )
}

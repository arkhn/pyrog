import { PrismaClient } from '@prisma/client'
import { ResourceWithAttributes, SourceWithCredentials } from 'types'

import {
  cleanResource,
  checkAuthors,
  buildFiltersQuery,
  buildAttributesQuery,
} from './utils'

export default async (
  prismaClient: PrismaClient,
  source: SourceWithCredentials,
  resources: ResourceWithAttributes[],
) => {
  await checkAuthors(prismaClient, resources)

  // create an empty credential
  if (!source.credential) {
    throw new Error('imported source is missing credentials')
  }

  return resources.map((r: any) =>
    prismaClient.resource.create({
      data: {
        ...cleanResource(r),
        primaryKeyOwner: {
          connect: {
            Owner_name_credential_unique_constraint: {
              name: r.primaryKeyOwner.name,
              credentialId: source.credential!.id,
            },
          },
        },
        attributes: {
          create: buildAttributesQuery(r.attributes, source.credential!.id),
        },
        filters: {
          create: buildFiltersQuery(r.filters, source.credential!.id),
        },
        source: {
          connect: { id: source.id },
        },
      },
    }),
  )
}

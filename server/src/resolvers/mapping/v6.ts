import {
  PrismaClient,
  Resource,
  AttributeCreateWithoutResourceInput,
} from '@prisma/client'
import { AttributeWithCommentsPreV7 } from 'types'

import {
  clean,
  buildInputsQuery,
  buildFiltersQuery,
  buildCommentQueryPreV7,
} from './utils'

const cleanResourceV6 = (resource: Resource) => {
  const r = clean(resource)
  delete r.definition
  delete r.source
  return r
}

export const buildAttributesV6 = (
  attributes: AttributeWithCommentsPreV7[],
): AttributeCreateWithoutResourceInput[] | null =>
  attributes.map(a => {
    const attr: AttributeCreateWithoutResourceInput = clean(a)
    if (a.inputs && a.inputs.length) {
      attr.inputs = { create: buildInputsQuery(a.inputs) }
    } else {
      delete attr.inputs
    }

    if (a.comments) {
      attr.comments = { create: buildCommentQueryPreV7(a.comments) }
    } else {
      delete attr.comments
    }

    return attr
  })

export default (
  prismaClient: PrismaClient,
  sourceId: string,
  resources: any[],
) =>
  Promise.all(
    resources.map(async (r: any) => {
      return prismaClient.resource.create({
        data: {
          ...cleanResourceV6(r),
          attributes: {
            create: buildAttributesV6(r.attributes),
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

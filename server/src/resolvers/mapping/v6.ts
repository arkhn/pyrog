import {
  PrismaClient,
  AttributeCreateWithoutResourceInput,
} from '@prisma/client'
import { AttributeWithCommentsPreV7 } from 'types'

import {
  clean,
  cleanPreV9,
  cleanResource,
  buildInputsQuery,
  buildFiltersQuery,
  buildCommentQueryPreV7,
} from './utils'

export const buildAttributesV6 = (
  attributes: AttributeWithCommentsPreV7[],
): AttributeCreateWithoutResourceInput[] | null =>
  attributes.map(a => {
    let attr: AttributeCreateWithoutResourceInput = clean(a)
    if (a.inputs && a.inputs.length) {
      attr.inputGroups = {
        create: [
          {
            inputs: { create: buildInputsQuery(a.inputs) },
            mergingScript: a.mergingScript,
          },
        ],
      }
    }
    if (a.comments) {
      attr.comments = { create: buildCommentQueryPreV7(a.comments) }
    } else {
      delete attr.comments
    }
    attr = cleanPreV9(attr)

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
          ...cleanResource(r),
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

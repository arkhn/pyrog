import { FieldResolver, objectType } from '@nexus/schema'
import { AttributeWithInputs, ResourceWithAttributes } from 'types'
import { Resource } from '@prisma/client'

export const ConceptMap = objectType({
  name: 'ConceptMap',
  definition(t) {
    t.field('id', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.id
      },
    })

    t.field('title', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.title
      },
    })

    t.field('name', {
      type: 'String',
      resolve: (parent: any) => {
        return parent.name
      },
    })
  },
})

export const searchConceptMaps: FieldResolver<
  'Query',
  'conceptMapIds'
> = async (_, { sourceId }, ctx) => {
  const source = await ctx.prisma.source.findOne({
    where: { id: sourceId },
    include: { template: true },
  })
  if (!source) {
    throw new Error(`source ${sourceId} does not exist`)
  }

  const sourceWithMapIds = await ctx.prisma.source.findOne({
    where: { id: sourceId },
    include: {
      resources: {
        include: {
          attributes: {
            include: {
              inputs: true,
            },
          },
        },
      },
    },
  })

  const reduceattributes = (
    acc: string[],
    curAttribute: AttributeWithInputs,
  ) => [
    ...acc,
    ...curAttribute.inputs.map(input => input.conceptMapId).filter(Boolean),
  ]
  const reduceResources = (
    acc: string[],
    curResource: ResourceWithAttributes,
  ) => [...acc, ...curResource.attributes.reduce(reduceattributes, [])]
  return sourceWithMapIds!.resources.reduce(reduceResources, [])
}

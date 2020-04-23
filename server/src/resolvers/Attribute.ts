import { objectType, FieldResolver } from '@nexus/schema'
import { getDefinition } from 'fhir'

export const Attribute = objectType({
  name: 'Attribute',
  definition(t) {
    t.model.id()
    t.model.path()
    t.model.sliceName()
    t.model.definitionId()
    t.field('definition', {
      type: 'StructureDefinition',
      description: 'Structured version of a definition',
      resolve: async parent => {
        const def = await getDefinition(parent.definitionId)
        if (!def) {
          throw new Error(`missing definition ${parent.definitionId}`)
        }
        return def
      },
    })

    t.model.mergingScript()
    t.model.comments()

    t.model.inputs()
    t.model.resource()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

export const createAttribute: FieldResolver<
  'Mutation',
  'createAttribute'
> = async (_, { resourceId, definitionId, path, sliceName, data }, ctx) => {
  const existing = await ctx.prisma.attribute.findMany({
    where: { path, resource: { id: resourceId } },
    include: {
      resource: true,
    },
  })
  if (existing.length) {
    throw new Error(
      `Attribute ${path} already exists for resource ${resourceId}`,
    )
  }

  return ctx.prisma.attribute.create({
    data: {
      ...data,
      definitionId,
      path,
      sliceName,
      resource: {
        connect: { id: resourceId },
      },
    },
  })
}

export const updateAttribute: FieldResolver<
  'Mutation',
  'updateAttribute'
> = async (_parent, { attributeId, data }, ctx) => {
  if (!data) {
    throw new Error('Update payload cannot be null')
  }
  return ctx.prisma.attribute.update({
    where: { id: attributeId },
    data,
  })
}

export const deleteAttribute: FieldResolver<
  'Mutation',
  'deleteAttribute'
> = async (_parent, { attributeId }, ctx) =>
  ctx.prisma.attribute.delete({ where: { id: attributeId } })

export const deleteAttributes: FieldResolver<
  'Mutation',
  'deleteAttributes'
> = async (_parent, { filter }, ctx) => {
  const res = await ctx.prisma.attribute.findMany({
    where: filter,
    include: {
      inputs: {
        include: {
          sqlValue: {
            include: {
              joins: {
                include: {
                  tables: true,
                },
              },
            },
          },
        },
      },
    },
  })

  await Promise.all(
    res.map(async a => {
      await Promise.all(
        a.inputs.map(async i => {
          if (i.sqlValue) {
            await Promise.all(
              i.sqlValue.joins.map(async j => {
                await Promise.all(
                  j.tables.map(t =>
                    ctx.prisma.column.delete({ where: { id: t.id } }),
                  ),
                )
                return ctx.prisma.join.delete({ where: { id: j.id } })
              }),
            )
          }
          return ctx.prisma.input.delete({ where: { id: i.id } })
        }),
      )
      return ctx.prisma.attribute.delete({ where: { id: a.id } })
    }),
  )

  await ctx.prisma.attribute.deleteMany({ where: filter })
  return res
}

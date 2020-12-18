import { objectType, FieldResolver } from '@nexus/schema'
import { getDefinition } from 'fhir'
import { AttributeWhereInput, Condition, Input } from '@prisma/client'

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

    t.model.comments()

    t.model.inputGroups()
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
    where: filter as AttributeWhereInput | undefined,
    include: {
      inputGroups: {
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
          conditions: { include: { sqlValue: true } },
        },
      },
    },
  })

  await Promise.all(
    res.map(async a => {
      await Promise.all(
        a.inputGroups.map(async g => {
          await Promise.all([
            ...g.inputs.map(async i => {
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
            ...g.conditions.map(async c => {
              if (c.sqlValue)
                ctx.prisma.column.delete({ where: { id: c.sqlValue.id } })
              return ctx.prisma.condition.delete({ where: { id: c.id } })
            }),
          ] as Promise<Condition | Input>[])
          return ctx.prisma.inputGroup.delete({ where: { id: g.id } })
        }),
      )
      return ctx.prisma.attribute.delete({ where: { id: a.id } })
    }),
  )

  await ctx.prisma.attribute.deleteMany({
    where: filter as AttributeWhereInput | undefined,
  })
  return res
}

export const createInputGroup: FieldResolver<
  'Mutation',
  'createInputGroup'
> = async (_parent, { attributeId }, ctx) =>
  ctx.prisma.attribute.update({
    where: { id: attributeId },
    data: {
      inputGroups: {
        create: { inputs: { create: [] } },
      },
    },
  })

export const deleteInputGroup: FieldResolver<
  'Mutation',
  'deleteInputGroup'
> = async (_parent, { attributeId, inputGroupId }, ctx) =>
  ctx.prisma.attribute.update({
    where: { id: attributeId },
    data: {
      inputGroups: {
        update: {
          where: { id: inputGroupId },
          data: {
            conditions: { deleteMany: {} },
            inputs: { deleteMany: {} },
          },
        },
        delete: { id: inputGroupId },
      },
    },
  })

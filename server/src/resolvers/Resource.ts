import { objectType, FieldResolver } from 'nexus'
import { Condition, Input } from '@prisma/client'
import { getDefinition } from 'fhir'

export const Resource = objectType({
  name: 'Resource',
  definition(t) {
    t.model.id()

    t.model.logicalReference()
    t.model.label()

    t.model.primaryKeyTable()
    t.model.primaryKeyColumn()

    t.model.filters({ pagination: false })

    t.model.attributes()
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

    t.model.source()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

export const createResource: FieldResolver<
  'Mutation',
  'createResource'
> = async (_parent, { sourceId, definitionId }, ctx) =>
  ctx.prisma.resource.create({
    data: {
      definitionId,
      source: {
        connect: {
          id: sourceId,
        },
      },
    },
  })

export const deleteResource: FieldResolver<
  'Mutation',
  'deleteResource'
> = async (_parent, { resourceId }, ctx) => {
  const res = await ctx.prisma.resource.findOne({
    where: { id: resourceId },
    include: {
      filters: {
        include: {
          sqlColumn: true,
        },
      },
      attributes: {
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
              conditions: {
                include: {
                  sqlValue: true,
                },
              },
            },
          },
        },
      },
    },
  })

  await Promise.all(
    res!.filters.map(async f => {
      await ctx.prisma.filter.delete({ where: { id: f.id } })
      ctx.prisma.column.delete({ where: { id: f.sqlColumn.id } })
    }),
  )
  await Promise.all(
    res!.attributes.map(async a => {
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
  return ctx.prisma.resource.delete({ where: { id: resourceId } })
}

export const updateResource: FieldResolver<
  'Mutation',
  'updateResource'
> = async (_parent, { resourceId, data, filters }, ctx) => {
  if (filters) {
    const resource = await ctx.prisma.resource.findOne({
      where: { id: resourceId },
      include: {
        filters: { include: { sqlColumn: { include: { joins: true } } } },
      },
    })
    await Promise.all(
      resource!.filters.map(async f => {
        await Promise.all(
          f.sqlColumn.joins.map(j =>
            ctx.prisma.join.delete({ where: { id: j.id } }),
          ),
        )
        await ctx.prisma.filter.delete({ where: { id: f.id } })
      }),
    )
    const newFilters = await Promise.all(
      filters.map(f =>
        ctx.prisma.filter.create({
          data: {
            sqlColumn: {
              create: {
                owner: {
                  connect: {
                    id: f.sqlColumn.owner.id,
                  },
                },
                table: f.sqlColumn.table,
                column: f.sqlColumn.column,
                joins: {
                  create: f.sqlColumn?.joins?.map(j => ({
                    tables: {
                      create: [
                        {
                          owner: {
                            connect: {
                              id:
                                (j.tables && j.tables[0].owner.id) || undefined,
                            },
                          },
                          table: (j.tables && j.tables[0].table) || '',
                          column: (j.tables && j.tables[0].column) || '',
                        },
                        {
                          owner: {
                            connect: {
                              id:
                                (j.tables && j.tables[1].owner.id) || undefined,
                            },
                          },
                          table: (j.tables && j.tables[1].table) || '',
                          column: (j.tables && j.tables[1].column) || '',
                        },
                      ],
                    },
                  })),
                },
              },
            },
            relation: f.relation,
            value: f.value,
          },
        }),
      ),
    )
    await ctx.prisma.resource.update({
      where: { id: resourceId },
      data: {
        filters: {
          connect: newFilters.map(f => ({
            id: f.id,
          })),
        },
      },
    })
  }
  return ctx.prisma.resource.update({
    where: { id: resourceId },
    data,
  })
}

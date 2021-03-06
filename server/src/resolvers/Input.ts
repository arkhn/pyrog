import { objectType, FieldResolver } from 'nexus'

export const Input = objectType({
  name: 'Input',
  definition(t) {
    t.model.id()
    t.model.inputGroupId()

    t.model.sqlValue()
    t.model.script()
    t.model.staticValue()

    t.model.conceptMapId()

    t.model.inputGroup()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

export const createSqlInput: FieldResolver<
  'Mutation',
  'createSqlInput'
> = async (
  _parent,
  { inputGroupId, script, conceptMapId, sql: sqlValue },
  ctx,
) =>
  ctx.prisma.input.create({
    data: {
      sqlValue: {
        create: {
          owner: sqlValue?.owner
            ? {
                connect: {
                  id: sqlValue?.owner.id,
                },
              }
            : undefined,
          table: sqlValue?.table,
          column: sqlValue?.column,
          ...(sqlValue?.joins && {
            joins: sqlValue.joins?.length
              ? {
                  create: sqlValue.joins.map(j => ({
                    tables: {
                      create: [
                        {
                          owner:
                            j.tables && j.tables[0].owner
                              ? {
                                  connect: {
                                    id: j.tables[0].owner.id,
                                  },
                                }
                              : undefined,
                          table: (j.tables && j.tables[0]?.table) || '',
                          column: (j.tables && j.tables[0]?.column) || '',
                        },
                        {
                          owner:
                            j.tables && j.tables[1].owner
                              ? {
                                  connect: {
                                    id: j.tables[1].owner.id,
                                  },
                                }
                              : undefined,
                          table: (j.tables && j.tables[1]?.table) || '',
                          column: (j.tables && j.tables[1]?.column) || '',
                        },
                      ],
                    },
                  })),
                }
              : undefined,
          }),
        },
      },
      script,
      conceptMapId,
      inputGroup: {
        connect: {
          id: inputGroupId,
        },
      },
    },
  })

export const createStaticInput: FieldResolver<
  'Mutation',
  'createStaticInput'
> = async (_parent, { inputGroupId, value }, ctx) =>
  ctx.prisma.input.create({
    data: {
      staticValue: value,
      inputGroup: {
        connect: {
          id: inputGroupId,
        },
      },
    },
  })

export const updateInput: FieldResolver<'Mutation', 'updateInput'> = async (
  _parent,
  { inputId, data },
  ctx,
) => {
  const input = await ctx.prisma.input.findUnique({
    where: { id: inputId },
    include: { sqlValue: { include: { joins: true } } },
  })

  if (!input)
    throw new Error('Could not find the Input to apply updateInput to.')

  if (input.sqlValue && (data.owner || data.table || data.column)) {
    await ctx.prisma.column.upsert({
      where: { id: input.sqlValue.id },
      create: {
        owner: data.owner
          ? {
              connect: { id: data.owner.id },
            }
          : undefined,
        table: data.table,
        column: data.column,
      },
      update: {
        owner: data.owner
          ? {
              connect: { id: data.owner.id },
            }
          : undefined,
        table: data.table,
        column: data.column,
      },
    })
  }

  if (input.sqlValue && data.joins) {
    await ctx.prisma.join.deleteMany({
      where: { columnId: input.sqlValue?.id },
    })
    const newJoins = await Promise.all(
      data.joins.map(join =>
        ctx.prisma.join.create({
          data: {
            tables: {
              create: [
                {
                  owner:
                    join.tables && join.tables[0].owner
                      ? {
                          connect: {
                            id: join.tables[0].owner.id,
                          },
                        }
                      : undefined,
                  table: (join.tables && join.tables[0].table) || '',
                  column: (join.tables && join.tables[0].column) || '',
                },
                {
                  owner:
                    join.tables && join.tables[1].owner
                      ? {
                          connect: {
                            id: join.tables[1].owner.id,
                          },
                        }
                      : undefined,
                  table: (join.tables && join.tables[1].table) || '',
                  column: (join.tables && join.tables[1].column) || '',
                },
              ],
            },
          },
        }),
      ),
    )

    await ctx.prisma.column.update({
      where: { id: input.sqlValue.id },
      data: {
        joins: {
          connect: newJoins.map(newJoin => ({ id: newJoin.id })),
        },
      },
    })
  }

  return ctx.prisma.input.update({
    where: { id: inputId },
    data: {
      script: data.script,
      conceptMapId: data.conceptMapId,
    },
  })
}

export const updateStaticInput: FieldResolver<
  'Mutation',
  'updateStaticInput'
> = async (_parent, { inputId, value }, ctx) =>
  ctx.prisma.input.update({
    where: { id: inputId },
    data: {
      staticValue: value,
    },
  })

export const deleteInput: FieldResolver<'Mutation', 'deleteInput'> = async (
  _parent,
  { inputGroupId, inputId },
  ctx,
) => {
  // Delete columns associated to the input to delete
  await ctx.prisma.column.deleteMany({
    where: { input: { id: inputId } },
  })

  return ctx.prisma.inputGroup.update({
    where: { id: inputGroupId },
    data: {
      inputs: {
        delete: { id: inputId },
      },
    },
  })
}

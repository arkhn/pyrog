import { objectType, FieldResolver } from '@nexus/schema'

export const Input = objectType({
  name: 'Input',
  definition(t) {
    t.model.id()

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
          table: sqlValue?.table,
          column: sqlValue?.column,
          ...(sqlValue?.joins && {
            joins: {
              create: sqlValue.joins.map(j => ({
                tables: {
                  create: [
                    {
                      table: (j.tables && j.tables[0]?.table) || '',
                      column: (j.tables && j.tables[0]?.column) || '',
                    },
                    {
                      table: (j.tables && j.tables[1]?.table) || '',
                      column: (j.tables && j.tables[1]?.column) || '',
                    },
                  ],
                },
              })),
            },
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

export const deleteInput: FieldResolver<'Mutation', 'deleteInput'> = async (
  _parent,
  { inputId },
  ctx,
) => {
  const input = await ctx.prisma.input.delete({
    where: { id: inputId },
    include: {
      inputGroup: {
        include: { inputs: true, conditions: { include: { sqlValue: true } } },
      },
    },
  })

  if (input.inputGroup?.inputs.length === 1) {
    await Promise.all(
      input.inputGroup.conditions.map(async c => {
        if (c.sqlValue)
          await ctx.prisma.column.delete({ where: { id: c.sqlValue.id } })
        return ctx.prisma.condition.delete({ where: { id: c.id } })
      }),
    )
    await ctx.prisma.inputGroup.delete({
      where: { id: input.inputGroup.id },
    })
  }

  return input
}

export const updateInput: FieldResolver<'Mutation', 'updateInput'> = async (
  _parent,
  { inputId, data },
  ctx,
) => {
  const input = await ctx.prisma.input.findOne({
    where: { id: inputId },
    include: { sqlValue: { include: { joins: true } } },
  })

  if (!input) throw new Error('')

  if (input.sqlValue && (data.table || data.column)) {
    await ctx.prisma.column.upsert({
      where: { id: input.sqlValue.id },
      create: {
        table: data.table,
        column: data.column,
      },
      update: {
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
                  table: (join.tables && join.tables[0].table) || '',
                  column: (join.tables && join.tables[0].column) || '',
                },
                {
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

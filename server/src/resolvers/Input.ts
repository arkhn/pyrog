import { objectType, FieldResolver } from 'nexus'

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

export const createInput: FieldResolver<'Mutation', 'createInput'> = async (
  _parent,
  { inputGroupId, script, static: staticValue, sql: sqlValue },
  ctx,
) => {
  if (!sqlValue && !staticValue) {
    throw new Error(`Input needs to have either a sql or static value`)
  } else if (sqlValue && staticValue) {
    throw new Error(`Input cannot have both a static and sql value`)
  }

  if (staticValue) {
    return ctx.prisma.input.create({
      data: {
        staticValue,
        script,
        inputGroup: {
          connect: {
            id: inputGroupId,
          },
        },
      },
    })
  }

  const joins = sqlValue!.joins
    ? await Promise.all(
        sqlValue!.joins.map(j =>
          ctx.prisma.join.create({
            include: { tables: true },
            data: {
              tables: {
                create: [
                  {
                    table: j.source ? j.source.table : '',
                    column: j.source ? j.source.column : '',
                  },
                  {
                    table: j.target ? j.target.table : '',
                    column: j.target ? j.target.column : '',
                  },
                ],
              },
            },
          }),
        ),
      )
    : []
  return ctx.prisma.input.create({
    data: {
      sqlValue: {
        create: {
          table: sqlValue!.table,
          column: sqlValue!.column,
          joins: {
            connect: joins.map(j => ({ id: j.id })),
          },
        },
      },
      script,
      inputGroup: {
        connect: {
          id: inputGroupId,
        },
      },
    },
  })
}

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
  return ctx.prisma.input.update({
    where: { id: inputId },
    data,
  })
}

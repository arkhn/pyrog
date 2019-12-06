import { objectType, FieldResolver } from 'nexus'

export const Input = objectType({
  name: 'Input',
  definition(t) {
    t.model.id()

    t.model.sqlValue()
    t.model.script()
    t.model.staticValue()

    t.model.attribute()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

export const createInput: FieldResolver<'Mutation', 'createInput'> = async (
  _parent,
  { attributeId, script, static: staticValue, sql: sqlValue },
  ctx,
) => {
  if (!sqlValue && !staticValue) {
    throw new Error(`Input needs to have either a sql or static value`)
  } else if (sqlValue && staticValue) {
    throw new Error(`Input cannot have both a static and sql value`)
  }

  if (staticValue) {
    return ctx.photon.inputs.create({
      data: {
        staticValue,
        script,
        attribute: {
          connect: {
            id: attributeId,
          },
        },
      },
    })
  }

  const joins = sqlValue!.joins
    ? await Promise.all(
        sqlValue!.joins.map(j =>
          ctx.photon.joins.create({
            include: { tables: true },
            data: {
              tables: {
                create: [
                  {
                    owner: j.source.owner,
                    table: j.source.table,
                    column: j.source.column,
                  },
                  {
                    owner: j.target.owner,
                    table: j.target.table,
                    column: j.target.column,
                  },
                ],
              },
            },
          }),
        ),
      )
    : []
  return ctx.photon.inputs.create({
    data: {
      sqlValue: {
        create: {
          owner: sqlValue!.owner,
          table: sqlValue!.table,
          column: sqlValue!.column,
          joins: {
            connect: joins.map(j => ({ id: j.id })),
          },
        },
      },
      script,
      attribute: {
        connect: {
          id: attributeId,
        },
      },
    },
  })
}

export const deleteInput: FieldResolver<'Mutation', 'deleteInput'> = async (
  _parent,
  { id },
  ctx,
) => ctx.photon.inputs.delete({ where: { id } })

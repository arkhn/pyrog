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
  { attributeId, static: staticValue, sql: sqlValue },
  ctx,
) => {
  if (!sqlValue && !staticValue) {
    throw new Error(`Input needs to have either a sql or static value`)
  } else if (sqlValue && staticValue) {
    throw new Error(`Input cannot have both a static and sql value`)
  }

  return ctx.photon.inputs.create({ data: {} })
}

export const updateInput: FieldResolver<'Mutation', 'updateInput'> = async (
  _parent,
  { id, data },
  ctx,
) => ctx.photon.inputs.update({ where: { id }, data })

export const deleteInput: FieldResolver<'Mutation', 'deleteInput'> = async (
  _parent,
  { id },
  ctx,
) => ctx.photon.inputs.delete({ where: { id } })

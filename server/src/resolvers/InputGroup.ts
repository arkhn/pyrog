import { objectType, FieldResolver } from 'nexus'
import { ConditionAction } from '@prisma/client'

export const InputGroup = objectType({
  name: 'InputGroup',
  definition(t) {
    t.model.id()
    t.model.attributeId()

    t.model.mergingScript()
    t.model.conditions()
    t.model.inputs()

    t.model.attribute()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

export const updateInputGroup: FieldResolver<
  'Mutation',
  'updateInputGroup'
> = async (_parent, { inputGroupId, mergingScript }, ctx) =>
  ctx.prisma.inputGroup.update({
    where: { id: inputGroupId },
    data: {
      mergingScript,
    },
  })

export const addConditionToInputGroup: FieldResolver<
  'Mutation',
  'addConditionToInputGroup'
> = async (_, { inputGroupId, action, columnInput, relation, value }, ctx) => {
  const inputGroup = await ctx.prisma.inputGroup.findOne({
    where: { id: inputGroupId },
  })
  if (!inputGroup)
    throw new Error(`inputGroup with id ${inputGroupId} does not exist`)

  await ctx.prisma.condition.create({
    data: {
      action: action as ConditionAction,
      value,
      relation: relation || 'EQ',
      sqlValue: {
        create: {
          table: columnInput?.table,
          column: columnInput?.column,
          ...(columnInput?.joins && {
            joins: {
              create: columnInput.joins.map(j => ({
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
      inputGroup: {
        connect: {
          id: inputGroupId,
        },
      },
    },
  })
  return inputGroup
}

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

export const deleteCondition: FieldResolver<
  'Mutation',
  'deleteCondition'
> = async (_parent, { inputGroupId, conditionId }, ctx) => {
  // Delete columns associated to the condition to delete
  await ctx.prisma.column.deleteMany({
    where: { condition: { id: conditionId } },
  })

  return ctx.prisma.inputGroup.update({
    where: { id: inputGroupId },
    data: {
      conditions: {
        delete: { id: conditionId },
      },
    },
  })
}

import { objectType, FieldResolver } from 'nexus'
import { ConditionAction, ConditionRelation } from '@prisma/client'

export const Condition = objectType({
  name: 'Condition',
  definition(t) {
    t.model.id()
    t.model.inputGroupId()

    t.model.action()
    t.model.sqlValue()
    t.model.relation()
    t.model.value()
  },
})

export const updateCondition: FieldResolver<
  'Mutation',
  'updateCondition'
> = async (_, { conditionId, action, column, relation, value }, ctx) =>
  ctx.prisma.condition.update({
    where: {
      id: conditionId,
    },
    data: {
      action: action as ConditionAction,
      relation: relation as ConditionRelation,
      value,
      sqlValue: column
        ? {
            update: {
              owner: column.owner
                ? {
                    connect: { id: column.owner.id },
                  }
                : undefined,
              table: column.table,
              column: column.column,
            },
          }
        : undefined,
    },
  })

export const conditionsForResource: FieldResolver<
  'Query',
  'conditionsForResource'
> = async (_, { resourceId }, ctx) =>
  ctx.prisma.condition.findMany({
    where: {
      inputGroup: { attribute: { resourceId } },
    },
  })

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

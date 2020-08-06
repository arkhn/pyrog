import { objectType, FieldResolver } from '@nexus/schema'
import { ConditionAction } from '@prisma/client'

export const Condition = objectType({
  name: 'Condition',
  definition(t) {
    t.model.id()

    t.model.action()
    t.model.sqlValue()
    t.model.value()
  },
})

export const updateCondition: FieldResolver<
  'Mutation',
  'updateCondition'
> = async (_, { conditionId, action, table, column, value }, ctx) =>
  ctx.prisma.condition.update({
    where: {
      id: conditionId,
    },
    data: {
      action: action as ConditionAction,
      value,
      sqlValue: {
        update: { table, column },
      },
    },
  })

export const deleteCondition: FieldResolver<
  'Mutation',
  'deleteCondition'
> = async (_, { conditionId }, ctx) =>
  ctx.prisma.condition.delete({
    where: {
      id: conditionId,
    },
  })

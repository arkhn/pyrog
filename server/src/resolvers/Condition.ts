import { objectType, FieldResolver } from '@nexus/schema'
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
> = async (_, { conditionId, action, table, column, relation, value }, ctx) =>
  ctx.prisma.condition.update({
    where: {
      id: conditionId,
    },
    data: {
      action: action as ConditionAction,
      relation: relation as ConditionRelation,
      value,
      sqlValue: {
        update: { table, column },
      },
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

import { objectType, FieldResolver } from '@nexus/schema'

export const Condition = objectType({
  name: 'Condition',
  definition(t) {
    t.model.id()

    t.model.action()
    t.model.column()
    t.model.value()
  },
})

export const createCondition: FieldResolver<
  'Mutation',
  'createCondition'
> = async (_, { action, table, column, value }, ctx) =>
  ctx.prisma.condition.create({
    data: {
      action,
      value,
      column: {
        create: { table, column },
      },
    },
  })

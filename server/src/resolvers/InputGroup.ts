import { objectType, FieldResolver } from '@nexus/schema'
import { ConditionAction } from '@prisma/client'

export const InputGroup = objectType({
  name: 'InputGroup',
  definition(t) {
    t.model.id()

    t.model.mergingScript()
    t.model.conditions()
    t.model.inputs()

    t.model.attribute()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

export const createInputGroup: FieldResolver<
  'Mutation',
  'createInputGroup'
> = async (_parent, { attributeId }, ctx) => {
  const newGroup = await ctx.prisma.inputGroup.create({
    data: { inputs: { create: [] } },
  })

  await ctx.prisma.attribute.update({
    where: { id: attributeId },
    data: {
      inputGroups: {
        connect: { id: newGroup.id },
      },
    },
  })

  return newGroup
}

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
      relation,
      sqlValue: {
        create: {
          table: columnInput.table,
          column: columnInput.column,
          ...(columnInput.joins && {
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

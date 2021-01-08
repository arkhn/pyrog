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
  const inputGroup = await ctx.prisma.inputGroup.findUnique({
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
          owner: columnInput?.owner
            ? {
                connect: {
                  id: columnInput.owner.id,
                },
              }
            : undefined,
          table: columnInput?.table,
          column: columnInput?.column,
          ...(columnInput?.joins && {
            joins: {
              create: columnInput.joins.map(j => ({
                tables: {
                  create: [
                    {
                      owner:
                        j.tables && j.tables[0].owner
                          ? {
                              connect: {
                                id: j.tables[0].owner.id,
                              },
                            }
                          : undefined,
                      table: (j.tables && j.tables[0]?.table) || '',
                      column: (j.tables && j.tables[0]?.column) || '',
                    },
                    {
                      owner:
                        j.tables && j.tables[1].owner
                          ? {
                              connect: {
                                id: j.tables[1].owner.id,
                              },
                            }
                          : undefined,
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

export const createInputGroup: FieldResolver<
  'Mutation',
  'createInputGroup'
> = async (_parent, { attributeId }, ctx) =>
  ctx.prisma.attribute.update({
    where: { id: attributeId },
    data: {
      inputGroups: {
        create: { inputs: { create: [] } },
      },
    },
  })

export const deleteInputGroup: FieldResolver<
  'Mutation',
  'deleteInputGroup'
> = async (_parent, { attributeId, inputGroupId }, ctx) => {
  await Promise.all([
    // Delete joins of the associated inputs
    ctx.prisma.join.deleteMany({
      where: { column: { input: { inputGroupId } } },
    }),
    // Delete columns of the associated input joins
    ctx.prisma.column.deleteMany({
      where: { join: { column: { input: { inputGroupId } } } },
    }),
    // Delete associated inputs
    ctx.prisma.input.deleteMany({
      where: { inputGroupId },
    }),
    // Delete associated inputs
    ctx.prisma.condition.deleteMany({
      where: { inputGroupId },
    }),
    // Delete associated conditions
    ctx.prisma.condition.deleteMany({
      where: { inputGroupId },
    }),
  ])

  return ctx.prisma.attribute.update({
    where: { id: attributeId },
    data: {
      inputGroups: {
        delete: { id: inputGroupId },
      },
    },
  })
}

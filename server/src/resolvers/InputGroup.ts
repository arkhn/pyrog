import { objectType, FieldResolver } from '@nexus/schema'

export const InputGroup = objectType({
  name: 'InputGroup',
  definition(t) {
    t.model.id()

    t.model.mergingScript()
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

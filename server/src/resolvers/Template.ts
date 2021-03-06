import { objectType, FieldResolver } from 'nexus'

export const Template = objectType({
  name: 'Template',
  definition(t) {
    t.model.id()
    t.model.name()

    t.model.sources()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

export const createTemplate: FieldResolver<
  'Mutation',
  'createTemplate'
> = async (_parent, { name }, ctx) =>
  ctx.prisma.template.create({ data: { name } })

export const deleteTemplate: FieldResolver<
  'Mutation',
  'deleteTemplate'
> = async (_parent, { templateId }, ctx) =>
  ctx.prisma.template.delete({ where: { id: templateId } })

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
  ctx.photon.templates.create({ data: { name } })

export const deleteTemplate: FieldResolver<
  'Mutation',
  'deleteTemplate'
> = async (_parent, { id }, ctx) =>
  ctx.photon.templates.delete({ where: { id } })

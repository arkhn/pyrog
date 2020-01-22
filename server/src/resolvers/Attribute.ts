import { objectType, FieldResolver } from 'nexus'

export const Attribute = objectType({
  name: 'Attribute',
  definition(t) {
    t.model.id()
    t.model.path()

    t.model.mergingScript()
    t.model.comments()

    t.model.inputs()
    t.model.resource()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

export const createAttribute: FieldResolver<
  'Mutation',
  'createAttribute'
> = async (_, { resourceId, path }, ctx) => {
  const existing = await ctx.photon.attributes.findMany({
    where: { path, resource: { id: resourceId } },
    include: {
      resource: true,
    },
  })
  if (existing.length) {
    throw new Error(
      `Attribute ${path} already exists for resource ${resourceId}`,
    )
  }

  return ctx.photon.attributes.create({
    data: {
      path,
      resource: {
        connect: { id: resourceId },
      },
    },
  })
}

export const updateAttribute: FieldResolver<
  'Mutation',
  'updateAttribute'
> = async (_parent, { attributeId, data }, ctx) => {
  if (!data) {
    throw new Error('Update payload cannot be null')
  }
  return ctx.photon.attributes.update({
    where: { id: attributeId },
    data,
  })
}
export const deleteAttribute: FieldResolver<
  'Mutation',
  'deleteAttribute'
> = async (_parent, { id }, ctx) =>
  ctx.photon.attributes.delete({ where: { id } })

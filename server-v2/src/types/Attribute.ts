import { objectType, FieldResolver } from 'nexus'

export const Attribute = objectType({
  name: 'Attribute',
  definition(t) {
    t.model.id()

    t.model.name()
    t.model.mergingScript()
    t.model.isArray()
    t.model.fhirType()
    t.model.description()

    t.model.inputs()
    t.model.children()
    t.model.parent()
    t.model.resource()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

export const createAttribute: FieldResolver<
  'Mutation',
  'createAttribute'
> = async (_, { parentId, name, fhirType, mergingScript }, ctx) => {
  const parent = await ctx.photon.attributes.findOne({
    where: { id: parentId },
    include: { resource: true },
  })
  if (!parent) {
    throw new Error(`Could not find parent attribute ${parentId}`)
  } else if (!parent.isArray) {
    throw new Error(`Parent ${parent.id} is not an array`)
  } else if (parent.fhirType != fhirType) {
    throw new Error(
      `Child type does not match his parent's (${fhirType} != ${
        parent.fhirType
      })`,
    )
  }

  // TODO: add children attributes recursively from json schema.
  const attributes: any[] = []

  return ctx.photon.attributes.create({
    data: {
      name,
      fhirType,
      mergingScript,
      description: parent.description,
      children: {
        create: attributes,
      },
      parent: {
        connect: { id: parentId },
      },
      resource: {
        connect: { id: parent.resource.id },
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

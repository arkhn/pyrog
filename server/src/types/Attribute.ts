import { objectType, FieldResolver } from 'nexus'
import { AttributeCreateWithoutParentInput } from '@prisma/photon'

export const Attribute = objectType({
  name: 'Attribute',
  definition(t) {
    t.model.id()

    t.model.name()
    t.model.mergingScript()
    t.model.isArray()
    t.model.isRequired()
    t.model.fhirType()
    t.model.description()
    t.model.comments()

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
> = async (_, { parentId }, ctx) => {
  const parent = await ctx.photon.attributes.findOne({
    where: { id: parentId },
    include: {
      resource: true,
      children: {
        include: {
          children: {
            include: {
              children: {
                include: {
                  children: {
                    include: {
                      children: {
                        include: { children: { include: { children: true } } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  if (!parent) {
    throw new Error(`Could not find parent attribute ${parentId}`)
  } else if (!parent.isArray) {
    throw new Error(`Parent ${parent.id} is not an array`)
  }

  const replicateChildren = (attr: any): AttributeCreateWithoutParentInput => {
    if (attr.children && attr.children.length > 0) {
      return {
        name: attr.name,
        fhirType: attr.fhirType,
        isArray: attr.isArray,
        description: attr.description,
        children: { create: attr.children.map(replicateChildren) },
      }
    }
    return {
      name: attr.name,
      fhirType: attr.fhirType,
      isArray: attr.isArray,
      description: attr.description,
    }
  }

  return ctx.photon.attributes.create({
    data: {
      ...replicateChildren(parent.children[0]),
      parent: { connect: { id: parent.id } },
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

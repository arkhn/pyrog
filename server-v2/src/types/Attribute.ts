import { objectType, FieldResolver } from 'nexus'
import { AttributeCreateWithoutResourceInput } from '@prisma/photon'
import { fetchResourceSchema } from '../utils'

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
  let resourceSchema = fetchResourceSchema(parent.resource!.fhirType)

  const createAttributes = (schema: any, key: string): any => {
    if (schema.properties) {
      // case object
      return {
        name: key,
        fhirType: key,
        description: schema.description,
        isArray: false,
        children: {
          create: Object.keys(schema.properties).map(p =>
            createAttributes(schema.properties[p], p),
          ),
        },
      }
    } else if (schema.items) {
      // case array
      return {
        name: key,
        fhirType: key,
        description: schema.description,
        isArray: true,
        children: { create: [createAttributes(schema.items, key)] },
      }
    } else {
      // case literal
      return {
        name: key,
        fhirType: key,
        isArray: false,
        description: schema.description,
      }
    }
  }

  return ctx.photon.attributes.create({
    data: createAttributes(resourceSchema.properties[fhirType], fhirType),
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

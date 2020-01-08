import { objectType, FieldResolver } from 'nexus'
import { AttributeCreateWithoutResourceInput } from '@prisma/photon'
import { fetchResourceSchema } from 'utils'

export const Resource = objectType({
  name: 'Resource',
  definition(t) {
    t.model.id()

    t.model.label()
    t.model.profile()
    t.model.fhirType()

    t.model.primaryKeyOwner()
    t.model.primaryKeyTable()
    t.model.primaryKeyColumn()

    t.model.attributes()
    t.model.source()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

const createResourceAttributes = (
  schema: any,
  key: string,
  required: string[],
): any => {
  if (schema.properties) {
    // case object
    return {
      name: key,
      fhirType: schema.title || schema.type,
      description: schema.description,
      isArray: false,
      isRequired: required && required.includes(key),
      children: {
        create: Object.keys(schema.properties).map(p =>
          createResourceAttributes(schema.properties[p], p, schema.required),
        ),
      },
    }
  } else if (schema.items) {
    // case array
    return {
      name: key,
      fhirType: schema.title || schema.type,
      description: schema.description,
      isArray: true,
      isRequired: required && required.includes(key),
      children: { create: [createResourceAttributes(schema.items, key, [])] },
    }
  } else {
    // case literal
    return {
      name: key,
      fhirType: schema.title || schema.type,
      isArray: false,
      isRequired: required && required.includes(key),
      description: schema.description,
    }
  }
}
const attributesBlacklist = ['resourceType', '_id']
export const createResource: FieldResolver<
  'Mutation',
  'createResource'
> = async (_parent, { sourceId, resourceName }, ctx) => {
  const resourceSchema = fetchResourceSchema(resourceName)

  const resource = await ctx.photon.resources.create({
    data: {
      fhirType: resourceName,
      source: {
        connect: {
          id: sourceId,
        },
      },
    },
  })

  const attributes = await Promise.all(
    Object.keys(resourceSchema.properties)
      .filter(attr => !attributesBlacklist.includes(attr))
      .map(
        attr =>
          ctx.photon.attributes.create({
            data: {
              ...createResourceAttributes(
                resourceSchema.properties[attr],
                attr,
                [],
              ),
              resource: {
                connect: { id: resource.id },
              },
            },
            include: { resource: true },
          }),
        [] as AttributeCreateWithoutResourceInput[],
      ),
  )
  return attributes[0].resource!
}

export const deleteResource: FieldResolver<
  'Mutation',
  'deleteResource'
> = async (_parent, { id }, ctx) => {
  const res = await ctx.photon.resources.findOne({
    where: { id },
    include: {
      attributes: {
        include: {
          inputs: {
            include: {
              sqlValue: {
                include: {
                  joins: {
                    include: {
                      tables: true,
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
  await Promise.all(
    res!.attributes.map(async a => {
      await Promise.all(
        a.inputs.map(async i => {
          if (i.sqlValue) {
            await Promise.all(
              i.sqlValue.joins.map(async j => {
                await Promise.all(
                  j.tables.map(t =>
                    ctx.photon.columns.delete({ where: { id: t.id } }),
                  ),
                )
                return ctx.photon.joins.delete({ where: { id: j.id } })
              }),
            )
            return ctx.photon.inputs.delete({ where: { id: i.id } })
          }
        }),
      )
      return ctx.photon.attributes.delete({ where: { id: a.id } })
    }),
  )
  return ctx.photon.resources.delete({ where: { id } })
}

export const updateResource: FieldResolver<
  'Mutation',
  'updateResource'
> = async (_parent, { resourceId, data }, ctx) => {
  return ctx.photon.resources.update({
    where: { id: resourceId },
    data,
  })
}

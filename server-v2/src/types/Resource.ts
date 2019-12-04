import { objectType, FieldResolver } from 'nexus'
import { AttributeCreateWithoutResourceInput } from '@prisma/photon'
import { createAttribute } from './Attribute'

export const Resource = objectType({
  name: 'Resource',
  definition(t) {
    t.model.id()

    t.model.profile()
    t.model.fhirType()

    t.model.attributes()
    t.model.source()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

const attributesBlacklist = ['resourceType', '_id']
export const createResource: FieldResolver<
  'Mutation',
  'createResource'
> = async (_parent, { sourceId, resourceName }, ctx) => {
  let resourceSchema: any
  try {
    resourceSchema = require(`generated/fhir/${resourceName}.json`)
  } catch (e) {
    throw new Error(`Resource ${resourceName} does not exist.`)
  }

  // TODO: this won't work with profiles
  const existing = await ctx.photon.resources.findMany({
    where: { source: { id: sourceId }, fhirType: resourceName },
    include: { source: true },
  })
  if (existing.length) {
    throw new Error(
      `Resource ${resourceName} already exists for source ${
        existing[0].source.name
      }`,
    )
  }

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

  return ctx.photon.resources.create({
    data: {
      fhirType: resourceName,
      attributes: {
        create: Object.keys(resourceSchema.properties)
          .filter(attr => !attributesBlacklist.includes(attr))
          .map(
            attr => createAttributes(resourceSchema.properties[attr], attr),
            [] as AttributeCreateWithoutResourceInput[],
          ),
      },
      source: {
        connect: {
          id: sourceId,
        },
      },
    },
  })
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

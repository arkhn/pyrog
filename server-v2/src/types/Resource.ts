import { objectType, FieldResolver } from 'nexus'

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

  // TODO: add attributes recursively from schema (for now, only first level is added)
  const attributes = Object.keys(resourceSchema.properties).map(attr => ({
    name: attr,
    fhirType: attr,
    description: resourceSchema.properties[attr].description,
  }))

  return ctx.photon.resources.create({
    data: {
      fhirType: resourceName,
      attributes: {
        create: attributes,
      },
      source: {
        connect: {
          id: sourceId,
        },
      },
    },
  })
}

export const deleteResource: FieldResolver<'Mutation', 'deleteResource'> = (
  _parent,
  { id },
  ctx,
) => ctx.photon.resources.delete({ where: { id } })

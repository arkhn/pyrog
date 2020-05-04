import { objectType, FieldResolver, booleanArg } from '@nexus/schema'

import { getDefinition } from 'fhir'
import { importMapping, exportMapping } from 'resolvers/mapping'
import { AttributeWithInputs, ResourceWithAttributes } from 'types'

export const Source = objectType({
  name: 'Source',
  definition(t) {
    t.model.id()

    t.model.name()
    t.model.version()
    t.model.hasOwner()

    t.model.resources({ filtering: true })
    t.model.credential()
    t.model.template()
    t.model.accessControls({ filtering: false })

    t.model.updatedAt()
    t.model.createdAt()

    t.field('mapping', {
      type: 'String',
      nullable: false,
      args: { includeComments: booleanArg({ default: true, required: true }) },
      resolve: (parent, { includeComments }, ctx) =>
        exportMapping(ctx.prisma, parent.id, includeComments),
    })

    t.list.field('mappingProgress', {
      type: 'Int',
      nullable: true,
      resolve: async (parent, _, ctx) => {
        const resources = await ctx.prisma.resource.findMany({
          include: {
            attributes: {
              include: {
                inputs: true,
              },
            },
          },
          where: { source: { id: parent.id } },
        })

        const nbAttributes = resources.reduce(
          (acc, r) =>
            acc +
            r.attributes.filter(a => a.inputs && a.inputs.length > 0).length,
          0,
        )
        return [resources.length, nbAttributes]
      },
    })
  },
})

export const sources: FieldResolver<'Query', 'sources'> = async (
  _parent,
  _args,
  ctx,
) => {
  const { role, id } = ctx.user!

  if (role === 'ADMIN') return ctx.prisma.source.findMany()

  return ctx.prisma.source.findMany({
    where: { accessControls: { some: { user: { id } } } },
  })
}

export const createSource: FieldResolver<'Mutation', 'createSource'> = async (
  _parent,
  { templateName, name, hasOwner, mapping },
  ctx,
) => {
  // create the source
  const source = await ctx.prisma.source.create({
    data: {
      name,
      hasOwner,
      template: { connect: { name: templateName } },
    },
  })

  // create a row in ACL
  await ctx.prisma.accessControl.create({
    data: {
      user: { connect: { id: ctx.user!.id } },
      source: { connect: { id: source.id } },
      role: 'WRITER',
    },
  })

  // import mapping if present
  if (mapping) {
    await importMapping(ctx.prisma, source.id, mapping)
  }

  return source
}

export const deleteSource: FieldResolver<'Mutation', 'deleteSource'> = async (
  _parent,
  { sourceId },
  ctx,
) => {
  const source = await ctx.prisma.source.findOne({
    where: { id: sourceId },
    include: {
      credential: true,
      resources: {
        include: {
          filters: {
            include: {
              sqlColumn: true,
            },
          },
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
      },
    },
  })
  if (source!.credential) {
    await ctx.prisma.credential.delete({
      where: { id: source!.credential.id },
    })
  }
  await ctx.prisma.accessControl.deleteMany({
    where: { source: { id: sourceId } },
  })
  await Promise.all(
    source!.resources.map(async r => {
      await Promise.all(
        r.filters.map(async f => {
          await ctx.prisma.filter.delete({ where: { id: f.id } })
          ctx.prisma.column.delete({ where: { id: f.sqlColumn.id } })
        }),
      )
      await Promise.all(
        r.attributes.map(async a => {
          await Promise.all(
            a.inputs.map(async i => {
              if (i.sqlValue) {
                await Promise.all(
                  i.sqlValue.joins.map(async j => {
                    await Promise.all(
                      j.tables.map(t =>
                        ctx.prisma.column.delete({
                          where: { id: t.id },
                        }),
                      ),
                    )
                    return ctx.prisma.join.delete({
                      where: { id: j.id },
                    })
                  }),
                )
              }
              return ctx.prisma.input.delete({ where: { id: i.id } })
            }),
          )
          return ctx.prisma.attribute.delete({ where: { id: a.id } })
        }),
      )
      return ctx.prisma.resource.delete({ where: { id: r.id } })
    }),
  )
  return ctx.prisma.source.delete({ where: { id: sourceId } })
}

export const usedConceptMaps: FieldResolver<
  'Query',
  'usedConceptMapIds'
> = async (_, { sourceId }, ctx) => {
  const source = await ctx.prisma.source.findOne({
    where: { id: sourceId },
    include: { template: true },
  })
  if (!source) {
    throw new Error(`source ${sourceId} does not exist`)
  }

  const sourceWithMapIds = await ctx.prisma.source.findOne({
    where: { id: sourceId },
    include: {
      resources: {
        include: {
          attributes: {
            include: {
              inputs: true,
            },
          },
        },
      },
    },
  })
  const resources = sourceWithMapIds!.resources as ResourceWithAttributes[]

  const reduceattributes = (
    acc: string[],
    curAttribute: AttributeWithInputs,
  ) => [
    ...acc,
    ...(curAttribute.inputs
      .map(input => input.conceptMapId)
      .filter(Boolean) as string[]),
  ]
  const reduceResources = (
    acc: string[],
    curResource: ResourceWithAttributes,
  ) => [...acc, ...curResource.attributes.reduce(reduceattributes, [])]

  return resources.reduce(reduceResources, [])
}

export const usedProfiles: FieldResolver<'Query', 'usedProfileIds'> = async (
  _,
  { sourceId },
  ctx,
) => {
  const source = await ctx.prisma.source.findOne({
    where: { id: sourceId },
    include: { template: true },
  })
  if (!source) {
    throw new Error(`source ${sourceId} does not exist`)
  }

  const resources = await ctx.prisma.resource.findMany({
    where: { source: { id: sourceId } },
  })

  const definitions = await Promise.all(
    resources.map(r => getDefinition(r.definitionId)),
  )

  const profileIds = definitions
    .filter(def => !!def && def.meta.id !== def.meta.type)
    .map(def => def!.meta.id)

  // Remove duplicates
  return profileIds.filter((id, index) => profileIds.indexOf(id) === index)
}

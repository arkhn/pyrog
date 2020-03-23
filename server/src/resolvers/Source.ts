import { objectType, FieldResolver } from 'nexus'

import { importMapping, exportMapping } from 'resolvers/mapping'

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

    t.model.updatedAt()
    t.model.createdAt()

    t.field('mapping', {
      type: 'String',
      nullable: false,
      resolve: (parent, _, ctx) => exportMapping(ctx.photon, parent.id),
    })

    t.list.field('mappingProgress', {
      type: 'Int',
      nullable: true,
      resolve: async (parent, __, ctx) => {
        const resources = await ctx.photon.resources({
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

export const createSource: FieldResolver<'Mutation', 'createSource'> = async (
  _parent,
  { templateName, name, hasOwner, userId, mapping },
  ctx,
) => {
  // make sure the source does not already exist
  const exists = await ctx.photon.sources.findMany({
    where: { template: { name: templateName }, name },
  })
  if (exists.length) {
    throw new Error(
      `Source ${name} already exists for template ${templateName}`,
    )
  }

  // create the source
  const source = await ctx.photon.sources.create({
    data: {
      name,
      hasOwner,
      template: { connect: { name: templateName } },
    },
  })

  // create a row in ACL
  await ctx.photon.accessControls.create({
    data: {
      user: { connect: { id: userId } },
      source: { connect: { id: source.id } },
      rights: 'WRITER',
    },
  })

  // import mapping if present
  if (mapping) {
    await importMapping(ctx.photon, source.id, mapping)
  }

  return source
}

export const deleteSource: FieldResolver<'Mutation', 'deleteSource'> = async (
  _parent,
  { id },
  ctx,
) => {
  const source = await ctx.photon.sources.findOne({
    where: { id },
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
    await ctx.photon.credentials.delete({
      where: { id: source!.credential.id },
    })
  }
  await Promise.all(
    source!.resources.map(async r => {
      await Promise.all(
        r.filters.map(async f => {
          await ctx.photon.filters.delete({ where: { id: f.id } })
          ctx.photon.columns.delete({ where: { id: f.sqlColumn.id } })
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
                        ctx.photon.columns.delete({ where: { id: t.id } }),
                      ),
                    )
                    return ctx.photon.joins.delete({ where: { id: j.id } })
                  }),
                )
              }
              return ctx.photon.inputs.delete({ where: { id: i.id } })
            }),
          )
          return ctx.photon.attributes.delete({ where: { id: a.id } })
        }),
      )
      return ctx.photon.resources.delete({ where: { id: r.id } })
    }),
  )
  return ctx.photon.sources.delete({ where: { id } })
}

export const getSourcesForUser: FieldResolver<
  'Query',
  'getSourcesForUser'
> = async (_parent, { userId }, ctx) => {
  const accesses = await ctx.photon.accessControls({
    where: { user: { id: userId } },
    include: { source: true },
  })
  const sourceIds = accesses.map(a => a.source.id)
  return ctx.photon.sources.findMany({
    where: { id: { in: sourceIds } },
  })
}

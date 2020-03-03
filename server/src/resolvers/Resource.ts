import { objectType, FieldResolver } from 'nexus'
import { getDefinition } from 'fhir'

export const Resource = objectType({
  name: 'Resource',
  definition(t) {
    t.model.id()

    t.model.label()

    t.model.primaryKeyOwner()
    t.model.primaryKeyTable()
    t.model.primaryKeyColumn()

    t.model.filters({ pagination: false })

    t.model.attributes()
    t.model.definitionId()
    t.field('definition', {
      type: 'StructureDefinition',
      description: 'Structured version of a definition',
      resolve: async parent => {
        const def = await getDefinition(parent.definitionId)
        if (!def) {
          throw new Error(`missing definition ${parent.definitionId}`)
        }
        return def
      },
    })

    t.model.source()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

export const createResource: FieldResolver<
  'Mutation',
  'createResource'
> = async (_parent, { sourceId, definitionId }, ctx) =>
  ctx.photon.resources.create({
    data: {
      definitionId,
      source: {
        connect: {
          id: sourceId,
        },
      },
    },
  })

export const deleteResource: FieldResolver<
  'Mutation',
  'deleteResource'
> = async (_parent, { id }, ctx) => {
  const res = await ctx.photon.resources.findOne({
    where: { id },
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
  })

  await Promise.all(
    res!.filters.map(async f => {
      await ctx.photon.filters.delete({ where: { id: f.id } })
      ctx.photon.columns.delete({ where: { id: f.sqlColumn.id } })
    }),
  )
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
          }
          return ctx.photon.inputs.delete({ where: { id: i.id } })
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
> = async (_parent, { resourceId, data, filters }, ctx) => {
  if (filters) {
    const resource = await ctx.photon.resources.findOne({
      where: { id: resourceId },
      include: {
        filters: true,
      },
    })
    await Promise.all(
      resource!.filters.map(f =>
        ctx.photon.filters.delete({ where: { id: f.id } }),
      ),
    )
    const newFilters = await Promise.all(
      filters.map(f =>
        ctx.photon.filters.create({
          data: {
            sqlColumn: {
              create: {
                owner: f.sqlColumn.owner,
                table: f.sqlColumn.table,
                column: f.sqlColumn.column,
              },
            },
            relation: f.relation,
            value: f.value,
          },
        }),
      ),
    )
    await ctx.photon.resources.update({
      where: { id: resourceId },
      data: {
        filters: {
          connect: newFilters.map(f => ({
            id: f.id,
          })),
        },
      },
    })
  }
  return ctx.photon.resources.update({
    where: { id: resourceId },
    data,
  })
}

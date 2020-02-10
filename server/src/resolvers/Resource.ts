import { objectType, FieldResolver } from 'nexus'

export const Resource = objectType({
  name: 'Resource',
  definition(t) {
    t.model.id()

    t.model.label()

    t.model.primaryKeyOwner()
    t.model.primaryKeyTable()
    t.model.primaryKeyColumn()

    t.model.attributes()
    t.model.definitionId()
    t.field('definition', {
      type: 'StructureDefinition',
      description: 'Structured version of a definition',
      resolve: parent => ({ id: parent.definitionId }),
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
> = async (_parent, { resourceId, data }, ctx) =>
  ctx.photon.resources.update({
    where: { id: resourceId },
    data,
  })

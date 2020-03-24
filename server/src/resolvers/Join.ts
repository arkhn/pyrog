import { objectType, FieldResolver } from 'nexus'

export const Join = objectType({
  name: 'Join',
  definition(t) {
    t.model.id()

    t.model.tables()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

export const updateJoin: FieldResolver<'Mutation', 'updateJoin'> = async (
  _parent,
  { joinId, data },
  ctx,
) => {
  if (!data) {
    throw new Error('Update payload cannot be null')
  }

  const join = await ctx.photon.joins.findOne({
    where: { id: joinId },
    include: { tables: true },
  })

  return ctx.photon.joins.update({
    where: { id: joinId },
    data: {
      tables: {
        update: [
          {
            where: { id: join!.tables[0].id },
            data: {
              owner:
                !data.source || data.source.owner === undefined
                  ? join!.tables[0].owner
                  : data.source.owner
                  ? data.source.owner
                  : null,
              table:
                !data.source || data.source.table === undefined
                  ? join!.tables[0].table
                  : data.source.table
                  ? data.source.table
                  : null,
              column:
                !data.source || data.source.column === undefined
                  ? join!.tables[0].column
                  : data.source.column
                  ? data.source.column
                  : null,
            },
          },
          {
            where: { id: join!.tables[1].id },
            data: {
              owner:
                !data.target || data.target.owner === undefined
                  ? join!.tables[1].owner
                  : data.target.owner
                  ? data.target.owner
                  : null,
              table:
                !data.target || data.target.table === undefined
                  ? join!.tables[1].table
                  : data.target.table
                  ? data.target.table
                  : null,
              column:
                !data.target || data.target.column === undefined
                  ? join!.tables[1].column
                  : data.target.column
                  ? data.target.column
                  : null,
            },
          },
        ],
      },
    },
  })
}

export const deleteJoin: FieldResolver<'Mutation', 'deleteJoin'> = async (
  _parent,
  { joinId },
  ctx,
) => ctx.photon.joins.delete({ where: { id: joinId } })

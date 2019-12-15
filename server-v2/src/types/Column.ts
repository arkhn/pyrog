import { objectType, FieldResolver } from 'nexus'

export const Column = objectType({
  name: 'Column',
  definition(t) {
    t.model.id()

    t.model.owner()
    t.model.table()
    t.model.column()

    t.model.joins()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

export const addJoinToColumn: FieldResolver<
  'Mutation',
  'addJoinToColumn'
> = async (_parent, { columnId, join }, ctx) => {
  if (!join) {
    throw new Error('Update payload cannot be null')
  }

  const newJoin = await ctx.photon.joins.create({
    data: {
      tables: {
        create: [
          {
            owner: join.source.owner,
            table: join.source.table,
            column: join.source.column,
          },
          {
            owner: join.target.owner,
            table: join.target.table,
            column: join.target.column,
          },
        ],
      },
    },
  })

  return ctx.photon.columns.update({
    where: { id: columnId },
    data: {
      joins: {
        connect: { id: newJoin.id }
      }
    }
  })
}

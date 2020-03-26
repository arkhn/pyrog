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
  const newJoin = await ctx.prismaClient.join.create({
    data: {
      tables: {
        create: [
          {
            owner:
              join && join.source && join.source.owner ? join.source.owner : '',
            table:
              join && join.source && join.source.table ? join.source.table : '',
            column:
              join && join.source && join.source.column
                ? join.source.column
                : '',
          },
          {
            owner:
              join && join.target && join.target.owner ? join.target.owner : '',
            table:
              join && join.target && join.target.table ? join.target.table : '',
            column:
              join && join.target && join.target.column
                ? join.target.column
                : '',
          },
        ],
      },
    },
  })

  return ctx.prismaClient.column.update({
    where: { id: columnId },
    data: {
      joins: {
        connect: { id: newJoin.id },
      },
    },
  })
}

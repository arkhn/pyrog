import { objectType, FieldResolver } from 'nexus'

export const Column = objectType({
  name: 'Column',
  definition(t) {
    t.model.id()

    t.model.table()
    t.model.column()

    t.model.joins()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

export const updateColumn: FieldResolver<'Mutation', 'updateColumn'> = async (
  _parent,
  { columnId, data },
  ctx,
) =>
  ctx.prisma.column.update({
    where: { id: columnId },
    data,
  })

export const addJoinToColumn: FieldResolver<
  'Mutation',
  'addJoinToColumn'
> = async (_parent, { columnId, join }, ctx) => {
  const newJoin = await ctx.prisma.join.create({
    data: {
      tables: {
        create: [
          {
            table: join.tables && join.tables[0].table,
            column: join.tables && join.tables[0].column,
          },
          {
            table: join.tables && join.tables[1].table,
            column: join.tables && join.tables[1].column,
          },
        ],
      },
    },
  })

  return ctx.prisma.column.update({
    where: { id: columnId },
    data: {
      joins: {
        connect: { id: newJoin.id },
      },
    },
  })
}

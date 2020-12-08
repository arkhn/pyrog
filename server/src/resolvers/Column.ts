import { objectType, FieldResolver } from '@nexus/schema'

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

export const addJoinToColumn: FieldResolver<
  'Mutation',
  'addJoinToColumn'
> = async (_parent, { columnId, join }, ctx) => {
  const newJoin = await ctx.prisma.join.create({
    data: {
      tables: {
        create: [
          {
            table: join.source?.table || '',
            column: join.source?.column || '',
          },
          {
            table: join.target?.table || '',
            column: join.target?.column || '',
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

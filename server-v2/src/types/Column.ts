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

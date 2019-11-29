import { objectType } from 'nexus'

export const InputColumn = objectType({
  name: 'InputColumn',
  definition(t) {
    t.model.id()

    t.model.owner()
    t.model.table()
    t.model.column()
    t.model.script()
    t.model.staticValue()

    t.model.joins()
    t.model.attribute()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

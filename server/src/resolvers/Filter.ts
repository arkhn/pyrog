import { objectType } from '@nexus/schema'

export const Filter = objectType({
  name: 'Filter',
  definition(t) {
    t.model.id()

    t.model.sqlColumn()
    t.model.relation()
    t.model.value()
  },
})

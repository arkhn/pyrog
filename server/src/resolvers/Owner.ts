import { objectType } from 'nexus'

export const Owner = objectType({
  name: 'Owner',
  definition(t) {
    t.model.id()

    t.model.name()
    t.model.schema()
    t.model.credential()
  },
})

import { objectType } from '@nexus/schema'

export const Owner = objectType({
  name: 'Owner',
  definition(t) {
    t.model.id()

    t.model.name()
    t.model.schema()
    t.model.credential()
  },
})

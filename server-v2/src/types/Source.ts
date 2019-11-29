import { objectType } from 'nexus'

export const Source = objectType({
  name: 'Source',
  definition(t) {
    t.model.id()

    t.model.name()
    t.model.hasOwner()

    t.model.resources()
    t.model.credential()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

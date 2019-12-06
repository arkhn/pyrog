import { objectType } from 'nexus'

export const Join = objectType({
  name: 'Join',
  definition(t) {
    t.model.id()

    t.model.tables()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

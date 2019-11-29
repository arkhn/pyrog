import { objectType } from 'nexus'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()

    t.model.name()
    t.model.email()
    t.model.password()
    t.model.role()

    t.model.credentials()

    t.model.createdAt()
    t.model.updatedAt()
  },
})

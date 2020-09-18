import { objectType, FieldResolver } from '@nexus/schema'

import cache from 'cache'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()

    t.model.email()
    t.model.name()
    t.model.role()

    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const upsertUser: FieldResolver<'Mutation', 'upsertUser'> = async (
  _parent,
  { userEmail, name },
  ctx,
) =>
  ctx.prisma.user.upsert({
    where: { email: userEmail },
    create: {
      email: userEmail,
      name,
    },
    update: {
      name,
    },
  })

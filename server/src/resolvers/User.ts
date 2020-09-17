import { objectType, FieldResolver } from '@nexus/schema'

// TODO keep caching users in redux?
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
) => {
  const user = await ctx.prisma.user.upsert({
    where: { email: userEmail },
    create: {
      email: userEmail,
      name,
    },
    update: {
      name,
    },
  })

  // cache user in redis
  const { set } = cache()
  await set(`user:${userEmail}`, JSON.stringify(user))

  // TODO were we returning a token with the user before?
  return user
}

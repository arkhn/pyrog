import { objectType, FieldResolver } from '@nexus/schema'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import { JWT_SIGNING_KEY } from '../constants'
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

export const login: FieldResolver<'Mutation', 'login'> = async (
  _parent,
  { email, password },
  ctx,
) => {
  const user = await ctx.prisma.user.findOne({
    where: {
      email,
    },
  })
  if (!user) {
    throw new Error(`No user found for email: ${email}`)
  }
  const passwordValid = await compare(password, user.password)
  if (!passwordValid) {
    throw new Error('Invalid password')
  }

  // cache user in redis
  // TODO: remove user from cache on logout
  const { set } = cache()
  await set(`user:${user.id}`, JSON.stringify(user))

  return {
    token: sign(
      { user: { id: user.id, name: user.name, email: user.email } },
      JWT_SIGNING_KEY,
      { algorithm: 'ES256' },
    ),
    user,
  }
}

export const signup: FieldResolver<'Mutation', 'signup'> = async (
  _parent,
  { name, email, password },
  ctx,
) => {
  const hashedPassword = await hash(password, 10)
  const user = await ctx.prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  // cache user in redis
  const { set } = cache()
  await set(`user:${user.id}`, JSON.stringify(user))

  return {
    token: sign(
      { user: { id: user.id, name: user.name, email: user.email } },
      JWT_SIGNING_KEY,
      { algorithm: 'ES256' },
    ),
    user,
  }
}

import { objectType, FieldResolver } from 'nexus'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import { APP_SECRET } from 'utils'

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
  context,
) => {
  const user = await context.photon.users.findOne({
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
  return {
    token: sign({ userId: user.id }, APP_SECRET),
    user,
  }
}

export const signup: FieldResolver<'Mutation', 'signup'> = async (
  _parent,
  { name, email, password },
  ctx,
) => {
  const hashedPassword = await hash(password, 10)
  const user = await ctx.photon.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })
  return {
    token: sign({ userId: user.id }, APP_SECRET),
    user,
  }
}

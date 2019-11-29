import { rule, shield, and } from 'graphql-shield'
import { getUserId } from '../utils'
import { Context } from '../context'

const rules = {
  isAuthenticatedUser: rule()((_, __, ctx: Context) => {
    const userId = getUserId(ctx)
    return Boolean(userId)
  }),
  isAdmin: rule()(async (_, __, ctx: Context) => {
    const userId = getUserId(ctx)
    const user = await ctx.photon.users.findOne({
      where: { id: userId },
    })
    return Boolean(user && user.role == 'ADMIN')
  }),
}

export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
  },
  Mutation: {
    createSource: rules.isAdmin,
  },
})

import { rule, shield } from 'graphql-shield'

import { getUserId } from 'utils'
import { Context } from 'context'

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
    credential: rules.isAuthenticatedUser,
    sources: rules.isAuthenticatedUser,
    source: rules.isAuthenticatedUser,
    resource: rules.isAuthenticatedUser,
    attribute: rules.isAuthenticatedUser,
    structureDefinition: rules.isAuthenticatedUser,
  },
  Mutation: {
    createSource: rules.isAuthenticatedUser,
    deleteSource: rules.isAuthenticatedUser,

    createAttribute: rules.isAuthenticatedUser,
    updateAttribute: rules.isAuthenticatedUser,
    deleteAttribute: rules.isAuthenticatedUser,

    createInput: rules.isAuthenticatedUser,
    updateInput: rules.isAuthenticatedUser,
    deleteInput: rules.isAuthenticatedUser,

    addJoinToColumn: rules.isAuthenticatedUser,
    updateJoin: rules.isAuthenticatedUser,
    deleteJoin: rules.isAuthenticatedUser,
  },
})

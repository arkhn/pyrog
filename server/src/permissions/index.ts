import { rule, shield } from 'graphql-shield'

import { getUserId } from 'utils'
import { Context } from 'context'
import { getSourceIdFromMutationArgs } from './resolvers'

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
  isSourceReader: rule()(async (_, args, ctx: Context) => {
    // Get user id
    const userId = getUserId(ctx)

    // Return true if the user is admin
    const user = await ctx.photon.users.findOne({
      where: { id: userId },
    })
    if (user && user.role == 'ADMIN') return true

    let sourceId = getSourceIdFromMutationArgs(args, ctx)

    // Check access
    const access = await ctx.photon.accessControls({
      where: {
        user: { id: userId },
        source: { id: sourceId },
      },
    })
    return Boolean(access.length > 0)
  }),
  isSourceWriter: rule()(async (_, args, ctx: Context) => {
    // Get user id
    const userId = getUserId(ctx)

    // Return true if the user is admin
    const user = await ctx.photon.users.findOne({
      where: { id: userId },
    })
    if (user && user.role == 'ADMIN') return true

    let sourceId = getSourceIdFromMutationArgs(args, ctx)

    // Check role
    const access = await ctx.photon.accessControls({
      where: {
        user: { id: userId },
        source: { id: sourceId },
        role: 'WRITER',
      },
    })
    return Boolean(access.length > 0)
  }),
}

export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
    credential: rules.isAuthenticatedUser,
    allSources: rules.isAdmin,
    sources: rules.isAuthenticatedUser,
    source: rules.isAuthenticatedUser,
    resource: rules.isAuthenticatedUser,
    attribute: rules.isAuthenticatedUser,
    structureDefinition: rules.isAuthenticatedUser,
  },
  Mutation: {
    signup: rules.isAdmin,

    createAccessControl: rules.isAdmin,

    createSource: rules.isAuthenticatedUser,
    deleteSource: rules.isSourceWriter,

    upsertCredential: rules.isSourceWriter,
    deleteCredential: rules.isSourceWriter,

    createResource: rules.isSourceWriter,
    updateResource: rules.isSourceWriter,
    deleteResource: rules.isSourceWriter,

    createAttribute: rules.isSourceWriter,
    updateAttribute: rules.isSourceWriter,
    deleteAttribute: rules.isSourceWriter,

    updateComments: rules.isSourceReader,

    createInput: rules.isSourceWriter,
    updateInput: rules.isSourceWriter,
    deleteInput: rules.isSourceWriter,

    addJoinToColumn: rules.isSourceWriter,
    updateJoin: rules.isSourceWriter,
    deleteJoin: rules.isSourceWriter,
  },
})

import { rule, shield } from 'graphql-shield'

import { Context } from 'context'
import { getSourceIdFromMutationArgs } from './resolvers'

const rules = {
  isAuthenticatedUser: rule()((_, __, ctx: Context) => {
    return !!ctx.user
  }),
  isAdmin: rule()(async (_, __, ctx: Context) => {
    const { user } = ctx
    return Boolean(user && user.role == 'ADMIN')
  }),
  isSourceReader: rule()(async (_, args, ctx: Context) => {
    // Get user id
    const { user } = ctx
    if (!user) return false

    // Return true if the user is admin
    if (user.role == 'ADMIN') return true

    let sourceId = await getSourceIdFromMutationArgs(args, ctx)

    // Check access
    const access = await ctx.prisma.accessControl.findMany({
      where: {
        user: { id: user.id },
        source: { id: sourceId },
      },
    })
    return Boolean(access.length > 0)
  }),
  isSourceWriter: rule()(async (_, args, ctx: Context) => {
    // Get user id
    const { user } = ctx
    if (!user) return false

    // Return true if the user is admin
    if (user.role == 'ADMIN') return true

    let sourceId = await getSourceIdFromMutationArgs(args, ctx)

    // Check role
    const access = await ctx.prisma.accessControl.findMany({
      where: {
        user: { id: user.id },
        source: { id: sourceId },
        role: 'WRITER',
      },
    })

    return Boolean(access.length > 0)
  }),
}

export const permissions = shield(
  {
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
      createAccessControl: rules.isSourceWriter,
      deleteAccessControl: rules.isSourceWriter,

      createSource: rules.isAuthenticatedUser,
      deleteSource: rules.isSourceWriter,

      upsertCredential: rules.isSourceWriter,
      deleteCredential: rules.isSourceWriter,

      createResource: rules.isSourceWriter,
      updateResource: rules.isSourceWriter,
      deleteResource: rules.isSourceWriter,

      createAttribute: rules.isSourceWriter,
      deleteAttribute: rules.isSourceWriter,

      createComment: rules.isSourceReader,

      createInputGroup: rules.isSourceWriter,
      updateInputGroup: rules.isSourceWriter,

      createInput: rules.isSourceWriter,
      updateInput: rules.isSourceWriter,
      deleteInput: rules.isSourceWriter,

      addJoinToColumn: rules.isSourceWriter,
      updateJoin: rules.isSourceWriter,
      deleteJoin: rules.isSourceWriter,
    },
  },
  { allowExternalErrors: true },
)

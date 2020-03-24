import { rule, shield } from 'graphql-shield'

import { getUserId } from 'utils'
import { Context } from 'context'
import {
  getSourceFromCredential,
  getSourceFromResource,
  getSourceFromAttribute,
  getSourceFromInput,
  getSourceFromColumn,
  getSourceFromJoin,
} from './resolvers'

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
  isSourceWriter: rule()(async (_, args, ctx: Context) => {
    // Get user id
    const userId = getUserId(ctx)

    // Return true if the user is admin
    const user = await ctx.photon.users.findOne({
      where: { id: userId },
    })
    if (user && user.role == 'ADMIN') return true

    // Get source
    const {
      sourceId,
      credentialId,
      resourceId,
      attributeId,
      inputId,
      columnId,
      joinId,
    } = args

    let id
    if (sourceId) {
      id = sourceId
    } else if (credentialId) {
      id = getSourceFromCredential(credentialId, ctx)
    } else if (resourceId) {
      id = getSourceFromResource(resourceId, ctx)
    } else if (attributeId) {
      id = getSourceFromAttribute(attributeId, ctx)
    } else if (inputId) {
      id = getSourceFromInput(inputId, ctx)
    } else if (columnId) {
      id = getSourceFromColumn(columnId, ctx)
    } else if (joinId) {
      id = getSourceFromJoin(joinId, ctx)
    } else {
      throw Error('Could not resolve source id.')
    }

    // Check role
    const access = await ctx.photon.accessControls({
      where: {
        user: { id: userId },
        source: { id },
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
    updateComments: rules.isAuthenticatedUser,
    deleteAttribute: rules.isSourceWriter,

    createInput: rules.isSourceWriter,
    updateInput: rules.isSourceWriter,
    deleteInput: rules.isSourceWriter,

    addJoinToColumn: rules.isSourceWriter,
    updateJoin: rules.isSourceWriter,
    deleteJoin: rules.isSourceWriter,
  },
})

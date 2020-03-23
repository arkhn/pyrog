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
  isSourceWriter: rule()(async (_, args, ctx: Context) => {
    // Get user id
    const userId = getUserId(ctx)

    // Get source
    const sourceId = args.sourceId || args.id

    // Check access rights
    const access = await ctx.photon.accessControls({
      where: {
        user: { id: userId },
        source: { id: sourceId },
        rights: 'WRITER',
      },
    })
    return Boolean(access.length > 0)
  }),
  isResourceWriter: rule()(async (_, args, ctx: Context) => {
    // Get user id
    const userId = getUserId(ctx)

    // Get source
    const { resourceId, id } = args
    const resource = await ctx.photon.resources.findOne({
      where: { id: resourceId || id },
      include: {
        source: true,
      },
    })

    // Check access rights
    const access = await ctx.photon.accessControls({
      where: {
        user: { id: userId },
        source: { id: resource?.source.id },
        rights: 'WRITER',
      },
    })
    return Boolean(access.length > 0)
  }),
  isAttributeWriter: rule()(async (_, args, ctx: Context) => {
    // Get user id
    const userId = getUserId(ctx)

    // Get source
    const { attributeId, id } = args
    const attribute = await ctx.photon.attributes.findOne({
      where: { id: attributeId || id },
      include: {
        resource: {
          include: {
            source: true,
          },
        },
      },
    })

    // Check access rights
    const access = await ctx.photon.accessControls({
      where: {
        user: { id: userId },
        source: { id: attribute?.resource?.source.id },
        rights: 'WRITER',
      },
    })
    return Boolean(access.length > 0)
  }),
  isInputWriter: rule()(async (_, args, ctx: Context) => {
    // Get user id
    const userId = getUserId(ctx)

    // Get source
    const { inputId, id } = args
    const input = await ctx.photon.inputs.findOne({
      where: { id: inputId || id },
      include: {
        attribute: {
          include: {
            resource: {
              include: {
                source: true,
              },
            },
          },
        },
      },
    })

    // Check access rights
    const access = await ctx.photon.accessControls({
      where: {
        user: { id: userId },
        source: { id: input?.attribute.resource?.source.id },
        rights: 'WRITER',
      },
    })
    return Boolean(access.length > 0)
  }),
  isColumnWriter: rule()(async (_, args, ctx: Context) => {
    // Get user id
    const userId = getUserId(ctx)

    // Get source
    const { columnId } = args
    const column = await ctx.photon.columns.findOne({
      where: { id: columnId },
      include: {
        input: {
          include: {
            attribute: {
              include: {
                resource: {
                  include: {
                    source: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    // Check access rights
    const access = await ctx.photon.accessControls({
      where: {
        user: { id: userId },
        source: { id: column?.input?.attribute.resource?.source.id },
        rights: 'WRITER',
      },
    })
    return Boolean(access.length > 0)
  }),
  isJoinWriter: rule()(async (_, args, ctx: Context) => {
    // Get user id
    const userId = getUserId(ctx)

    // Get source
    const { joinId } = args
    const join = await ctx.photon.joins.findOne({
      where: { id: joinId },
      include: {
        column: {
          include: {
            input: {
              include: {
                attribute: {
                  include: {
                    resource: {
                      include: {
                        source: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    // Check access rights
    const access = await ctx.photon.accessControls({
      where: {
        user: { id: userId },
        source: { id: join?.column?.input?.attribute.resource?.source.id },
        rights: 'WRITER',
      },
    })
    return Boolean(access.length > 0)
  }),
}

export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
    credential: rules.isAuthenticatedUser,
    sources: rules.isAdmin,
    sourcesForUser: rules.isAuthenticatedUser,
    source: rules.isAuthenticatedUser,
    resource: rules.isAuthenticatedUser,
    attribute: rules.isAuthenticatedUser,
    structureDefinition: rules.isAuthenticatedUser,
  },
  Mutation: {
    signup: rules.isAdmin,

    createSource: rules.isAuthenticatedUser,
    deleteSource: rules.isSourceWriter,

    createResource: rules.isSourceWriter,
    updateResource: rules.isResourceWriter,
    deleteResource: rules.isResourceWriter,

    createAttribute: rules.isResourceWriter,
    updateAttribute: rules.isAttributeWriter,
    deleteAttribute: rules.isAttributeWriter,

    createInput: rules.isAttributeWriter,
    updateInput: rules.isInputWriter,
    deleteInput: rules.isInputWriter,

    addJoinToColumn: rules.isColumnWriter,
    updateJoin: rules.isJoinWriter,
    deleteJoin: rules.isJoinWriter,
  },
})

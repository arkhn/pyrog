import { rule, shield } from 'graphql-shield'

import { getUserId } from 'utils'
import { Context } from 'context'

const getSourceFromResource = async (resourceId: any, ctx: Context) => {
  const resource = await ctx.photon.resources.findOne({
    where: { id: resourceId },
    include: {
      source: true,
    },
  })
  return resource?.source.id
}
const getSourceFromAttribute = async (attributeId: any, ctx: Context) => {
  const attribute = await ctx.photon.attributes.findOne({
    where: { id: attributeId },
    include: {
      resource: {
        include: {
          source: true,
        },
      },
    },
  })
  return attribute?.resource?.source.id
}
const getSourceFromInput = async (inputId: any, ctx: Context) => {
  const input = await ctx.photon.inputs.findOne({
    where: { id: inputId },
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
  return input?.attribute.resource?.source.id
}
const getSourceFromColumn = async (columnId: any, ctx: Context) => {
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
  return column?.input?.attribute.resource?.source.id
}
const getSourceFromJoin = async (JoinId: any, ctx: Context) => {
  const join = await ctx.photon.joins.findOne({
    where: { id: JoinId },
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
  return join?.column?.input?.attribute.resource?.source.id
}

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
  isWriter: rule()(async (_, args, ctx: Context) => {
    // Get user id
    const userId = getUserId(ctx)

    // Get source
    const {
      sourceId,
      resourceId,
      attributeId,
      inputId,
      columnId,
      joinId,
    } = args

    let id
    if (sourceId) {
      id = sourceId
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
    }

    // Check access rights
    const access = await ctx.photon.accessControls({
      where: {
        user: { id: userId },
        source: { id },
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
    deleteSource: rules.isWriter,

    createResource: rules.isWriter,
    updateResource: rules.isWriter,
    deleteResource: rules.isWriter,

    createAttribute: rules.isWriter,
    updateAttribute: rules.isWriter,
    updateComments: rules.isAuthenticatedUser,
    deleteAttribute: rules.isWriter,

    createInput: rules.isWriter,
    updateInput: rules.isWriter,
    deleteInput: rules.isWriter,

    addJoinToColumn: rules.isWriter,
    updateJoin: rules.isWriter,
    deleteJoin: rules.isWriter,
  },
})

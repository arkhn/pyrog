import { Context } from 'context'

export const getSourceIdFromMutationArgs = (args: any, ctx: Context) => {
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
  return id
}

const getSourceFromCredential = async (credentialId: any, ctx: Context) => {
  const credential = await ctx.prismaClient.credential.findOne({
    where: { id: credentialId },
    include: {
      source: true,
    },
  })
  return credential?.source.id
}

const getSourceFromResource = async (resourceId: any, ctx: Context) => {
  const resource = await ctx.prismaClient.resource.findOne({
    where: { id: resourceId },
    include: {
      source: true,
    },
  })
  return resource?.source.id
}

const getSourceFromAttribute = async (attributeId: any, ctx: Context) => {
  const attribute = await ctx.prismaClient.attribute.findOne({
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
  const input = await ctx.prismaClient.input.findOne({
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
  const column = await ctx.prismaClient.column.findOne({
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
  const join = await ctx.prismaClient.join.findOne({
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

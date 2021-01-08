import { Context } from 'context'

export const getSourceIdFromMutationArgs = async (
  args: any,
  ctx: Context,
): Promise<string> => {
  // Get source
  const {
    accessControlId,
    sourceId,
    databaseId,
    resourceId,
    attributeId,
    inputGroupId,
    inputId,
    conditionId,
    columnId,
    joinId,
  } = args

  let id
  if (sourceId) {
    id = sourceId
  } else if (accessControlId) {
    id = await getSourceFromAccessControl(accessControlId, ctx)
  } else if (databaseId) {
    id = await getSourceFromCredential(databaseId, ctx)
  } else if (resourceId) {
    id = await getSourceFromResource(resourceId, ctx)
  } else if (attributeId) {
    id = await getSourceFromAttribute(attributeId, ctx)
  } else if (inputGroupId) {
    id = await getSourceFromInputGroup(inputGroupId, ctx)
  } else if (inputId) {
    id = await getSourceFromInput(inputId, ctx)
  } else if (conditionId) {
    id = await getSourceFromCondition(conditionId, ctx)
  } else if (columnId) {
    id = await getSourceFromColumn(columnId, ctx)
  } else if (joinId) {
    id = await getSourceFromJoin(joinId, ctx)
  } else {
    throw Error('Could not resolve source id.')
  }
  return id
}

const getSourceFromAccessControl = async (
  accessControlId: any,
  ctx: Context,
) => {
  const acl = await ctx.prisma.accessControl.findUnique({
    where: { id: accessControlId },
    include: {
      source: true,
    },
  })
  return acl?.source.id
}

const getSourceFromCredential = async (credentialId: any, ctx: Context) => {
  const credential = await ctx.prisma.credential.findUnique({
    where: { id: credentialId },
    include: {
      source: true,
    },
  })
  return credential?.source.id
}

const getSourceFromResource = async (resourceId: any, ctx: Context) => {
  const resource = await ctx.prisma.resource.findUnique({
    where: { id: resourceId },
    include: {
      source: true,
    },
  })
  return resource?.source.id
}

const getSourceFromAttribute = async (attributeId: any, ctx: Context) => {
  const attribute = await ctx.prisma.attribute.findUnique({
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

const getSourceFromInputGroup = async (inputGroupId: any, ctx: Context) => {
  const inputGroup = await ctx.prisma.inputGroup.findUnique({
    where: { id: inputGroupId },
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
  return inputGroup?.attribute?.resource?.source.id
}

const getSourceFromInput = async (inputId: any, ctx: Context) => {
  const input = await ctx.prisma.input.findUnique({
    where: { id: inputId },
    include: {
      inputGroup: {
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
  return input?.inputGroup?.attribute?.resource?.source.id
}

const getSourceFromCondition = async (conditionId: any, ctx: Context) => {
  const input = await ctx.prisma.condition.findUnique({
    where: { id: conditionId },
    include: {
      inputGroup: {
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
  return input?.inputGroup?.attribute?.resource?.source.id
}

const getSourceFromColumn = async (columnId: any, ctx: Context) => {
  const column = await ctx.prisma.column.findUnique({
    where: { id: columnId },
    include: {
      input: {
        include: {
          inputGroup: {
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
  return column?.input?.inputGroup?.attribute?.resource?.source.id
}

const getSourceFromJoin = async (JoinId: any, ctx: Context) => {
  const join = await ctx.prisma.join.findUnique({
    where: { id: JoinId },
    include: {
      column: {
        include: {
          input: {
            include: {
              inputGroup: {
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
      },
    },
  })
  return join?.column?.input?.inputGroup?.attribute?.resource?.source.id
}

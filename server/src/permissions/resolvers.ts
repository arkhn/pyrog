import { Context } from 'context'

export const getSourceFromResource = async (resourceId: any, ctx: Context) => {
  const resource = await ctx.photon.resources.findOne({
    where: { id: resourceId },
    include: {
      source: true,
    },
  })
  return resource?.source.id
}

export const getSourceFromAttribute = async (
  attributeId: any,
  ctx: Context,
) => {
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

export const getSourceFromInput = async (inputId: any, ctx: Context) => {
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

export const getSourceFromColumn = async (columnId: any, ctx: Context) => {
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

export const getSourceFromJoin = async (JoinId: any, ctx: Context) => {
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

import { objectType, FieldResolver } from 'nexus'
import { Attribute } from '@prisma/photon'

export const Source = objectType({
  name: 'Source',
  definition(t) {
    t.model.id()

    t.model.name()
    t.model.version()
    t.model.hasOwner()

    t.model.resources({ filtering: true })
    t.model.credential()
    t.model.template()

    t.model.updatedAt()
    t.model.createdAt()

    t.list.field('mappingProgress', {
      type: 'Int',
      nullable: true,
      resolve: async (parent, __, ctx) => {
        const resources = await ctx.photon.resources({
          include: {
            attributes: {
              include: {
                inputs: true,
                children: {
                  include: {
                    inputs: true,
                    children: {
                      include: {
                        inputs: true,
                        children: {
                          include: {
                            inputs: true,
                            children: {
                              include: {
                                inputs: true,
                                children: {
                                  include: {
                                    inputs: true,
                                    children: {
                                      include: { inputs: true, children: true },
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
              },
            },
          },
          where: { source: { id: parent.id } },
        })

        const countFilledAttributes = (attributes: Attribute[]): number => {
          return attributes.reduce(
            (acc: number, attr: any) =>
              attr.inputs && attr.inputs.length > 0
                ? acc + 1
                : attr.children && attr.children.length > 0
                ? acc + countFilledAttributes(attr.children)
                : acc,
            0,
          )
        }
        const nbAttributes = resources.reduce(
          (acc, r) => acc + countFilledAttributes(r.attributes),
          0,
        )
        return [resources.length, nbAttributes]
      },
    })
  },
})

export const createSource: FieldResolver<'Mutation', 'createSource'> = async (
  _parent,
  { templateName, name, hasOwner },
  ctx,
) => {
  const exists = await ctx.photon.sources.findMany({
    where: { template: { name: templateName }, name },
  })
  if (exists.length) {
    throw new Error(
      `Source ${name} already exists for template ${templateName}`,
    )
  }

  return ctx.photon.sources.create({
    data: {
      name,
      hasOwner,
      template: { connect: { name: templateName } },
    },
  })
}

export const deleteSource: FieldResolver<'Mutation', 'deleteSource'> = async (
  _parent,
  { id },
  ctx,
) => {
  const source = await ctx.photon.sources.findOne({
    where: { id },
    include: {
      resources: {
        include: {
          attributes: {
            include: {
              inputs: {
                include: {
                  sqlValue: {
                    include: {
                      joins: {
                        include: {
                          tables: true,
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
  await Promise.all(
    source!.resources.map(async r => {
      await Promise.all(
        r.attributes.map(async a => {
          await Promise.all(
            a.inputs.map(async i => {
              if (i.sqlValue) {
                await Promise.all(
                  i.sqlValue.joins.map(async j => {
                    await Promise.all(
                      j.tables.map(t =>
                        ctx.photon.columns.delete({ where: { id: t.id } }),
                      ),
                    )
                    return ctx.photon.joins.delete({ where: { id: j.id } })
                  }),
                )
              }
              return ctx.photon.inputs.delete({ where: { id: i.id } })
            }),
          )
          return ctx.photon.attributes.delete({ where: { id: a.id } })
        }),
      )
      return ctx.photon.resources.delete({ where: { id: r.id } })
    }),
  )
  return ctx.photon.sources.delete({ where: { id } })
}

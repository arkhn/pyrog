import { objectType, FieldResolver } from '@nexus/schema'

import { importMapping, exportMapping } from 'resolvers/mapping'
import { userInfo } from 'os'

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

    t.field('mapping', {
      type: 'String',
      nullable: false,
      resolve: (parent, _, ctx) => exportMapping(ctx.prisma, parent.id),
    })

    t.list.field('mappingProgress', {
      type: 'Int',
      nullable: true,
      resolve: async (parent, __, ctx) => {
        const resources = await ctx.prisma.resource.findMany({
          include: {
            attributes: {
              include: {
                inputs: true,
              },
            },
          },
          where: { source: { id: parent.id } },
        })

        const nbAttributes = resources.reduce(
          (acc, r) =>
            acc +
            r.attributes.filter(a => a.inputs && a.inputs.length > 0).length,
          0,
        )
        return [resources.length, nbAttributes]
      },
    })
  },
})

export const sources: FieldResolver<'Query', 'sources'> = async (
  _parent,
  _args,
  ctx,
) => {
  const { role, id } = ctx.user!

  if (role === 'ADMIN') return ctx.prisma.source.findMany()

  return ctx.prisma.source.findMany({
    where: { accessControls: { some: { user: { id } } } },
  })
}

export const createSource: FieldResolver<'Mutation', 'createSource'> = async (
  _parent,
  { templateName, name, hasOwner, mapping },
  ctx,
) => {
  // make sure the source does not already exist
  const exists = await ctx.prisma.source.findMany({
    where: { template: { name: templateName }, name },
  })
  if (exists.length) {
    throw new Error(
      `Source ${name} already exists for template ${templateName}`,
    )
  }

  // create the source
  const source = await ctx.prisma.source.create({
    data: {
      name,
      hasOwner,
      template: { connect: { name: templateName } },
    },
  })

  // create a row in ACL
  await ctx.prisma.accessControl.create({
    data: {
      user: { connect: { id: ctx.user!.id } },
      source: { connect: { id: source.id } },
      role: 'WRITER',
    },
  })

  // import mapping if present
  if (mapping) {
    await importMapping(ctx.prisma, source.id, mapping)
  }

  return source
}

export const deleteSource: FieldResolver<'Mutation', 'deleteSource'> = async (
  _parent,
  { sourceId },
  ctx,
) => {
  const source = await ctx.prisma.source.findOne({
    where: { id: sourceId },
    include: {
      credential: true,
      resources: {
        include: {
          filters: {
            include: {
              sqlColumn: true,
            },
          },
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
  if (source!.credential) {
    await ctx.prisma.credential.delete({
      where: { id: source!.credential.id },
    })
  }
  await ctx.prisma.accessControl.deleteMany({
    where: { source: { id: sourceId } },
  })
  await Promise.all(
    source!.resources.map(async r => {
      await Promise.all(
        r.filters.map(async f => {
          await ctx.prisma.filter.delete({ where: { id: f.id } })
          ctx.prisma.column.delete({ where: { id: f.sqlColumn.id } })
        }),
      )
      await Promise.all(
        r.attributes.map(async a => {
          await Promise.all(
            a.inputs.map(async i => {
              if (i.sqlValue) {
                await Promise.all(
                  i.sqlValue.joins.map(async j => {
                    await Promise.all(
                      j.tables.map(t =>
                        ctx.prisma.column.delete({
                          where: { id: t.id },
                        }),
                      ),
                    )
                    return ctx.prisma.join.delete({
                      where: { id: j.id },
                    })
                  }),
                )
              }
              return ctx.prisma.input.delete({ where: { id: i.id } })
            }),
          )
          return ctx.prisma.attribute.delete({ where: { id: a.id } })
        }),
      )
      return ctx.prisma.resource.delete({ where: { id: r.id } })
    }),
  )
  return ctx.prisma.source.delete({ where: { id: sourceId } })
}

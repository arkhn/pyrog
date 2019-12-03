import { objectType, idArg, FieldResolver } from 'nexus'
import { Attribute } from '@prisma/photon'
import { monitorEventLoopDelay } from 'perf_hooks'

export const Source = objectType({
  name: 'Source',
  definition(t) {
    t.model.id()

    t.model.name()
    t.model.version()
    t.model.hasOwner()

    t.model.resources()
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
              },
            },
          },
          where: { source: { id: parent.id } },
        })
        const attributes = resources.reduce(
          (acc, r) => [
            ...acc,
            ...r.attributes.filter(attr => attr.inputs.length > 0),
          ],
          [] as Attribute[],
        )
        return [resources.length, attributes.length]
      },
    })
  },
})

export const createSource: FieldResolver<'Mutation', 'createSource'> = async (
  _parent,
  { templateName, name, hasOwner },
  ctx,
) =>
  ctx.photon.sources.create({
    data: {
      name,
      hasOwner,
      template: { connect: { name: templateName } },
    },
  })

export const deleteSource: FieldResolver<'Mutation', 'deleteSource'> = async (
  _parent,
  { name },
  ctx,
) => ctx.photon.sources.delete({ where: { name } })

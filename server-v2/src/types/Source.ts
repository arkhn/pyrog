import { objectType, idArg } from 'nexus'
import { Attribute } from '@prisma/photon'

export const Source = objectType({
  name: 'Source',
  definition(t) {
    t.model.id()

    t.model.name()
    t.model.hasOwner()

    t.model.resources()
    t.model.credential()

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
                inputColumns: true,
              },
            },
          },
          where: { source: { id: parent.id } },
        })
        const attributes = resources.reduce(
          (acc, r) => [
            ...acc,
            ...r.attributes.filter(attr => attr.inputColumns.length > 0),
          ],
          [] as Attribute[],
        )
        return [resources.length, attributes.length]
      },
    })
  },
})

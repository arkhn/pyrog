import { objectType, FieldResolver } from 'nexus'
import { Attribute, Resource } from '@prisma/photon'

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
                                    children: { include: { inputs: true, children: true } }
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },              },
            },
          },
          where: { source: { id: parent.id } },
        })
        // const attributes = resources.reduce(
        //   (acc, r) => [
        //     ...acc,
        //     ...r.attributes.filter(attr => attr.inputs.length > 0),
        //   ],
        //   [] as Attribute[],
        // )
        //return [resources.length, attributes.length]
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
          0
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
  { id },
  ctx,
) => ctx.photon.sources.delete({ where: { id } })

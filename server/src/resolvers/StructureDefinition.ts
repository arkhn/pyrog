import { objectType } from 'nexus'

export const StructureDefinition = objectType({
  name: 'StructureDefinition',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.type()
    t.model.description()
    t.model.author()
    t.model.kind()
    t.model.derivation()

    t.field('content', { type: 'JSON', resolve: parent => parent.content })

    t.model.updatedAt()
    t.model.createdAt()
  },
})

// TODO
// export const createStructureDefinition: FieldResolver<
//   'Mutation',
//   'createStructureDefinition'
// > = async (_parent, { name }, ctx) =>
//   ctx.photon.structureDefinitions.create({ data: { name } })

// export const deleteStructureDefinition: FieldResolver<
//   'Mutation',
//   'deleteStructureDefinition'
// > = async (_parent, { id }, ctx) =>
//   ctx.photon.structureDefinitions.delete({ where: { id } })

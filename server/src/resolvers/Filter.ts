import { objectType, FieldResolver } from 'nexus'

export const Filter = objectType({
  name: 'Filter',
  definition(t) {
    t.model.id()

    t.model.sqlColumn()
    t.model.relation()
    t.model.value()
  },
})

export const deleteFilter: FieldResolver<'Mutation', 'deleteFilter'> = async (
  _parent,
  { filterId },
  ctx,
) => ctx.photon.filters.delete({ where: { id: filterId } })

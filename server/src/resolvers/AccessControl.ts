import { objectType, FieldResolver } from 'nexus'

export const AccessControl = objectType({
  name: 'AccessControl',
  definition(t) {
    t.model.id()

    t.model.user()
    t.model.source()
    t.model.role()
  },
})

export const createAccessControl: FieldResolver<
  'Mutation',
  'createAccessControl'
> = (_parent, { userId, sourceId, role }, ctx) =>
  ctx.photon.accessControls.create({
    data: {
      user: { connect: { id: userId } },
      source: { connect: { id: sourceId } },
      role,
    },
  })

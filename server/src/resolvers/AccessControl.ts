import { objectType, FieldResolver } from 'nexus'

export const AccessControl = objectType({
  name: 'AccessControl',
  definition(t) {
    t.model.id()

    t.model.user()
    t.model.source()
    t.model.rights()
  },
})

export const createAccessControl: FieldResolver<
  'Mutation',
  'createAccessControl'
> = (_parent, { userId, sourceId, rights }, ctx) =>
  ctx.photon.accessControls.create({
    data: {
      user: { connect: { id: userId } },
      source: { connect: { id: sourceId } },
      rights,
    },
  })

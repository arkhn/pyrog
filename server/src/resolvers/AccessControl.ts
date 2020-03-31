import { objectType, FieldResolver } from '@nexus/schema'

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
> = async (_parent, { userEmail, sourceId, role }, ctx) =>
  ctx.prisma.accessControl.create({
    data: {
      user: { connect: { email: userEmail } },
      source: { connect: { id: sourceId } },
      role,
    },
  })

export const deleteAccessControl: FieldResolver<
  'Mutation',
  'deleteAccessControl'
> = async (_parent, { accessControlId }, ctx) =>
  ctx.prisma.accessControl.delete({
    where: { id: accessControlId },
  })

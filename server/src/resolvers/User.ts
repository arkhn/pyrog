import { objectType, FieldResolver } from 'nexus'
import { Role } from '@prisma/client'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()

    t.model.email()
    t.model.name()
    t.model.role()

    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const updateRole: FieldResolver<'Mutation', 'updateRole'> = async (
  _,
  { userId, newRole },
  ctx,
) =>
  ctx.prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: newRole as Role,
    },
  })

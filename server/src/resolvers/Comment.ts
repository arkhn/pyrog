import { objectType, FieldResolver } from '@nexus/schema'

export const Comment = objectType({
  name: 'Comment',
  definition(t) {
    t.model.id()

    t.model.author()
    t.model.content()

    t.model.createdAt()
  },
})

export const createComment: FieldResolver<'Mutation', 'createComment'> = async (
  _,
  { attributeId, content },
  ctx,
) =>
  ctx.prisma.comment.create({
    data: {
      attribute: {
        connect: { id: attributeId },
      },
      author: {
        connect: { id: ctx.user!.id },
      },
      content,
    },
  })

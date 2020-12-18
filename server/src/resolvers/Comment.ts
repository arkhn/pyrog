import { objectType, FieldResolver } from 'nexus'

export const Comment = objectType({
  name: 'Comment',
  definition(t) {
    t.model.id()

    t.model.author()
    t.model.content()
    t.model.validation()

    t.model.attribute()

    t.model.createdAt()
  },
})

export const createComment: FieldResolver<'Mutation', 'createComment'> = async (
  _,
  { attributeId, content, validation },
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
      validation,
    },
  })

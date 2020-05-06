import {
  AttributeCreateWithoutResourceInput,
  Column,
  ColumnCreateWithoutInputInput,
  CommentCreateWithoutAttributeInput,
  FilterCreateInput,
  InputCreateWithoutAttributeInput,
  JoinCreateWithoutColumnInput,
  PrismaClient,
} from '@prisma/client'

import {
  JoinWithColumn,
  ColumnWithJoins,
  InputWithColumn,
  AttributeWithComments,
  AttributeWithCommentsPreV7,
  FilterWithSqlColumn,
  CommentWithAuthor,
} from 'types'

export const clean = (entry: any): any => {
  const ret = JSON.parse(JSON.stringify(entry))
  delete ret.updatedAt
  delete ret.createdAt
  return ret
}

export const checkAuthors = async (
  prismaClient: PrismaClient,
  resources: any[],
) => {
  const authorMails: string[] = resources.reduce(
    (authors, resource) => [
      ...authors,
      ...resource.attributes.reduce(
        (resourceAuthors: string[], attribute: AttributeWithComments) => [
          ...resourceAuthors,
          ...attribute.comments.map(comment => comment.author.email),
        ],
        [],
      ),
    ],
    [],
  )
  const uniqueMails = authorMails.filter(
    (mail, ind) => authorMails.indexOf(mail) === ind,
  )
  const allUsers = await prismaClient.user.findMany({
    where: { email: { in: uniqueMails } },
  })
  const existingMails = allUsers.map(user => user.email)
  const missingUsers = uniqueMails.filter(mail => !existingMails.includes(mail))
  if (missingUsers.length > 0)
    throw Error(`missing users ${missingUsers.join(', ')}`)
}

const buildJoinsQuery = (
  joins: JoinWithColumn[],
): JoinCreateWithoutColumnInput[] | null =>
  joins.map(j => {
    const join: JoinCreateWithoutColumnInput = clean(j)
    if (j.tables && j.tables.length) {
      join.tables = { create: j.tables.map(clean) }
    } else {
      delete join.tables
    }
    return join
  })

const buildColumnQuery = (
  c: ColumnWithJoins,
): ColumnCreateWithoutInputInput | null => {
  const column: ColumnCreateWithoutInputInput = clean(c)
  if (c.joins && c.joins.length) {
    column.joins = { create: buildJoinsQuery(c.joins) }
  } else {
    delete column.joins
  }
  return column
}

export const buildInputsQuery = (
  inputs: InputWithColumn[],
): InputCreateWithoutAttributeInput[] | null =>
  inputs.map(i => {
    const input: InputCreateWithoutAttributeInput = clean(i)
    if (i.sqlValue) {
      input.sqlValue = { create: buildColumnQuery(i.sqlValue) }
    } else {
      delete input.sqlValue
    }
    return input
  })

export const buildCommentQueryPreV7 = (
  comment: string,
): CommentCreateWithoutAttributeInput => ({
  content: comment,
  author: { connect: { email: 'admin@arkhn.com' } },
})

export const buildAttributesQueryPreV7 = (
  attributes: AttributeWithCommentsPreV7[],
): AttributeCreateWithoutResourceInput[] | null =>
  attributes.map(a => {
    const attr: AttributeCreateWithoutResourceInput = clean(a)
    if (a.inputs && a.inputs.length) {
      attr.inputs = { create: buildInputsQuery(a.inputs) }
    } else {
      delete attr.inputs
    }

    if (attr.comments) {
      attr.comments = { create: buildCommentQueryPreV7(a.comments) }
    } else {
      delete attr.comments
    }
    if (!attr.definitionId) {
      attr.definitionId = ''
      console.warn(
        'Attribute did not have a definitionId so an empty string was used',
      )
    }
    return attr
  })

export const buildCommentsQuery = (
  comments: CommentWithAuthor[],
): CommentCreateWithoutAttributeInput[] =>
  comments.map(c => ({
    content: c.content,
    author: { connect: { email: c.author.email } },
    createdAt: c.createdAt,
  }))

export const buildAttributesQuery = (
  attributes: AttributeWithComments[],
): AttributeCreateWithoutResourceInput[] | null =>
  attributes.map(a => {
    const attr: AttributeCreateWithoutResourceInput = clean(a)
    if (a.inputs && a.inputs.length) {
      attr.inputs = { create: buildInputsQuery(a.inputs) }
    } else {
      delete attr.inputs
    }

    if (a.comments && a.comments.length) {
      attr.comments = { create: buildCommentsQuery(a.comments) }
    } else {
      delete attr.comments
    }

    if (!attr.definitionId) {
      throw new Error(
        `Attribute ${a.id} (${a.path}) did not have a definitionId`,
      )
    }
    return attr
  })

const buildColumnWithoutJoinsQuery = (
  c: Column,
): ColumnCreateWithoutInputInput => clean(c)

export const buildFiltersQuery = (
  filters: FilterWithSqlColumn[],
): FilterCreateInput[] | null =>
  filters.map(f => {
    const filter: FilterCreateInput = clean(f)
    filter.sqlColumn = { create: buildColumnWithoutJoinsQuery(f.sqlColumn) }
    return filter
  })

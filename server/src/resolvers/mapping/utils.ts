import {
  AttributeCreateWithoutResourceInput,
  ColumnCreateWithoutInputInput,
  CommentCreateWithoutAttributeInput,
  FilterCreateInput,
  InputCreateWithoutInputGroupInput,
  InputGroupCreateInput,
  JoinCreateWithoutColumnInput,
  PrismaClient,
  Resource,
  ConditionCreateWithoutInputGroupInput,
} from '@prisma/client'

import {
  AttributeWithComments,
  AttributeWithCommentsPreV7,
  AttributeWithInputGroups,
  ColumnWithJoins,
  CommentWithAuthor,
  ConditionWithSqlValue,
  FilterWithSqlColumn,
  InputGroupWithInputs,
  InputWithColumn,
  JoinWithColumn,
} from 'types'

export const clean = (entry: any): any => {
  const ret = JSON.parse(JSON.stringify(entry))
  delete ret.id
  delete ret.updatedAt
  delete ret.createdAt
  if (ret.owner !== undefined) {
    delete ret.owner
  }
  if (ret.sourceId !== undefined) {
    delete ret.sourceId
  }
  if (ret.resourceId !== undefined) {
    delete ret.resourceId
  }
  if (ret.attributeId !== undefined) {
    delete ret.attributeId
  }
  if (ret.joinId !== undefined) {
    delete ret.joinId
  }
  if (ret.sqlColumnId !== undefined) {
    delete ret.sqlColumnId
  }
  if (ret.sqlValueId !== undefined) {
    delete ret.sqlValueId
  }
  if (ret.columnId !== undefined) {
    delete ret.columnId
  }
  if (ret.userId !== undefined) {
    delete ret.userId
  }
  if (ret.inputGroupId !== undefined) {
    delete ret.inputGroupId
  }
  if (ret.conditionId !== undefined) {
    delete ret.conditionId
  }

  return ret
}

export const cleanPreV9 = (entry: any): any => {
  const ret = JSON.parse(JSON.stringify(entry))

  if (ret.inputs !== undefined) {
    delete ret.inputs
  }
  if (ret.mergingScript !== undefined) {
    delete ret.mergingScript
  }
  return ret
}

export const cleanResource = (resource: Resource) => {
  const r = clean(resource)
  delete r.definition
  delete r.source
  delete r.primaryKeyOwner
  return r
}
export const checkAuthors = async (
  prismaClient: PrismaClient,
  resources: any[],
) => {
  const authorEmails: string[] = resources.reduce(
    (authors, resource) => [
      ...authors,
      ...resource.attributes.reduce(
        (resourceAuthors: string[], attribute: AttributeWithComments) => [
          ...resourceAuthors,
          ...(attribute.comments
            ? attribute.comments.map(comment => comment.author.email)
            : []),
        ],
        [],
      ),
    ],
    [],
  )
  const uniqueEmails = authorEmails.filter(
    (mail, ind) => authorEmails.indexOf(mail) === ind,
  )
  const allUsers = await prismaClient.user.findMany({
    where: { email: { in: uniqueEmails } },
  })
  const existingMails = allUsers.map(user => user.email)
  const missingUsers = uniqueEmails.filter(
    mail => !existingMails.includes(mail),
  )
  if (missingUsers.length > 0)
    throw Error(
      `trying to import a mapping with unexisting comment author ${missingUsers.join(
        ', ',
      )}`,
    )
}

const buildJoinsQuery = (
  joins: JoinWithColumn[],
): JoinCreateWithoutColumnInput[] | undefined =>
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
): ColumnCreateWithoutInputInput | undefined => {
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
): InputCreateWithoutInputGroupInput[] | undefined =>
  inputs.map(i => {
    const input: InputCreateWithoutInputGroupInput = clean(i)
    if (i.sqlValue) {
      input.sqlValue = { create: buildColumnQuery(i.sqlValue) }
    } else {
      delete input.sqlValue
    }
    return input
  })

export const buildConditionsQuery = (
  conditions: ConditionWithSqlValue[],
): ConditionCreateWithoutInputGroupInput[] | undefined =>
  conditions.map(c => ({
    action: c.action,
    value: c.value,
    relation: c.relation,
    sqlValue: { create: buildColumnQuery(c.sqlValue) },
  }))

export const buildCommentQueryPreV7 = (
  comment: string,
): CommentCreateWithoutAttributeInput => ({
  content: comment,
  author: { connect: { email: 'admin@arkhn.com' } },
})

export const buildAttributesQueryPreV7 = (
  attributes: AttributeWithCommentsPreV7[],
): AttributeCreateWithoutResourceInput[] | undefined =>
  attributes.map(a => {
    const attr: AttributeCreateWithoutResourceInput = clean(a)
    if (a.inputs && a.inputs.length) {
      attr.inputGroups = {
        create: [{ inputs: { create: buildInputsQuery(a.inputs) } }],
      }
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
): AttributeCreateWithoutResourceInput[] | undefined =>
  attributes.map(a => {
    let attr: AttributeCreateWithoutResourceInput = clean(a)
    if (a.inputs && a.inputs.length) {
      attr.inputGroups = {
        create: [
          {
            inputs: { create: buildInputsQuery(a.inputs) },
            mergingScript: a.mergingScript,
          },
        ],
      }
    }
    attr = cleanPreV9(attr)

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

export const buildInputGroupsQuery = (
  inputGroups: InputGroupWithInputs[],
): InputGroupCreateInput[] | undefined =>
  inputGroups.map(g => {
    let group: InputGroupCreateInput = clean(g)
    if (g.inputs && g.inputs.length) {
      group.inputs = {
        create: buildInputsQuery(g.inputs),
      }
    } else {
      delete group.inputs
    }
    if (g.conditions && g.conditions.length) {
      group.conditions = {
        create: buildConditionsQuery(g.conditions),
      }
    } else {
      delete group.conditions
    }

    return group
  })

export const buildAttributesQueryV9 = (
  attributes: AttributeWithInputGroups[],
): AttributeCreateWithoutResourceInput[] | undefined =>
  attributes.map(a => {
    const attr: AttributeCreateWithoutResourceInput = clean(a)
    if (a.inputGroups && a.inputGroups.length) {
      attr.inputGroups = {
        create: buildInputGroupsQuery(a.inputGroups),
      }
    } else {
      delete attr.inputGroups
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

export const buildFiltersQuery = (
  filters: FilterWithSqlColumn[],
): FilterCreateInput[] | undefined =>
  filters.map(f => {
    const filter: FilterCreateInput = clean(f)
    filter.sqlColumn = { create: buildColumnQuery(f.sqlColumn) }
    return filter
  })

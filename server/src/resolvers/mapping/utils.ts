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
  if (ret.ownerId !== undefined) {
    delete ret.ownerId
  }
  if (ret.inputId !== undefined) {
    delete ret.inputId
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
  delete r.primaryKeyOwnerId
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
  credentialId: string,
): JoinCreateWithoutColumnInput[] | undefined =>
  joins.map(j => {
    const join: JoinCreateWithoutColumnInput = clean(j)
    if (j.tables && j.tables.length) {
      join.tables = {
        create: j.tables
          .map(clean)
          // WARNING: we need to reverse the array for the joins to be created
          // in the right order: yeah I know it's stupid
          .reverse()
          .map(t => buildColumnQuery(t, credentialId)),
      }
    } else {
      delete join.tables
    }
    return join
  })

export const buildColumnQuery = (
  c: ColumnWithJoins,
  credentialId: string,
): ColumnCreateWithoutInputInput => {
  const column: ColumnCreateWithoutInputInput = clean(c)
  if (c.joins && c.joins.length) {
    column.joins = { create: buildJoinsQuery(c.joins, credentialId) }
  } else {
    delete column.joins
  }
  return {
    ...column,
    owner: {
      connect: {
        Owner_name_credential_unique_constraint: {
          name: c.owner.name,
          credentialId,
        },
      },
    },
  }
}

export const buildInputsQuery = (
  inputs: InputWithColumn[],
  credentialId: string,
): InputCreateWithoutInputGroupInput[] =>
  inputs.map(i => {
    const input: InputCreateWithoutInputGroupInput = clean(i)
    if (i.sqlValue) {
      input.sqlValue = { create: buildColumnQuery(i.sqlValue, credentialId) }
    } else {
      delete input.sqlValue
    }
    return input
  })

export const buildConditionsQuery = (
  conditions: ConditionWithSqlValue[],
  credentialId: string,
): ConditionCreateWithoutInputGroupInput[] =>
  conditions.map(c => ({
    action: c.action,
    value: c.value,
    relation: c.relation,
    sqlValue: { create: buildColumnQuery(c.sqlValue, credentialId) },
  }))

export const buildCommentsQuery = (
  comments: CommentWithAuthor[],
): CommentCreateWithoutAttributeInput[] =>
  comments.map(c => ({
    content: c.content,
    author: { connect: { email: c.author.email } },
    createdAt: c.createdAt,
  }))

export const buildInputGroupsQuery = (
  inputGroups: InputGroupWithInputs[],
  credentialId: string,
): InputGroupCreateInput[] =>
  inputGroups.map(g => {
    let group: InputGroupCreateInput = clean(g)
    if (g.inputs && g.inputs.length) {
      group.inputs = {
        create: buildInputsQuery(g.inputs, credentialId),
      }
    } else {
      delete group.inputs
    }
    if (g.conditions && g.conditions.length) {
      group.conditions = {
        create: buildConditionsQuery(g.conditions, credentialId),
      }
    } else {
      delete group.conditions
    }

    return group
  })

export const buildAttributesQuery = (
  attributes: AttributeWithInputGroups[],
  credentialId: string,
): AttributeCreateWithoutResourceInput[] =>
  attributes.map(a => {
    const attr: AttributeCreateWithoutResourceInput = clean(a)
    if (a.inputGroups && a.inputGroups.length) {
      attr.inputGroups = {
        create: buildInputGroupsQuery(a.inputGroups, credentialId),
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
  credentialId: string,
): FilterCreateInput[] =>
  filters.map(f => {
    const filter: FilterCreateInput = clean(f)
    filter.sqlColumn = { create: buildColumnQuery(f.sqlColumn, credentialId) }
    return filter
  })

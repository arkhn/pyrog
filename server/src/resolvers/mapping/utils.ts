import {
  InputCreateWithoutAttributeInput,
  ColumnCreateWithoutInputsInput,
  JoinCreateWithoutColumnInput,
  AttributeCreateWithoutResourceInput,
} from '@prisma/photon'

import {
  JoinWithColumn,
  ColumnWithJoins,
  InputWithColumn,
  AttributeWithInputs,
} from 'types'

export const clean = (entry: any): any => {
  const ret = JSON.parse(JSON.stringify(entry))
  delete ret.id
  delete ret.updatedAt
  delete ret.createdAt
  return ret
}

const buildJoinsQuery = (
  joins: JoinWithColumn[],
): JoinCreateWithoutColumnInput[] | null =>
  joins.map(j => {
    let join: JoinCreateWithoutColumnInput = clean(j)
    if (j.tables && j.tables.length) {
      join.tables = { create: j.tables.map(clean) }
    } else {
      delete join.tables
    }
    return join
  })

const buildColumnQuery = (
  c: ColumnWithJoins,
): ColumnCreateWithoutInputsInput | null => {
  let column: ColumnCreateWithoutInputsInput = clean(c)
  if (c.joins && c.joins.length) {
    column.joins = { create: buildJoinsQuery(c.joins) }
  } else {
    delete column.joins
  }
  return column
}

const buildInputsQuery = (
  inputs: InputWithColumn[],
): InputCreateWithoutAttributeInput[] | null =>
  inputs.map(i => {
    let input: InputCreateWithoutAttributeInput = clean(i)
    if (i.sqlValue) {
      input.sqlValue = { create: buildColumnQuery(i.sqlValue) }
    } else {
      delete input.sqlValue
    }
    return input
  })

export const buildAttributesQuery = (
  attributes: AttributeWithInputs[],
): AttributeCreateWithoutResourceInput[] | null =>
  attributes.map(a => {
    let attr: AttributeCreateWithoutResourceInput = clean(a)
    if (a.inputs && a.inputs.length) {
      attr.inputs = { create: buildInputsQuery(a.inputs) }
    } else {
      delete attr.inputs
    }
    return attr
  })

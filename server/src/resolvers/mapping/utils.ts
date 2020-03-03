import {
  Column,
  InputCreateWithoutAttributeInput,
  ColumnCreateWithoutInputInput,
  JoinCreateWithoutColumnInput,
  AttributeCreateWithoutResourceInput,
  FilterCreateInput,
} from '@prisma/photon'

import {
  JoinWithColumn,
  ColumnWithJoins,
  InputWithColumn,
  AttributeWithInputs,
  FilterWithSqlColumn,
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

const buildInputsQuery = (
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

export const buildAttributesQuery = (
  attributes: AttributeWithInputs[],
): AttributeCreateWithoutResourceInput[] | null =>
  attributes.map(a => {
    const attr: AttributeCreateWithoutResourceInput = clean(a)
    if (a.inputs && a.inputs.length) {
      attr.inputs = { create: buildInputsQuery(a.inputs) }
    } else {
      delete attr.inputs
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

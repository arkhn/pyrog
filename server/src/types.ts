import { Attribute, Input, Join, Column, Filter } from '@prisma/photon'

export type JoinWithColumn = Join & {
  tables: Column[]
}

export type ColumnWithJoins = Column & {
  joins: JoinWithColumn[]
}

export type InputWithColumn = Input & {
  sqlValue: ColumnWithJoins
}

export type AttributeWithInputs = Attribute & {
  inputs: InputWithColumn[]
}

export type AttributeWithChildren = AttributeWithInputs & {
  children: AttributeWithChildren[]
}

export type FilterWithSqlColumn = Filter & {
  sqlColumn: Column
}

export type CachedDefinition = {
  $meta: StructureMetadata
}

export type ConstraintDefinition = {
  key: string
  severity: string
  human: string
  expression: string
  xpath: string
  source: string
}

export type StructureMetadata = {
  id: string
  url: string
  name: string
  type: string
  description: string
  kind: string
  baseDefinition: string
  derivation: string
  publisher: string
  min: string
  max: string
  constraint: ConstraintDefinition[]
}

import { Attribute, Input, Join, Column } from '@prisma/photon'

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

export type StructureDefinition = {
  $meta: StructureMetadata
  properties: any
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
  description: string
  kind: string
  baseDefinition: string
  derivation: string
  min: string
  max: string
  constraint: ConstraintDefinition[]
}

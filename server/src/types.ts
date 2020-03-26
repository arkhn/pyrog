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

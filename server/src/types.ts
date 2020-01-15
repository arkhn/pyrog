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

export type AttributeWithChildren = Attribute & {
  children: AttributeWithChildren[]
  inputs: InputWithColumn[]
}

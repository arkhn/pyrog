import {
  Attribute,
  Input,
  Join,
  Column,
  Filter,
  Comment,
  User,
} from '@prisma/client'

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

export type AttributeWithCommentsPreV7 = AttributeWithInputs & {
  comments: string
}

export type CommentWithAuthor = Comment & {
  author: User
}

export type AttributeWithComments = AttributeWithInputs & {
  comments: CommentWithAuthor[]
}

export type AttributeWithChildren = AttributeWithInputs & {
  children: AttributeWithChildren[]
}

export type FilterWithSqlColumn = Filter & {
  sqlColumn: Column
}

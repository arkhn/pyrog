import {
  Attribute,
  AttributeCreateManyWithoutResourceInput,
  Column,
  Comment,
  Filter,
  Input,
  InputGroup,
  Join,
  Resource,
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

export type InputGroupWithInputs = InputGroup & {
  inputs: InputWithColumn[]
}

export type AttributeWithInputGroups = Attribute & {
  inputGroups: InputGroupWithInputs[]
}

export type AttributeWithInputs = Attribute & {
  inputs: InputWithColumn[]
}

export type ResourceWithAttributes = Resource & {
  attributes: AttributeWithInputGroups[]
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

export type FilterWithSqlColumn = Filter & {
  sqlColumn: Column
}

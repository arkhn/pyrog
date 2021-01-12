import {
  Attribute,
  Column,
  Comment,
  Condition,
  Credential,
  Filter,
  Input,
  InputGroup,
  Join,
  Owner,
  Resource,
  Source,
  User,
} from '@prisma/client'

export type CredentialWithOwners = Credential & {
  owners: Owner[]
}

export type SourceWithCredentials = Source & {
  credential?: CredentialWithOwners
}

export type ExportedSource = {
  source: {
    id: string
    name: string
    credential: { owners: Owner[]; model: string }
  }
  template: { name: string }
  resources: Resource[]
  version: number
}

export type JoinWithColumn = Join & {
  tables: ColumnWithOwner[]
}

export type ColumnWithJoins = ColumnWithOwner & {
  joins: JoinWithColumn[]
}

export type ColumnWithOwner = Column & {
  owner: Owner
}

export type InputWithColumn = Input & {
  sqlValue: ColumnWithJoins
}

export type InputGroupWithInputs = InputGroup & {
  inputs: InputWithColumn[]
  conditions: ConditionWithSqlValue[]
}

export type ConditionWithSqlValue = Condition & {
  sqlValue: ColumnWithJoins
}

export type AttributeWithInputGroups = Attribute & {
  comments: CommentWithAuthor[]
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
  mergingScript: string
}

export type CommentWithAuthor = Comment & {
  author: User
}

export type AttributeWithComments = AttributeWithInputs & {
  comments: CommentWithAuthor[]
  mergingScript: string
}

export type FilterWithSqlColumn = Filter & {
  sqlColumn: ColumnWithJoins
}

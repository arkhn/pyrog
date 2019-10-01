import { GraphQLResolveInfo, GraphQLSchema } from "graphql";
import { IResolvers } from "graphql-tools/dist/Interfaces";
import { Options } from "graphql-binding";
import { makePrismaBindingClass, BasePrismaOptions } from "prisma-binding";

export interface Query {
  sources: <T = Array<Source | null>>(
    args: {
      where?: SourceWhereInput | null;
      orderBy?: SourceOrderByInput | null;
      skip?: Int | null;
      after?: String | null;
      before?: String | null;
      first?: Int | null;
      last?: Int | null;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  resources: <T = Array<Resource | null>>(
    args: {
      where?: ResourceWhereInput | null;
      orderBy?: ResourceOrderByInput | null;
      skip?: Int | null;
      after?: String | null;
      before?: String | null;
      first?: Int | null;
      last?: Int | null;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  attributes: <T = Array<Attribute | null>>(
    args: {
      where?: AttributeWhereInput | null;
      orderBy?: AttributeOrderByInput | null;
      skip?: Int | null;
      after?: String | null;
      before?: String | null;
      first?: Int | null;
      last?: Int | null;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  inputColumns: <T = Array<InputColumn | null>>(
    args: {
      where?: InputColumnWhereInput | null;
      orderBy?: InputColumnOrderByInput | null;
      skip?: Int | null;
      after?: String | null;
      before?: String | null;
      first?: Int | null;
      last?: Int | null;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  joins: <T = Array<Join | null>>(
    args: {
      where?: JoinWhereInput | null;
      orderBy?: JoinOrderByInput | null;
      skip?: Int | null;
      after?: String | null;
      before?: String | null;
      first?: Int | null;
      last?: Int | null;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  users: <T = Array<User | null>>(
    args: {
      where?: UserWhereInput | null;
      orderBy?: UserOrderByInput | null;
      skip?: Int | null;
      after?: String | null;
      before?: String | null;
      first?: Int | null;
      last?: Int | null;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  credentials: <T = Array<Credential | null>>(
    args: {
      where?: CredentialWhereInput | null;
      orderBy?: CredentialOrderByInput | null;
      skip?: Int | null;
      after?: String | null;
      before?: String | null;
      first?: Int | null;
      last?: Int | null;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  source: <T = Source | null>(
    args: { where: SourceWhereUniqueInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
  resource: <T = Resource | null>(
    args: { where: ResourceWhereUniqueInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
  attribute: <T = Attribute | null>(
    args: { where: AttributeWhereUniqueInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
  inputColumn: <T = InputColumn | null>(
    args: { where: InputColumnWhereUniqueInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
  join: <T = Join | null>(
    args: { where: JoinWhereUniqueInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
  user: <T = User | null>(
    args: { where: UserWhereUniqueInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
  credential: <T = Credential | null>(
    args: { where: CredentialWhereUniqueInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
  sourcesConnection: <T = SourceConnection>(
    args: {
      where?: SourceWhereInput | null;
      orderBy?: SourceOrderByInput | null;
      skip?: Int | null;
      after?: String | null;
      before?: String | null;
      first?: Int | null;
      last?: Int | null;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  resourcesConnection: <T = ResourceConnection>(
    args: {
      where?: ResourceWhereInput | null;
      orderBy?: ResourceOrderByInput | null;
      skip?: Int | null;
      after?: String | null;
      before?: String | null;
      first?: Int | null;
      last?: Int | null;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  attributesConnection: <T = AttributeConnection>(
    args: {
      where?: AttributeWhereInput | null;
      orderBy?: AttributeOrderByInput | null;
      skip?: Int | null;
      after?: String | null;
      before?: String | null;
      first?: Int | null;
      last?: Int | null;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  inputColumnsConnection: <T = InputColumnConnection>(
    args: {
      where?: InputColumnWhereInput | null;
      orderBy?: InputColumnOrderByInput | null;
      skip?: Int | null;
      after?: String | null;
      before?: String | null;
      first?: Int | null;
      last?: Int | null;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  joinsConnection: <T = JoinConnection>(
    args: {
      where?: JoinWhereInput | null;
      orderBy?: JoinOrderByInput | null;
      skip?: Int | null;
      after?: String | null;
      before?: String | null;
      first?: Int | null;
      last?: Int | null;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  usersConnection: <T = UserConnection>(
    args: {
      where?: UserWhereInput | null;
      orderBy?: UserOrderByInput | null;
      skip?: Int | null;
      after?: String | null;
      before?: String | null;
      first?: Int | null;
      last?: Int | null;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  credentialsConnection: <T = CredentialConnection>(
    args: {
      where?: CredentialWhereInput | null;
      orderBy?: CredentialOrderByInput | null;
      skip?: Int | null;
      after?: String | null;
      before?: String | null;
      first?: Int | null;
      last?: Int | null;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  node: <T = Node | null>(
    args: { id: ID_Output },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
}

export interface Mutation {
  createSource: <T = Source>(
    args: { data: SourceCreateInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  createResource: <T = Resource>(
    args: { data: ResourceCreateInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  createAttribute: <T = Attribute>(
    args: { data: AttributeCreateInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  createInputColumn: <T = InputColumn>(
    args: { data: InputColumnCreateInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  createJoin: <T = Join>(
    args: { data: JoinCreateInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  createUser: <T = User>(
    args: { data: UserCreateInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  createCredential: <T = Credential>(
    args: { data: CredentialCreateInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  updateSource: <T = Source | null>(
    args: { data: SourceUpdateInput; where: SourceWhereUniqueInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
  updateResource: <T = Resource | null>(
    args: { data: ResourceUpdateInput; where: ResourceWhereUniqueInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
  updateAttribute: <T = Attribute | null>(
    args: { data: AttributeUpdateInput; where: AttributeWhereUniqueInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
  updateInputColumn: <T = InputColumn | null>(
    args: { data: InputColumnUpdateInput; where: InputColumnWhereUniqueInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
  updateJoin: <T = Join | null>(
    args: { data: JoinUpdateInput; where: JoinWhereUniqueInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
  updateUser: <T = User | null>(
    args: { data: UserUpdateInput; where: UserWhereUniqueInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
  updateCredential: <T = Credential | null>(
    args: { data: CredentialUpdateInput; where: CredentialWhereUniqueInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
  deleteSource: <T = Source | null>(
    args: { where: SourceWhereUniqueInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
  deleteResource: <T = Resource | null>(
    args: { where: ResourceWhereUniqueInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
  deleteAttribute: <T = Attribute | null>(
    args: { where: AttributeWhereUniqueInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
  deleteInputColumn: <T = InputColumn | null>(
    args: { where: InputColumnWhereUniqueInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
  deleteJoin: <T = Join | null>(
    args: { where: JoinWhereUniqueInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
  deleteUser: <T = User | null>(
    args: { where: UserWhereUniqueInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
  deleteCredential: <T = Credential | null>(
    args: { where: CredentialWhereUniqueInput },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T | null>;
  upsertSource: <T = Source>(
    args: {
      where: SourceWhereUniqueInput;
      create: SourceCreateInput;
      update: SourceUpdateInput;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  upsertResource: <T = Resource>(
    args: {
      where: ResourceWhereUniqueInput;
      create: ResourceCreateInput;
      update: ResourceUpdateInput;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  upsertAttribute: <T = Attribute>(
    args: {
      where: AttributeWhereUniqueInput;
      create: AttributeCreateInput;
      update: AttributeUpdateInput;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  upsertInputColumn: <T = InputColumn>(
    args: {
      where: InputColumnWhereUniqueInput;
      create: InputColumnCreateInput;
      update: InputColumnUpdateInput;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  upsertJoin: <T = Join>(
    args: {
      where: JoinWhereUniqueInput;
      create: JoinCreateInput;
      update: JoinUpdateInput;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  upsertUser: <T = User>(
    args: {
      where: UserWhereUniqueInput;
      create: UserCreateInput;
      update: UserUpdateInput;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  upsertCredential: <T = Credential>(
    args: {
      where: CredentialWhereUniqueInput;
      create: CredentialCreateInput;
      update: CredentialUpdateInput;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  updateManySources: <T = BatchPayload>(
    args: {
      data: SourceUpdateManyMutationInput;
      where?: SourceWhereInput | null;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  updateManyResources: <T = BatchPayload>(
    args: {
      data: ResourceUpdateManyMutationInput;
      where?: ResourceWhereInput | null;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  updateManyAttributes: <T = BatchPayload>(
    args: {
      data: AttributeUpdateManyMutationInput;
      where?: AttributeWhereInput | null;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  updateManyInputColumns: <T = BatchPayload>(
    args: {
      data: InputColumnUpdateManyMutationInput;
      where?: InputColumnWhereInput | null;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  updateManyJoins: <T = BatchPayload>(
    args: { data: JoinUpdateManyMutationInput; where?: JoinWhereInput | null },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  updateManyUsers: <T = BatchPayload>(
    args: { data: UserUpdateManyMutationInput; where?: UserWhereInput | null },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  updateManyCredentials: <T = BatchPayload>(
    args: {
      data: CredentialUpdateManyMutationInput;
      where?: CredentialWhereInput | null;
    },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  deleteManySources: <T = BatchPayload>(
    args: { where?: SourceWhereInput | null },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  deleteManyResources: <T = BatchPayload>(
    args: { where?: ResourceWhereInput | null },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  deleteManyAttributes: <T = BatchPayload>(
    args: { where?: AttributeWhereInput | null },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  deleteManyInputColumns: <T = BatchPayload>(
    args: { where?: InputColumnWhereInput | null },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  deleteManyJoins: <T = BatchPayload>(
    args: { where?: JoinWhereInput | null },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  deleteManyUsers: <T = BatchPayload>(
    args: { where?: UserWhereInput | null },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
  deleteManyCredentials: <T = BatchPayload>(
    args: { where?: CredentialWhereInput | null },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<T>;
}

export interface Subscription {
  source: <T = SourceSubscriptionPayload | null>(
    args: { where?: SourceSubscriptionWhereInput | null },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<AsyncIterator<T | null>>;
  resource: <T = ResourceSubscriptionPayload | null>(
    args: { where?: ResourceSubscriptionWhereInput | null },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<AsyncIterator<T | null>>;
  attribute: <T = AttributeSubscriptionPayload | null>(
    args: { where?: AttributeSubscriptionWhereInput | null },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<AsyncIterator<T | null>>;
  inputColumn: <T = InputColumnSubscriptionPayload | null>(
    args: { where?: InputColumnSubscriptionWhereInput | null },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<AsyncIterator<T | null>>;
  join: <T = JoinSubscriptionPayload | null>(
    args: { where?: JoinSubscriptionWhereInput | null },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<AsyncIterator<T | null>>;
  user: <T = UserSubscriptionPayload | null>(
    args: { where?: UserSubscriptionWhereInput | null },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<AsyncIterator<T | null>>;
  credential: <T = CredentialSubscriptionPayload | null>(
    args: { where?: CredentialSubscriptionWhereInput | null },
    info?: GraphQLResolveInfo | string,
    options?: Options
  ) => Promise<AsyncIterator<T | null>>;
}

export interface Exists {
  Source: (where?: SourceWhereInput) => Promise<boolean>;
  Resource: (where?: ResourceWhereInput) => Promise<boolean>;
  Attribute: (where?: AttributeWhereInput) => Promise<boolean>;
  InputColumn: (where?: InputColumnWhereInput) => Promise<boolean>;
  Join: (where?: JoinWhereInput) => Promise<boolean>;
  User: (where?: UserWhereInput) => Promise<boolean>;
  Credential: (where?: CredentialWhereInput) => Promise<boolean>;
}

export interface Prisma {
  query: Query;
  mutation: Mutation;
  subscription: Subscription;
  exists: Exists;
  request: <T = any>(
    query: string,
    variables?: { [key: string]: any }
  ) => Promise<T>;
  delegate(
    operation: "query" | "mutation",
    fieldName: string,
    args: {
      [key: string]: any;
    },
    infoOrQuery?: GraphQLResolveInfo | string,
    options?: Options
  ): Promise<any>;
  delegateSubscription(
    fieldName: string,
    args?: {
      [key: string]: any;
    },
    infoOrQuery?: GraphQLResolveInfo | string,
    options?: Options
  ): Promise<AsyncIterator<any>>;
  getAbstractResolvers(filterSchema?: GraphQLSchema | string): IResolvers;
}

export interface BindingConstructor<T> {
  new (options: BasePrismaOptions): T;
}
/**
 * Type Defs
 */

const typeDefs = `type AggregateAttribute {
  count: Int!
}

type AggregateCredential {
  count: Int!
}

type AggregateInputColumn {
  count: Int!
}

type AggregateJoin {
  count: Int!
}

type AggregateResource {
  count: Int!
}

type AggregateSource {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type Attribute implements Node {
  id: ID!
  name: String!
  mergingScript: String
  isProfile: Boolean
  type: String
  comment: String
  depth: Int
  resource: Resource
  attributes(where: AttributeWhereInput, orderBy: AttributeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Attribute!]
  attribute: Attribute
  inputColumns(where: InputColumnWhereInput, orderBy: InputColumnOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [InputColumn!]
  updatedAt: DateTime!
  createdAt: DateTime!
}

"""A connection to a list of items."""
type AttributeConnection {
  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """A list of edges."""
  edges: [AttributeEdge]!
  aggregate: AggregateAttribute!
}

input AttributeCreateInput {
  id: ID
  name: String!
  mergingScript: String
  isProfile: Boolean
  type: String
  comment: String
  depth: Int
  resource: ResourceCreateOneWithoutAttributesInput
  attributes: AttributeCreateManyWithoutAttributeInput
  attribute: AttributeCreateOneWithoutAttributesInput
  inputColumns: InputColumnCreateManyWithoutAttributeInput
}

input AttributeCreateManyWithoutAttributeInput {
  create: [AttributeCreateWithoutAttributeInput!]
  connect: [AttributeWhereUniqueInput!]
}

input AttributeCreateManyWithoutResourceInput {
  create: [AttributeCreateWithoutResourceInput!]
  connect: [AttributeWhereUniqueInput!]
}

input AttributeCreateOneWithoutAttributesInput {
  create: AttributeCreateWithoutAttributesInput
  connect: AttributeWhereUniqueInput
}

input AttributeCreateOneWithoutInputColumnsInput {
  create: AttributeCreateWithoutInputColumnsInput
  connect: AttributeWhereUniqueInput
}

input AttributeCreateWithoutAttributeInput {
  id: ID
  name: String!
  mergingScript: String
  isProfile: Boolean
  type: String
  comment: String
  depth: Int
  resource: ResourceCreateOneWithoutAttributesInput
  attributes: AttributeCreateManyWithoutAttributeInput
  inputColumns: InputColumnCreateManyWithoutAttributeInput
}

input AttributeCreateWithoutAttributesInput {
  id: ID
  name: String!
  mergingScript: String
  isProfile: Boolean
  type: String
  comment: String
  depth: Int
  resource: ResourceCreateOneWithoutAttributesInput
  attribute: AttributeCreateOneWithoutAttributesInput
  inputColumns: InputColumnCreateManyWithoutAttributeInput
}

input AttributeCreateWithoutInputColumnsInput {
  id: ID
  name: String!
  mergingScript: String
  isProfile: Boolean
  type: String
  comment: String
  depth: Int
  resource: ResourceCreateOneWithoutAttributesInput
  attributes: AttributeCreateManyWithoutAttributeInput
  attribute: AttributeCreateOneWithoutAttributesInput
}

input AttributeCreateWithoutResourceInput {
  id: ID
  name: String!
  mergingScript: String
  isProfile: Boolean
  type: String
  comment: String
  depth: Int
  attributes: AttributeCreateManyWithoutAttributeInput
  attribute: AttributeCreateOneWithoutAttributesInput
  inputColumns: InputColumnCreateManyWithoutAttributeInput
}

"""An edge in a connection."""
type AttributeEdge {
  """The item at the end of the edge."""
  node: Attribute!

  """A cursor for use in pagination."""
  cursor: String!
}

enum AttributeOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
  mergingScript_ASC
  mergingScript_DESC
  isProfile_ASC
  isProfile_DESC
  type_ASC
  type_DESC
  comment_ASC
  comment_DESC
  depth_ASC
  depth_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type AttributePreviousValues {
  id: ID!
  name: String!
  mergingScript: String
  isProfile: Boolean
  type: String
  comment: String
  depth: Int
  updatedAt: DateTime!
  createdAt: DateTime!
}

input AttributeScalarWhereInput {
  """Logical AND on all given filters."""
  AND: [AttributeScalarWhereInput!]

  """Logical OR on all given filters."""
  OR: [AttributeScalarWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [AttributeScalarWhereInput!]
  id: ID

  """All values that are not equal to given value."""
  id_not: ID

  """All values that are contained in given list."""
  id_in: [ID!]

  """All values that are not contained in given list."""
  id_not_in: [ID!]

  """All values less than the given value."""
  id_lt: ID

  """All values less than or equal the given value."""
  id_lte: ID

  """All values greater than the given value."""
  id_gt: ID

  """All values greater than or equal the given value."""
  id_gte: ID

  """All values containing the given string."""
  id_contains: ID

  """All values not containing the given string."""
  id_not_contains: ID

  """All values starting with the given string."""
  id_starts_with: ID

  """All values not starting with the given string."""
  id_not_starts_with: ID

  """All values ending with the given string."""
  id_ends_with: ID

  """All values not ending with the given string."""
  id_not_ends_with: ID
  name: String

  """All values that are not equal to given value."""
  name_not: String

  """All values that are contained in given list."""
  name_in: [String!]

  """All values that are not contained in given list."""
  name_not_in: [String!]

  """All values less than the given value."""
  name_lt: String

  """All values less than or equal the given value."""
  name_lte: String

  """All values greater than the given value."""
  name_gt: String

  """All values greater than or equal the given value."""
  name_gte: String

  """All values containing the given string."""
  name_contains: String

  """All values not containing the given string."""
  name_not_contains: String

  """All values starting with the given string."""
  name_starts_with: String

  """All values not starting with the given string."""
  name_not_starts_with: String

  """All values ending with the given string."""
  name_ends_with: String

  """All values not ending with the given string."""
  name_not_ends_with: String
  mergingScript: String

  """All values that are not equal to given value."""
  mergingScript_not: String

  """All values that are contained in given list."""
  mergingScript_in: [String!]

  """All values that are not contained in given list."""
  mergingScript_not_in: [String!]

  """All values less than the given value."""
  mergingScript_lt: String

  """All values less than or equal the given value."""
  mergingScript_lte: String

  """All values greater than the given value."""
  mergingScript_gt: String

  """All values greater than or equal the given value."""
  mergingScript_gte: String

  """All values containing the given string."""
  mergingScript_contains: String

  """All values not containing the given string."""
  mergingScript_not_contains: String

  """All values starting with the given string."""
  mergingScript_starts_with: String

  """All values not starting with the given string."""
  mergingScript_not_starts_with: String

  """All values ending with the given string."""
  mergingScript_ends_with: String

  """All values not ending with the given string."""
  mergingScript_not_ends_with: String
  isProfile: Boolean

  """All values that are not equal to given value."""
  isProfile_not: Boolean
  type: String

  """All values that are not equal to given value."""
  type_not: String

  """All values that are contained in given list."""
  type_in: [String!]

  """All values that are not contained in given list."""
  type_not_in: [String!]

  """All values less than the given value."""
  type_lt: String

  """All values less than or equal the given value."""
  type_lte: String

  """All values greater than the given value."""
  type_gt: String

  """All values greater than or equal the given value."""
  type_gte: String

  """All values containing the given string."""
  type_contains: String

  """All values not containing the given string."""
  type_not_contains: String

  """All values starting with the given string."""
  type_starts_with: String

  """All values not starting with the given string."""
  type_not_starts_with: String

  """All values ending with the given string."""
  type_ends_with: String

  """All values not ending with the given string."""
  type_not_ends_with: String
  comment: String

  """All values that are not equal to given value."""
  comment_not: String

  """All values that are contained in given list."""
  comment_in: [String!]

  """All values that are not contained in given list."""
  comment_not_in: [String!]

  """All values less than the given value."""
  comment_lt: String

  """All values less than or equal the given value."""
  comment_lte: String

  """All values greater than the given value."""
  comment_gt: String

  """All values greater than or equal the given value."""
  comment_gte: String

  """All values containing the given string."""
  comment_contains: String

  """All values not containing the given string."""
  comment_not_contains: String

  """All values starting with the given string."""
  comment_starts_with: String

  """All values not starting with the given string."""
  comment_not_starts_with: String

  """All values ending with the given string."""
  comment_ends_with: String

  """All values not ending with the given string."""
  comment_not_ends_with: String
  depth: Int

  """All values that are not equal to given value."""
  depth_not: Int

  """All values that are contained in given list."""
  depth_in: [Int!]

  """All values that are not contained in given list."""
  depth_not_in: [Int!]

  """All values less than the given value."""
  depth_lt: Int

  """All values less than or equal the given value."""
  depth_lte: Int

  """All values greater than the given value."""
  depth_gt: Int

  """All values greater than or equal the given value."""
  depth_gte: Int
  updatedAt: DateTime

  """All values that are not equal to given value."""
  updatedAt_not: DateTime

  """All values that are contained in given list."""
  updatedAt_in: [DateTime!]

  """All values that are not contained in given list."""
  updatedAt_not_in: [DateTime!]

  """All values less than the given value."""
  updatedAt_lt: DateTime

  """All values less than or equal the given value."""
  updatedAt_lte: DateTime

  """All values greater than the given value."""
  updatedAt_gt: DateTime

  """All values greater than or equal the given value."""
  updatedAt_gte: DateTime
  createdAt: DateTime

  """All values that are not equal to given value."""
  createdAt_not: DateTime

  """All values that are contained in given list."""
  createdAt_in: [DateTime!]

  """All values that are not contained in given list."""
  createdAt_not_in: [DateTime!]

  """All values less than the given value."""
  createdAt_lt: DateTime

  """All values less than or equal the given value."""
  createdAt_lte: DateTime

  """All values greater than the given value."""
  createdAt_gt: DateTime

  """All values greater than or equal the given value."""
  createdAt_gte: DateTime
}

type AttributeSubscriptionPayload {
  mutation: MutationType!
  node: Attribute
  updatedFields: [String!]
  previousValues: AttributePreviousValues
}

input AttributeSubscriptionWhereInput {
  """Logical AND on all given filters."""
  AND: [AttributeSubscriptionWhereInput!]

  """Logical OR on all given filters."""
  OR: [AttributeSubscriptionWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [AttributeSubscriptionWhereInput!]

  """The subscription event gets dispatched when it's listed in mutation_in"""
  mutation_in: [MutationType!]

  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String

  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]

  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: AttributeWhereInput
}

input AttributeUpdateInput {
  name: String
  mergingScript: String
  isProfile: Boolean
  type: String
  comment: String
  depth: Int
  resource: ResourceUpdateOneWithoutAttributesInput
  attributes: AttributeUpdateManyWithoutAttributeInput
  attribute: AttributeUpdateOneWithoutAttributesInput
  inputColumns: InputColumnUpdateManyWithoutAttributeInput
}

input AttributeUpdateManyDataInput {
  name: String
  mergingScript: String
  isProfile: Boolean
  type: String
  comment: String
  depth: Int
}

input AttributeUpdateManyMutationInput {
  name: String
  mergingScript: String
  isProfile: Boolean
  type: String
  comment: String
  depth: Int
}

input AttributeUpdateManyWithoutAttributeInput {
  create: [AttributeCreateWithoutAttributeInput!]
  connect: [AttributeWhereUniqueInput!]
  set: [AttributeWhereUniqueInput!]
  disconnect: [AttributeWhereUniqueInput!]
  delete: [AttributeWhereUniqueInput!]
  update: [AttributeUpdateWithWhereUniqueWithoutAttributeInput!]
  updateMany: [AttributeUpdateManyWithWhereNestedInput!]
  deleteMany: [AttributeScalarWhereInput!]
  upsert: [AttributeUpsertWithWhereUniqueWithoutAttributeInput!]
}

input AttributeUpdateManyWithoutResourceInput {
  create: [AttributeCreateWithoutResourceInput!]
  connect: [AttributeWhereUniqueInput!]
  set: [AttributeWhereUniqueInput!]
  disconnect: [AttributeWhereUniqueInput!]
  delete: [AttributeWhereUniqueInput!]
  update: [AttributeUpdateWithWhereUniqueWithoutResourceInput!]
  updateMany: [AttributeUpdateManyWithWhereNestedInput!]
  deleteMany: [AttributeScalarWhereInput!]
  upsert: [AttributeUpsertWithWhereUniqueWithoutResourceInput!]
}

input AttributeUpdateManyWithWhereNestedInput {
  where: AttributeScalarWhereInput!
  data: AttributeUpdateManyDataInput!
}

input AttributeUpdateOneRequiredWithoutInputColumnsInput {
  create: AttributeCreateWithoutInputColumnsInput
  connect: AttributeWhereUniqueInput
  update: AttributeUpdateWithoutInputColumnsDataInput
  upsert: AttributeUpsertWithoutInputColumnsInput
}

input AttributeUpdateOneWithoutAttributesInput {
  create: AttributeCreateWithoutAttributesInput
  connect: AttributeWhereUniqueInput
  disconnect: Boolean
  delete: Boolean
  update: AttributeUpdateWithoutAttributesDataInput
  upsert: AttributeUpsertWithoutAttributesInput
}

input AttributeUpdateWithoutAttributeDataInput {
  name: String
  mergingScript: String
  isProfile: Boolean
  type: String
  comment: String
  depth: Int
  resource: ResourceUpdateOneWithoutAttributesInput
  attributes: AttributeUpdateManyWithoutAttributeInput
  inputColumns: InputColumnUpdateManyWithoutAttributeInput
}

input AttributeUpdateWithoutAttributesDataInput {
  name: String
  mergingScript: String
  isProfile: Boolean
  type: String
  comment: String
  depth: Int
  resource: ResourceUpdateOneWithoutAttributesInput
  attribute: AttributeUpdateOneWithoutAttributesInput
  inputColumns: InputColumnUpdateManyWithoutAttributeInput
}

input AttributeUpdateWithoutInputColumnsDataInput {
  name: String
  mergingScript: String
  isProfile: Boolean
  type: String
  comment: String
  depth: Int
  resource: ResourceUpdateOneWithoutAttributesInput
  attributes: AttributeUpdateManyWithoutAttributeInput
  attribute: AttributeUpdateOneWithoutAttributesInput
}

input AttributeUpdateWithoutResourceDataInput {
  name: String
  mergingScript: String
  isProfile: Boolean
  type: String
  comment: String
  depth: Int
  attributes: AttributeUpdateManyWithoutAttributeInput
  attribute: AttributeUpdateOneWithoutAttributesInput
  inputColumns: InputColumnUpdateManyWithoutAttributeInput
}

input AttributeUpdateWithWhereUniqueWithoutAttributeInput {
  where: AttributeWhereUniqueInput!
  data: AttributeUpdateWithoutAttributeDataInput!
}

input AttributeUpdateWithWhereUniqueWithoutResourceInput {
  where: AttributeWhereUniqueInput!
  data: AttributeUpdateWithoutResourceDataInput!
}

input AttributeUpsertWithoutAttributesInput {
  update: AttributeUpdateWithoutAttributesDataInput!
  create: AttributeCreateWithoutAttributesInput!
}

input AttributeUpsertWithoutInputColumnsInput {
  update: AttributeUpdateWithoutInputColumnsDataInput!
  create: AttributeCreateWithoutInputColumnsInput!
}

input AttributeUpsertWithWhereUniqueWithoutAttributeInput {
  where: AttributeWhereUniqueInput!
  update: AttributeUpdateWithoutAttributeDataInput!
  create: AttributeCreateWithoutAttributeInput!
}

input AttributeUpsertWithWhereUniqueWithoutResourceInput {
  where: AttributeWhereUniqueInput!
  update: AttributeUpdateWithoutResourceDataInput!
  create: AttributeCreateWithoutResourceInput!
}

input AttributeWhereInput {
  """Logical AND on all given filters."""
  AND: [AttributeWhereInput!]

  """Logical OR on all given filters."""
  OR: [AttributeWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [AttributeWhereInput!]
  id: ID

  """All values that are not equal to given value."""
  id_not: ID

  """All values that are contained in given list."""
  id_in: [ID!]

  """All values that are not contained in given list."""
  id_not_in: [ID!]

  """All values less than the given value."""
  id_lt: ID

  """All values less than or equal the given value."""
  id_lte: ID

  """All values greater than the given value."""
  id_gt: ID

  """All values greater than or equal the given value."""
  id_gte: ID

  """All values containing the given string."""
  id_contains: ID

  """All values not containing the given string."""
  id_not_contains: ID

  """All values starting with the given string."""
  id_starts_with: ID

  """All values not starting with the given string."""
  id_not_starts_with: ID

  """All values ending with the given string."""
  id_ends_with: ID

  """All values not ending with the given string."""
  id_not_ends_with: ID
  name: String

  """All values that are not equal to given value."""
  name_not: String

  """All values that are contained in given list."""
  name_in: [String!]

  """All values that are not contained in given list."""
  name_not_in: [String!]

  """All values less than the given value."""
  name_lt: String

  """All values less than or equal the given value."""
  name_lte: String

  """All values greater than the given value."""
  name_gt: String

  """All values greater than or equal the given value."""
  name_gte: String

  """All values containing the given string."""
  name_contains: String

  """All values not containing the given string."""
  name_not_contains: String

  """All values starting with the given string."""
  name_starts_with: String

  """All values not starting with the given string."""
  name_not_starts_with: String

  """All values ending with the given string."""
  name_ends_with: String

  """All values not ending with the given string."""
  name_not_ends_with: String
  mergingScript: String

  """All values that are not equal to given value."""
  mergingScript_not: String

  """All values that are contained in given list."""
  mergingScript_in: [String!]

  """All values that are not contained in given list."""
  mergingScript_not_in: [String!]

  """All values less than the given value."""
  mergingScript_lt: String

  """All values less than or equal the given value."""
  mergingScript_lte: String

  """All values greater than the given value."""
  mergingScript_gt: String

  """All values greater than or equal the given value."""
  mergingScript_gte: String

  """All values containing the given string."""
  mergingScript_contains: String

  """All values not containing the given string."""
  mergingScript_not_contains: String

  """All values starting with the given string."""
  mergingScript_starts_with: String

  """All values not starting with the given string."""
  mergingScript_not_starts_with: String

  """All values ending with the given string."""
  mergingScript_ends_with: String

  """All values not ending with the given string."""
  mergingScript_not_ends_with: String
  isProfile: Boolean

  """All values that are not equal to given value."""
  isProfile_not: Boolean
  type: String

  """All values that are not equal to given value."""
  type_not: String

  """All values that are contained in given list."""
  type_in: [String!]

  """All values that are not contained in given list."""
  type_not_in: [String!]

  """All values less than the given value."""
  type_lt: String

  """All values less than or equal the given value."""
  type_lte: String

  """All values greater than the given value."""
  type_gt: String

  """All values greater than or equal the given value."""
  type_gte: String

  """All values containing the given string."""
  type_contains: String

  """All values not containing the given string."""
  type_not_contains: String

  """All values starting with the given string."""
  type_starts_with: String

  """All values not starting with the given string."""
  type_not_starts_with: String

  """All values ending with the given string."""
  type_ends_with: String

  """All values not ending with the given string."""
  type_not_ends_with: String
  comment: String

  """All values that are not equal to given value."""
  comment_not: String

  """All values that are contained in given list."""
  comment_in: [String!]

  """All values that are not contained in given list."""
  comment_not_in: [String!]

  """All values less than the given value."""
  comment_lt: String

  """All values less than or equal the given value."""
  comment_lte: String

  """All values greater than the given value."""
  comment_gt: String

  """All values greater than or equal the given value."""
  comment_gte: String

  """All values containing the given string."""
  comment_contains: String

  """All values not containing the given string."""
  comment_not_contains: String

  """All values starting with the given string."""
  comment_starts_with: String

  """All values not starting with the given string."""
  comment_not_starts_with: String

  """All values ending with the given string."""
  comment_ends_with: String

  """All values not ending with the given string."""
  comment_not_ends_with: String
  depth: Int

  """All values that are not equal to given value."""
  depth_not: Int

  """All values that are contained in given list."""
  depth_in: [Int!]

  """All values that are not contained in given list."""
  depth_not_in: [Int!]

  """All values less than the given value."""
  depth_lt: Int

  """All values less than or equal the given value."""
  depth_lte: Int

  """All values greater than the given value."""
  depth_gt: Int

  """All values greater than or equal the given value."""
  depth_gte: Int
  updatedAt: DateTime

  """All values that are not equal to given value."""
  updatedAt_not: DateTime

  """All values that are contained in given list."""
  updatedAt_in: [DateTime!]

  """All values that are not contained in given list."""
  updatedAt_not_in: [DateTime!]

  """All values less than the given value."""
  updatedAt_lt: DateTime

  """All values less than or equal the given value."""
  updatedAt_lte: DateTime

  """All values greater than the given value."""
  updatedAt_gt: DateTime

  """All values greater than or equal the given value."""
  updatedAt_gte: DateTime
  createdAt: DateTime

  """All values that are not equal to given value."""
  createdAt_not: DateTime

  """All values that are contained in given list."""
  createdAt_in: [DateTime!]

  """All values that are not contained in given list."""
  createdAt_not_in: [DateTime!]

  """All values less than the given value."""
  createdAt_lt: DateTime

  """All values less than or equal the given value."""
  createdAt_lte: DateTime

  """All values greater than the given value."""
  createdAt_gt: DateTime

  """All values greater than or equal the given value."""
  createdAt_gte: DateTime
  resource: ResourceWhereInput
  attributes_every: AttributeWhereInput
  attributes_some: AttributeWhereInput
  attributes_none: AttributeWhereInput
  attribute: AttributeWhereInput
  inputColumns_every: InputColumnWhereInput
  inputColumns_some: InputColumnWhereInput
  inputColumns_none: InputColumnWhereInput
}

input AttributeWhereUniqueInput {
  id: ID
}

type BatchPayload {
  """The number of nodes that have been affected by the Batch operation."""
  count: Long!
}

type Credential implements Node {
  id: ID!
  host: String!
  port: String!
  login: String!
  password: String
  type: DatabaseType!
  source(where: SourceWhereInput, orderBy: SourceOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Source!]
}

"""A connection to a list of items."""
type CredentialConnection {
  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """A list of edges."""
  edges: [CredentialEdge]!
  aggregate: AggregateCredential!
}

input CredentialCreateInput {
  id: ID
  host: String!
  port: String!
  login: String!
  password: String
  type: DatabaseType!
  source: SourceCreateManyWithoutCredentialInput
}

input CredentialCreateManyInput {
  create: [CredentialCreateInput!]
  connect: [CredentialWhereUniqueInput!]
}

input CredentialCreateOneWithoutSourceInput {
  create: CredentialCreateWithoutSourceInput
  connect: CredentialWhereUniqueInput
}

input CredentialCreateWithoutSourceInput {
  id: ID
  host: String!
  port: String!
  login: String!
  password: String
  type: DatabaseType!
}

"""An edge in a connection."""
type CredentialEdge {
  """The item at the end of the edge."""
  node: Credential!

  """A cursor for use in pagination."""
  cursor: String!
}

enum CredentialOrderByInput {
  id_ASC
  id_DESC
  host_ASC
  host_DESC
  port_ASC
  port_DESC
  login_ASC
  login_DESC
  password_ASC
  password_DESC
  type_ASC
  type_DESC
}

type CredentialPreviousValues {
  id: ID!
  host: String!
  port: String!
  login: String!
  password: String
  type: DatabaseType!
}

input CredentialScalarWhereInput {
  """Logical AND on all given filters."""
  AND: [CredentialScalarWhereInput!]

  """Logical OR on all given filters."""
  OR: [CredentialScalarWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [CredentialScalarWhereInput!]
  id: ID

  """All values that are not equal to given value."""
  id_not: ID

  """All values that are contained in given list."""
  id_in: [ID!]

  """All values that are not contained in given list."""
  id_not_in: [ID!]

  """All values less than the given value."""
  id_lt: ID

  """All values less than or equal the given value."""
  id_lte: ID

  """All values greater than the given value."""
  id_gt: ID

  """All values greater than or equal the given value."""
  id_gte: ID

  """All values containing the given string."""
  id_contains: ID

  """All values not containing the given string."""
  id_not_contains: ID

  """All values starting with the given string."""
  id_starts_with: ID

  """All values not starting with the given string."""
  id_not_starts_with: ID

  """All values ending with the given string."""
  id_ends_with: ID

  """All values not ending with the given string."""
  id_not_ends_with: ID
  host: String

  """All values that are not equal to given value."""
  host_not: String

  """All values that are contained in given list."""
  host_in: [String!]

  """All values that are not contained in given list."""
  host_not_in: [String!]

  """All values less than the given value."""
  host_lt: String

  """All values less than or equal the given value."""
  host_lte: String

  """All values greater than the given value."""
  host_gt: String

  """All values greater than or equal the given value."""
  host_gte: String

  """All values containing the given string."""
  host_contains: String

  """All values not containing the given string."""
  host_not_contains: String

  """All values starting with the given string."""
  host_starts_with: String

  """All values not starting with the given string."""
  host_not_starts_with: String

  """All values ending with the given string."""
  host_ends_with: String

  """All values not ending with the given string."""
  host_not_ends_with: String
  port: String

  """All values that are not equal to given value."""
  port_not: String

  """All values that are contained in given list."""
  port_in: [String!]

  """All values that are not contained in given list."""
  port_not_in: [String!]

  """All values less than the given value."""
  port_lt: String

  """All values less than or equal the given value."""
  port_lte: String

  """All values greater than the given value."""
  port_gt: String

  """All values greater than or equal the given value."""
  port_gte: String

  """All values containing the given string."""
  port_contains: String

  """All values not containing the given string."""
  port_not_contains: String

  """All values starting with the given string."""
  port_starts_with: String

  """All values not starting with the given string."""
  port_not_starts_with: String

  """All values ending with the given string."""
  port_ends_with: String

  """All values not ending with the given string."""
  port_not_ends_with: String
  login: String

  """All values that are not equal to given value."""
  login_not: String

  """All values that are contained in given list."""
  login_in: [String!]

  """All values that are not contained in given list."""
  login_not_in: [String!]

  """All values less than the given value."""
  login_lt: String

  """All values less than or equal the given value."""
  login_lte: String

  """All values greater than the given value."""
  login_gt: String

  """All values greater than or equal the given value."""
  login_gte: String

  """All values containing the given string."""
  login_contains: String

  """All values not containing the given string."""
  login_not_contains: String

  """All values starting with the given string."""
  login_starts_with: String

  """All values not starting with the given string."""
  login_not_starts_with: String

  """All values ending with the given string."""
  login_ends_with: String

  """All values not ending with the given string."""
  login_not_ends_with: String
  password: String

  """All values that are not equal to given value."""
  password_not: String

  """All values that are contained in given list."""
  password_in: [String!]

  """All values that are not contained in given list."""
  password_not_in: [String!]

  """All values less than the given value."""
  password_lt: String

  """All values less than or equal the given value."""
  password_lte: String

  """All values greater than the given value."""
  password_gt: String

  """All values greater than or equal the given value."""
  password_gte: String

  """All values containing the given string."""
  password_contains: String

  """All values not containing the given string."""
  password_not_contains: String

  """All values starting with the given string."""
  password_starts_with: String

  """All values not starting with the given string."""
  password_not_starts_with: String

  """All values ending with the given string."""
  password_ends_with: String

  """All values not ending with the given string."""
  password_not_ends_with: String
  type: DatabaseType

  """All values that are not equal to given value."""
  type_not: DatabaseType

  """All values that are contained in given list."""
  type_in: [DatabaseType!]

  """All values that are not contained in given list."""
  type_not_in: [DatabaseType!]
}

type CredentialSubscriptionPayload {
  mutation: MutationType!
  node: Credential
  updatedFields: [String!]
  previousValues: CredentialPreviousValues
}

input CredentialSubscriptionWhereInput {
  """Logical AND on all given filters."""
  AND: [CredentialSubscriptionWhereInput!]

  """Logical OR on all given filters."""
  OR: [CredentialSubscriptionWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [CredentialSubscriptionWhereInput!]

  """The subscription event gets dispatched when it's listed in mutation_in"""
  mutation_in: [MutationType!]

  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String

  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]

  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: CredentialWhereInput
}

input CredentialUpdateDataInput {
  host: String
  port: String
  login: String
  password: String
  type: DatabaseType
  source: SourceUpdateManyWithoutCredentialInput
}

input CredentialUpdateInput {
  host: String
  port: String
  login: String
  password: String
  type: DatabaseType
  source: SourceUpdateManyWithoutCredentialInput
}

input CredentialUpdateManyDataInput {
  host: String
  port: String
  login: String
  password: String
  type: DatabaseType
}

input CredentialUpdateManyInput {
  create: [CredentialCreateInput!]
  connect: [CredentialWhereUniqueInput!]
  set: [CredentialWhereUniqueInput!]
  disconnect: [CredentialWhereUniqueInput!]
  delete: [CredentialWhereUniqueInput!]
  update: [CredentialUpdateWithWhereUniqueNestedInput!]
  updateMany: [CredentialUpdateManyWithWhereNestedInput!]
  deleteMany: [CredentialScalarWhereInput!]
  upsert: [CredentialUpsertWithWhereUniqueNestedInput!]
}

input CredentialUpdateManyMutationInput {
  host: String
  port: String
  login: String
  password: String
  type: DatabaseType
}

input CredentialUpdateManyWithWhereNestedInput {
  where: CredentialScalarWhereInput!
  data: CredentialUpdateManyDataInput!
}

input CredentialUpdateOneWithoutSourceInput {
  create: CredentialCreateWithoutSourceInput
  connect: CredentialWhereUniqueInput
  disconnect: Boolean
  delete: Boolean
  update: CredentialUpdateWithoutSourceDataInput
  upsert: CredentialUpsertWithoutSourceInput
}

input CredentialUpdateWithoutSourceDataInput {
  host: String
  port: String
  login: String
  password: String
  type: DatabaseType
}

input CredentialUpdateWithWhereUniqueNestedInput {
  where: CredentialWhereUniqueInput!
  data: CredentialUpdateDataInput!
}

input CredentialUpsertWithoutSourceInput {
  update: CredentialUpdateWithoutSourceDataInput!
  create: CredentialCreateWithoutSourceInput!
}

input CredentialUpsertWithWhereUniqueNestedInput {
  where: CredentialWhereUniqueInput!
  update: CredentialUpdateDataInput!
  create: CredentialCreateInput!
}

input CredentialWhereInput {
  """Logical AND on all given filters."""
  AND: [CredentialWhereInput!]

  """Logical OR on all given filters."""
  OR: [CredentialWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [CredentialWhereInput!]
  id: ID

  """All values that are not equal to given value."""
  id_not: ID

  """All values that are contained in given list."""
  id_in: [ID!]

  """All values that are not contained in given list."""
  id_not_in: [ID!]

  """All values less than the given value."""
  id_lt: ID

  """All values less than or equal the given value."""
  id_lte: ID

  """All values greater than the given value."""
  id_gt: ID

  """All values greater than or equal the given value."""
  id_gte: ID

  """All values containing the given string."""
  id_contains: ID

  """All values not containing the given string."""
  id_not_contains: ID

  """All values starting with the given string."""
  id_starts_with: ID

  """All values not starting with the given string."""
  id_not_starts_with: ID

  """All values ending with the given string."""
  id_ends_with: ID

  """All values not ending with the given string."""
  id_not_ends_with: ID
  host: String

  """All values that are not equal to given value."""
  host_not: String

  """All values that are contained in given list."""
  host_in: [String!]

  """All values that are not contained in given list."""
  host_not_in: [String!]

  """All values less than the given value."""
  host_lt: String

  """All values less than or equal the given value."""
  host_lte: String

  """All values greater than the given value."""
  host_gt: String

  """All values greater than or equal the given value."""
  host_gte: String

  """All values containing the given string."""
  host_contains: String

  """All values not containing the given string."""
  host_not_contains: String

  """All values starting with the given string."""
  host_starts_with: String

  """All values not starting with the given string."""
  host_not_starts_with: String

  """All values ending with the given string."""
  host_ends_with: String

  """All values not ending with the given string."""
  host_not_ends_with: String
  port: String

  """All values that are not equal to given value."""
  port_not: String

  """All values that are contained in given list."""
  port_in: [String!]

  """All values that are not contained in given list."""
  port_not_in: [String!]

  """All values less than the given value."""
  port_lt: String

  """All values less than or equal the given value."""
  port_lte: String

  """All values greater than the given value."""
  port_gt: String

  """All values greater than or equal the given value."""
  port_gte: String

  """All values containing the given string."""
  port_contains: String

  """All values not containing the given string."""
  port_not_contains: String

  """All values starting with the given string."""
  port_starts_with: String

  """All values not starting with the given string."""
  port_not_starts_with: String

  """All values ending with the given string."""
  port_ends_with: String

  """All values not ending with the given string."""
  port_not_ends_with: String
  login: String

  """All values that are not equal to given value."""
  login_not: String

  """All values that are contained in given list."""
  login_in: [String!]

  """All values that are not contained in given list."""
  login_not_in: [String!]

  """All values less than the given value."""
  login_lt: String

  """All values less than or equal the given value."""
  login_lte: String

  """All values greater than the given value."""
  login_gt: String

  """All values greater than or equal the given value."""
  login_gte: String

  """All values containing the given string."""
  login_contains: String

  """All values not containing the given string."""
  login_not_contains: String

  """All values starting with the given string."""
  login_starts_with: String

  """All values not starting with the given string."""
  login_not_starts_with: String

  """All values ending with the given string."""
  login_ends_with: String

  """All values not ending with the given string."""
  login_not_ends_with: String
  password: String

  """All values that are not equal to given value."""
  password_not: String

  """All values that are contained in given list."""
  password_in: [String!]

  """All values that are not contained in given list."""
  password_not_in: [String!]

  """All values less than the given value."""
  password_lt: String

  """All values less than or equal the given value."""
  password_lte: String

  """All values greater than the given value."""
  password_gt: String

  """All values greater than or equal the given value."""
  password_gte: String

  """All values containing the given string."""
  password_contains: String

  """All values not containing the given string."""
  password_not_contains: String

  """All values starting with the given string."""
  password_starts_with: String

  """All values not starting with the given string."""
  password_not_starts_with: String

  """All values ending with the given string."""
  password_ends_with: String

  """All values not ending with the given string."""
  password_not_ends_with: String
  type: DatabaseType

  """All values that are not equal to given value."""
  type_not: DatabaseType

  """All values that are contained in given list."""
  type_in: [DatabaseType!]

  """All values that are not contained in given list."""
  type_not_in: [DatabaseType!]
  source_every: SourceWhereInput
  source_some: SourceWhereInput
  source_none: SourceWhereInput
}

input CredentialWhereUniqueInput {
  id: ID
}

enum DatabaseType {
  POSTGRES
}

scalar DateTime

type InputColumn implements Node {
  id: ID!
  owner: String
  table: String
  column: String
  script: String
  staticValue: String
  joins(where: JoinWhereInput, orderBy: JoinOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Join!]
  attribute: Attribute!
  updatedAt: DateTime!
  createdAt: DateTime!
}

"""A connection to a list of items."""
type InputColumnConnection {
  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """A list of edges."""
  edges: [InputColumnEdge]!
  aggregate: AggregateInputColumn!
}

input InputColumnCreateInput {
  id: ID
  owner: String
  table: String
  column: String
  script: String
  staticValue: String
  joins: JoinCreateManyWithoutInputColumnInput
  attribute: AttributeCreateOneWithoutInputColumnsInput!
}

input InputColumnCreateManyWithoutAttributeInput {
  create: [InputColumnCreateWithoutAttributeInput!]
  connect: [InputColumnWhereUniqueInput!]
}

input InputColumnCreateOneWithoutJoinsInput {
  create: InputColumnCreateWithoutJoinsInput
  connect: InputColumnWhereUniqueInput
}

input InputColumnCreateWithoutAttributeInput {
  id: ID
  owner: String
  table: String
  column: String
  script: String
  staticValue: String
  joins: JoinCreateManyWithoutInputColumnInput
}

input InputColumnCreateWithoutJoinsInput {
  id: ID
  owner: String
  table: String
  column: String
  script: String
  staticValue: String
  attribute: AttributeCreateOneWithoutInputColumnsInput!
}

"""An edge in a connection."""
type InputColumnEdge {
  """The item at the end of the edge."""
  node: InputColumn!

  """A cursor for use in pagination."""
  cursor: String!
}

enum InputColumnOrderByInput {
  id_ASC
  id_DESC
  owner_ASC
  owner_DESC
  table_ASC
  table_DESC
  column_ASC
  column_DESC
  script_ASC
  script_DESC
  staticValue_ASC
  staticValue_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type InputColumnPreviousValues {
  id: ID!
  owner: String
  table: String
  column: String
  script: String
  staticValue: String
  updatedAt: DateTime!
  createdAt: DateTime!
}

input InputColumnScalarWhereInput {
  """Logical AND on all given filters."""
  AND: [InputColumnScalarWhereInput!]

  """Logical OR on all given filters."""
  OR: [InputColumnScalarWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [InputColumnScalarWhereInput!]
  id: ID

  """All values that are not equal to given value."""
  id_not: ID

  """All values that are contained in given list."""
  id_in: [ID!]

  """All values that are not contained in given list."""
  id_not_in: [ID!]

  """All values less than the given value."""
  id_lt: ID

  """All values less than or equal the given value."""
  id_lte: ID

  """All values greater than the given value."""
  id_gt: ID

  """All values greater than or equal the given value."""
  id_gte: ID

  """All values containing the given string."""
  id_contains: ID

  """All values not containing the given string."""
  id_not_contains: ID

  """All values starting with the given string."""
  id_starts_with: ID

  """All values not starting with the given string."""
  id_not_starts_with: ID

  """All values ending with the given string."""
  id_ends_with: ID

  """All values not ending with the given string."""
  id_not_ends_with: ID
  owner: String

  """All values that are not equal to given value."""
  owner_not: String

  """All values that are contained in given list."""
  owner_in: [String!]

  """All values that are not contained in given list."""
  owner_not_in: [String!]

  """All values less than the given value."""
  owner_lt: String

  """All values less than or equal the given value."""
  owner_lte: String

  """All values greater than the given value."""
  owner_gt: String

  """All values greater than or equal the given value."""
  owner_gte: String

  """All values containing the given string."""
  owner_contains: String

  """All values not containing the given string."""
  owner_not_contains: String

  """All values starting with the given string."""
  owner_starts_with: String

  """All values not starting with the given string."""
  owner_not_starts_with: String

  """All values ending with the given string."""
  owner_ends_with: String

  """All values not ending with the given string."""
  owner_not_ends_with: String
  table: String

  """All values that are not equal to given value."""
  table_not: String

  """All values that are contained in given list."""
  table_in: [String!]

  """All values that are not contained in given list."""
  table_not_in: [String!]

  """All values less than the given value."""
  table_lt: String

  """All values less than or equal the given value."""
  table_lte: String

  """All values greater than the given value."""
  table_gt: String

  """All values greater than or equal the given value."""
  table_gte: String

  """All values containing the given string."""
  table_contains: String

  """All values not containing the given string."""
  table_not_contains: String

  """All values starting with the given string."""
  table_starts_with: String

  """All values not starting with the given string."""
  table_not_starts_with: String

  """All values ending with the given string."""
  table_ends_with: String

  """All values not ending with the given string."""
  table_not_ends_with: String
  column: String

  """All values that are not equal to given value."""
  column_not: String

  """All values that are contained in given list."""
  column_in: [String!]

  """All values that are not contained in given list."""
  column_not_in: [String!]

  """All values less than the given value."""
  column_lt: String

  """All values less than or equal the given value."""
  column_lte: String

  """All values greater than the given value."""
  column_gt: String

  """All values greater than or equal the given value."""
  column_gte: String

  """All values containing the given string."""
  column_contains: String

  """All values not containing the given string."""
  column_not_contains: String

  """All values starting with the given string."""
  column_starts_with: String

  """All values not starting with the given string."""
  column_not_starts_with: String

  """All values ending with the given string."""
  column_ends_with: String

  """All values not ending with the given string."""
  column_not_ends_with: String
  script: String

  """All values that are not equal to given value."""
  script_not: String

  """All values that are contained in given list."""
  script_in: [String!]

  """All values that are not contained in given list."""
  script_not_in: [String!]

  """All values less than the given value."""
  script_lt: String

  """All values less than or equal the given value."""
  script_lte: String

  """All values greater than the given value."""
  script_gt: String

  """All values greater than or equal the given value."""
  script_gte: String

  """All values containing the given string."""
  script_contains: String

  """All values not containing the given string."""
  script_not_contains: String

  """All values starting with the given string."""
  script_starts_with: String

  """All values not starting with the given string."""
  script_not_starts_with: String

  """All values ending with the given string."""
  script_ends_with: String

  """All values not ending with the given string."""
  script_not_ends_with: String
  staticValue: String

  """All values that are not equal to given value."""
  staticValue_not: String

  """All values that are contained in given list."""
  staticValue_in: [String!]

  """All values that are not contained in given list."""
  staticValue_not_in: [String!]

  """All values less than the given value."""
  staticValue_lt: String

  """All values less than or equal the given value."""
  staticValue_lte: String

  """All values greater than the given value."""
  staticValue_gt: String

  """All values greater than or equal the given value."""
  staticValue_gte: String

  """All values containing the given string."""
  staticValue_contains: String

  """All values not containing the given string."""
  staticValue_not_contains: String

  """All values starting with the given string."""
  staticValue_starts_with: String

  """All values not starting with the given string."""
  staticValue_not_starts_with: String

  """All values ending with the given string."""
  staticValue_ends_with: String

  """All values not ending with the given string."""
  staticValue_not_ends_with: String
  updatedAt: DateTime

  """All values that are not equal to given value."""
  updatedAt_not: DateTime

  """All values that are contained in given list."""
  updatedAt_in: [DateTime!]

  """All values that are not contained in given list."""
  updatedAt_not_in: [DateTime!]

  """All values less than the given value."""
  updatedAt_lt: DateTime

  """All values less than or equal the given value."""
  updatedAt_lte: DateTime

  """All values greater than the given value."""
  updatedAt_gt: DateTime

  """All values greater than or equal the given value."""
  updatedAt_gte: DateTime
  createdAt: DateTime

  """All values that are not equal to given value."""
  createdAt_not: DateTime

  """All values that are contained in given list."""
  createdAt_in: [DateTime!]

  """All values that are not contained in given list."""
  createdAt_not_in: [DateTime!]

  """All values less than the given value."""
  createdAt_lt: DateTime

  """All values less than or equal the given value."""
  createdAt_lte: DateTime

  """All values greater than the given value."""
  createdAt_gt: DateTime

  """All values greater than or equal the given value."""
  createdAt_gte: DateTime
}

type InputColumnSubscriptionPayload {
  mutation: MutationType!
  node: InputColumn
  updatedFields: [String!]
  previousValues: InputColumnPreviousValues
}

input InputColumnSubscriptionWhereInput {
  """Logical AND on all given filters."""
  AND: [InputColumnSubscriptionWhereInput!]

  """Logical OR on all given filters."""
  OR: [InputColumnSubscriptionWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [InputColumnSubscriptionWhereInput!]

  """The subscription event gets dispatched when it's listed in mutation_in"""
  mutation_in: [MutationType!]

  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String

  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]

  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: InputColumnWhereInput
}

input InputColumnUpdateInput {
  owner: String
  table: String
  column: String
  script: String
  staticValue: String
  joins: JoinUpdateManyWithoutInputColumnInput
  attribute: AttributeUpdateOneRequiredWithoutInputColumnsInput
}

input InputColumnUpdateManyDataInput {
  owner: String
  table: String
  column: String
  script: String
  staticValue: String
}

input InputColumnUpdateManyMutationInput {
  owner: String
  table: String
  column: String
  script: String
  staticValue: String
}

input InputColumnUpdateManyWithoutAttributeInput {
  create: [InputColumnCreateWithoutAttributeInput!]
  connect: [InputColumnWhereUniqueInput!]
  set: [InputColumnWhereUniqueInput!]
  disconnect: [InputColumnWhereUniqueInput!]
  delete: [InputColumnWhereUniqueInput!]
  update: [InputColumnUpdateWithWhereUniqueWithoutAttributeInput!]
  updateMany: [InputColumnUpdateManyWithWhereNestedInput!]
  deleteMany: [InputColumnScalarWhereInput!]
  upsert: [InputColumnUpsertWithWhereUniqueWithoutAttributeInput!]
}

input InputColumnUpdateManyWithWhereNestedInput {
  where: InputColumnScalarWhereInput!
  data: InputColumnUpdateManyDataInput!
}

input InputColumnUpdateOneRequiredWithoutJoinsInput {
  create: InputColumnCreateWithoutJoinsInput
  connect: InputColumnWhereUniqueInput
  update: InputColumnUpdateWithoutJoinsDataInput
  upsert: InputColumnUpsertWithoutJoinsInput
}

input InputColumnUpdateWithoutAttributeDataInput {
  owner: String
  table: String
  column: String
  script: String
  staticValue: String
  joins: JoinUpdateManyWithoutInputColumnInput
}

input InputColumnUpdateWithoutJoinsDataInput {
  owner: String
  table: String
  column: String
  script: String
  staticValue: String
  attribute: AttributeUpdateOneRequiredWithoutInputColumnsInput
}

input InputColumnUpdateWithWhereUniqueWithoutAttributeInput {
  where: InputColumnWhereUniqueInput!
  data: InputColumnUpdateWithoutAttributeDataInput!
}

input InputColumnUpsertWithoutJoinsInput {
  update: InputColumnUpdateWithoutJoinsDataInput!
  create: InputColumnCreateWithoutJoinsInput!
}

input InputColumnUpsertWithWhereUniqueWithoutAttributeInput {
  where: InputColumnWhereUniqueInput!
  update: InputColumnUpdateWithoutAttributeDataInput!
  create: InputColumnCreateWithoutAttributeInput!
}

input InputColumnWhereInput {
  """Logical AND on all given filters."""
  AND: [InputColumnWhereInput!]

  """Logical OR on all given filters."""
  OR: [InputColumnWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [InputColumnWhereInput!]
  id: ID

  """All values that are not equal to given value."""
  id_not: ID

  """All values that are contained in given list."""
  id_in: [ID!]

  """All values that are not contained in given list."""
  id_not_in: [ID!]

  """All values less than the given value."""
  id_lt: ID

  """All values less than or equal the given value."""
  id_lte: ID

  """All values greater than the given value."""
  id_gt: ID

  """All values greater than or equal the given value."""
  id_gte: ID

  """All values containing the given string."""
  id_contains: ID

  """All values not containing the given string."""
  id_not_contains: ID

  """All values starting with the given string."""
  id_starts_with: ID

  """All values not starting with the given string."""
  id_not_starts_with: ID

  """All values ending with the given string."""
  id_ends_with: ID

  """All values not ending with the given string."""
  id_not_ends_with: ID
  owner: String

  """All values that are not equal to given value."""
  owner_not: String

  """All values that are contained in given list."""
  owner_in: [String!]

  """All values that are not contained in given list."""
  owner_not_in: [String!]

  """All values less than the given value."""
  owner_lt: String

  """All values less than or equal the given value."""
  owner_lte: String

  """All values greater than the given value."""
  owner_gt: String

  """All values greater than or equal the given value."""
  owner_gte: String

  """All values containing the given string."""
  owner_contains: String

  """All values not containing the given string."""
  owner_not_contains: String

  """All values starting with the given string."""
  owner_starts_with: String

  """All values not starting with the given string."""
  owner_not_starts_with: String

  """All values ending with the given string."""
  owner_ends_with: String

  """All values not ending with the given string."""
  owner_not_ends_with: String
  table: String

  """All values that are not equal to given value."""
  table_not: String

  """All values that are contained in given list."""
  table_in: [String!]

  """All values that are not contained in given list."""
  table_not_in: [String!]

  """All values less than the given value."""
  table_lt: String

  """All values less than or equal the given value."""
  table_lte: String

  """All values greater than the given value."""
  table_gt: String

  """All values greater than or equal the given value."""
  table_gte: String

  """All values containing the given string."""
  table_contains: String

  """All values not containing the given string."""
  table_not_contains: String

  """All values starting with the given string."""
  table_starts_with: String

  """All values not starting with the given string."""
  table_not_starts_with: String

  """All values ending with the given string."""
  table_ends_with: String

  """All values not ending with the given string."""
  table_not_ends_with: String
  column: String

  """All values that are not equal to given value."""
  column_not: String

  """All values that are contained in given list."""
  column_in: [String!]

  """All values that are not contained in given list."""
  column_not_in: [String!]

  """All values less than the given value."""
  column_lt: String

  """All values less than or equal the given value."""
  column_lte: String

  """All values greater than the given value."""
  column_gt: String

  """All values greater than or equal the given value."""
  column_gte: String

  """All values containing the given string."""
  column_contains: String

  """All values not containing the given string."""
  column_not_contains: String

  """All values starting with the given string."""
  column_starts_with: String

  """All values not starting with the given string."""
  column_not_starts_with: String

  """All values ending with the given string."""
  column_ends_with: String

  """All values not ending with the given string."""
  column_not_ends_with: String
  script: String

  """All values that are not equal to given value."""
  script_not: String

  """All values that are contained in given list."""
  script_in: [String!]

  """All values that are not contained in given list."""
  script_not_in: [String!]

  """All values less than the given value."""
  script_lt: String

  """All values less than or equal the given value."""
  script_lte: String

  """All values greater than the given value."""
  script_gt: String

  """All values greater than or equal the given value."""
  script_gte: String

  """All values containing the given string."""
  script_contains: String

  """All values not containing the given string."""
  script_not_contains: String

  """All values starting with the given string."""
  script_starts_with: String

  """All values not starting with the given string."""
  script_not_starts_with: String

  """All values ending with the given string."""
  script_ends_with: String

  """All values not ending with the given string."""
  script_not_ends_with: String
  staticValue: String

  """All values that are not equal to given value."""
  staticValue_not: String

  """All values that are contained in given list."""
  staticValue_in: [String!]

  """All values that are not contained in given list."""
  staticValue_not_in: [String!]

  """All values less than the given value."""
  staticValue_lt: String

  """All values less than or equal the given value."""
  staticValue_lte: String

  """All values greater than the given value."""
  staticValue_gt: String

  """All values greater than or equal the given value."""
  staticValue_gte: String

  """All values containing the given string."""
  staticValue_contains: String

  """All values not containing the given string."""
  staticValue_not_contains: String

  """All values starting with the given string."""
  staticValue_starts_with: String

  """All values not starting with the given string."""
  staticValue_not_starts_with: String

  """All values ending with the given string."""
  staticValue_ends_with: String

  """All values not ending with the given string."""
  staticValue_not_ends_with: String
  updatedAt: DateTime

  """All values that are not equal to given value."""
  updatedAt_not: DateTime

  """All values that are contained in given list."""
  updatedAt_in: [DateTime!]

  """All values that are not contained in given list."""
  updatedAt_not_in: [DateTime!]

  """All values less than the given value."""
  updatedAt_lt: DateTime

  """All values less than or equal the given value."""
  updatedAt_lte: DateTime

  """All values greater than the given value."""
  updatedAt_gt: DateTime

  """All values greater than or equal the given value."""
  updatedAt_gte: DateTime
  createdAt: DateTime

  """All values that are not equal to given value."""
  createdAt_not: DateTime

  """All values that are contained in given list."""
  createdAt_in: [DateTime!]

  """All values that are not contained in given list."""
  createdAt_not_in: [DateTime!]

  """All values less than the given value."""
  createdAt_lt: DateTime

  """All values less than or equal the given value."""
  createdAt_lte: DateTime

  """All values greater than the given value."""
  createdAt_gt: DateTime

  """All values greater than or equal the given value."""
  createdAt_gte: DateTime
  joins_every: JoinWhereInput
  joins_some: JoinWhereInput
  joins_none: JoinWhereInput
  attribute: AttributeWhereInput
}

input InputColumnWhereUniqueInput {
  id: ID
}

type Join implements Node {
  id: ID!
  sourceOwner: String
  sourceTable: String
  sourceColumn: String
  targetOwner: String
  targetTable: String
  targetColumn: String
  inputColumn: InputColumn!
  updatedAt: DateTime!
  createdAt: DateTime!
}

"""A connection to a list of items."""
type JoinConnection {
  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """A list of edges."""
  edges: [JoinEdge]!
  aggregate: AggregateJoin!
}

input JoinCreateInput {
  id: ID
  sourceOwner: String
  sourceTable: String
  sourceColumn: String
  targetOwner: String
  targetTable: String
  targetColumn: String
  inputColumn: InputColumnCreateOneWithoutJoinsInput!
}

input JoinCreateManyWithoutInputColumnInput {
  create: [JoinCreateWithoutInputColumnInput!]
  connect: [JoinWhereUniqueInput!]
}

input JoinCreateWithoutInputColumnInput {
  id: ID
  sourceOwner: String
  sourceTable: String
  sourceColumn: String
  targetOwner: String
  targetTable: String
  targetColumn: String
}

"""An edge in a connection."""
type JoinEdge {
  """The item at the end of the edge."""
  node: Join!

  """A cursor for use in pagination."""
  cursor: String!
}

enum JoinOrderByInput {
  id_ASC
  id_DESC
  sourceOwner_ASC
  sourceOwner_DESC
  sourceTable_ASC
  sourceTable_DESC
  sourceColumn_ASC
  sourceColumn_DESC
  targetOwner_ASC
  targetOwner_DESC
  targetTable_ASC
  targetTable_DESC
  targetColumn_ASC
  targetColumn_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type JoinPreviousValues {
  id: ID!
  sourceOwner: String
  sourceTable: String
  sourceColumn: String
  targetOwner: String
  targetTable: String
  targetColumn: String
  updatedAt: DateTime!
  createdAt: DateTime!
}

input JoinScalarWhereInput {
  """Logical AND on all given filters."""
  AND: [JoinScalarWhereInput!]

  """Logical OR on all given filters."""
  OR: [JoinScalarWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [JoinScalarWhereInput!]
  id: ID

  """All values that are not equal to given value."""
  id_not: ID

  """All values that are contained in given list."""
  id_in: [ID!]

  """All values that are not contained in given list."""
  id_not_in: [ID!]

  """All values less than the given value."""
  id_lt: ID

  """All values less than or equal the given value."""
  id_lte: ID

  """All values greater than the given value."""
  id_gt: ID

  """All values greater than or equal the given value."""
  id_gte: ID

  """All values containing the given string."""
  id_contains: ID

  """All values not containing the given string."""
  id_not_contains: ID

  """All values starting with the given string."""
  id_starts_with: ID

  """All values not starting with the given string."""
  id_not_starts_with: ID

  """All values ending with the given string."""
  id_ends_with: ID

  """All values not ending with the given string."""
  id_not_ends_with: ID
  sourceOwner: String

  """All values that are not equal to given value."""
  sourceOwner_not: String

  """All values that are contained in given list."""
  sourceOwner_in: [String!]

  """All values that are not contained in given list."""
  sourceOwner_not_in: [String!]

  """All values less than the given value."""
  sourceOwner_lt: String

  """All values less than or equal the given value."""
  sourceOwner_lte: String

  """All values greater than the given value."""
  sourceOwner_gt: String

  """All values greater than or equal the given value."""
  sourceOwner_gte: String

  """All values containing the given string."""
  sourceOwner_contains: String

  """All values not containing the given string."""
  sourceOwner_not_contains: String

  """All values starting with the given string."""
  sourceOwner_starts_with: String

  """All values not starting with the given string."""
  sourceOwner_not_starts_with: String

  """All values ending with the given string."""
  sourceOwner_ends_with: String

  """All values not ending with the given string."""
  sourceOwner_not_ends_with: String
  sourceTable: String

  """All values that are not equal to given value."""
  sourceTable_not: String

  """All values that are contained in given list."""
  sourceTable_in: [String!]

  """All values that are not contained in given list."""
  sourceTable_not_in: [String!]

  """All values less than the given value."""
  sourceTable_lt: String

  """All values less than or equal the given value."""
  sourceTable_lte: String

  """All values greater than the given value."""
  sourceTable_gt: String

  """All values greater than or equal the given value."""
  sourceTable_gte: String

  """All values containing the given string."""
  sourceTable_contains: String

  """All values not containing the given string."""
  sourceTable_not_contains: String

  """All values starting with the given string."""
  sourceTable_starts_with: String

  """All values not starting with the given string."""
  sourceTable_not_starts_with: String

  """All values ending with the given string."""
  sourceTable_ends_with: String

  """All values not ending with the given string."""
  sourceTable_not_ends_with: String
  sourceColumn: String

  """All values that are not equal to given value."""
  sourceColumn_not: String

  """All values that are contained in given list."""
  sourceColumn_in: [String!]

  """All values that are not contained in given list."""
  sourceColumn_not_in: [String!]

  """All values less than the given value."""
  sourceColumn_lt: String

  """All values less than or equal the given value."""
  sourceColumn_lte: String

  """All values greater than the given value."""
  sourceColumn_gt: String

  """All values greater than or equal the given value."""
  sourceColumn_gte: String

  """All values containing the given string."""
  sourceColumn_contains: String

  """All values not containing the given string."""
  sourceColumn_not_contains: String

  """All values starting with the given string."""
  sourceColumn_starts_with: String

  """All values not starting with the given string."""
  sourceColumn_not_starts_with: String

  """All values ending with the given string."""
  sourceColumn_ends_with: String

  """All values not ending with the given string."""
  sourceColumn_not_ends_with: String
  targetOwner: String

  """All values that are not equal to given value."""
  targetOwner_not: String

  """All values that are contained in given list."""
  targetOwner_in: [String!]

  """All values that are not contained in given list."""
  targetOwner_not_in: [String!]

  """All values less than the given value."""
  targetOwner_lt: String

  """All values less than or equal the given value."""
  targetOwner_lte: String

  """All values greater than the given value."""
  targetOwner_gt: String

  """All values greater than or equal the given value."""
  targetOwner_gte: String

  """All values containing the given string."""
  targetOwner_contains: String

  """All values not containing the given string."""
  targetOwner_not_contains: String

  """All values starting with the given string."""
  targetOwner_starts_with: String

  """All values not starting with the given string."""
  targetOwner_not_starts_with: String

  """All values ending with the given string."""
  targetOwner_ends_with: String

  """All values not ending with the given string."""
  targetOwner_not_ends_with: String
  targetTable: String

  """All values that are not equal to given value."""
  targetTable_not: String

  """All values that are contained in given list."""
  targetTable_in: [String!]

  """All values that are not contained in given list."""
  targetTable_not_in: [String!]

  """All values less than the given value."""
  targetTable_lt: String

  """All values less than or equal the given value."""
  targetTable_lte: String

  """All values greater than the given value."""
  targetTable_gt: String

  """All values greater than or equal the given value."""
  targetTable_gte: String

  """All values containing the given string."""
  targetTable_contains: String

  """All values not containing the given string."""
  targetTable_not_contains: String

  """All values starting with the given string."""
  targetTable_starts_with: String

  """All values not starting with the given string."""
  targetTable_not_starts_with: String

  """All values ending with the given string."""
  targetTable_ends_with: String

  """All values not ending with the given string."""
  targetTable_not_ends_with: String
  targetColumn: String

  """All values that are not equal to given value."""
  targetColumn_not: String

  """All values that are contained in given list."""
  targetColumn_in: [String!]

  """All values that are not contained in given list."""
  targetColumn_not_in: [String!]

  """All values less than the given value."""
  targetColumn_lt: String

  """All values less than or equal the given value."""
  targetColumn_lte: String

  """All values greater than the given value."""
  targetColumn_gt: String

  """All values greater than or equal the given value."""
  targetColumn_gte: String

  """All values containing the given string."""
  targetColumn_contains: String

  """All values not containing the given string."""
  targetColumn_not_contains: String

  """All values starting with the given string."""
  targetColumn_starts_with: String

  """All values not starting with the given string."""
  targetColumn_not_starts_with: String

  """All values ending with the given string."""
  targetColumn_ends_with: String

  """All values not ending with the given string."""
  targetColumn_not_ends_with: String
  updatedAt: DateTime

  """All values that are not equal to given value."""
  updatedAt_not: DateTime

  """All values that are contained in given list."""
  updatedAt_in: [DateTime!]

  """All values that are not contained in given list."""
  updatedAt_not_in: [DateTime!]

  """All values less than the given value."""
  updatedAt_lt: DateTime

  """All values less than or equal the given value."""
  updatedAt_lte: DateTime

  """All values greater than the given value."""
  updatedAt_gt: DateTime

  """All values greater than or equal the given value."""
  updatedAt_gte: DateTime
  createdAt: DateTime

  """All values that are not equal to given value."""
  createdAt_not: DateTime

  """All values that are contained in given list."""
  createdAt_in: [DateTime!]

  """All values that are not contained in given list."""
  createdAt_not_in: [DateTime!]

  """All values less than the given value."""
  createdAt_lt: DateTime

  """All values less than or equal the given value."""
  createdAt_lte: DateTime

  """All values greater than the given value."""
  createdAt_gt: DateTime

  """All values greater than or equal the given value."""
  createdAt_gte: DateTime
}

type JoinSubscriptionPayload {
  mutation: MutationType!
  node: Join
  updatedFields: [String!]
  previousValues: JoinPreviousValues
}

input JoinSubscriptionWhereInput {
  """Logical AND on all given filters."""
  AND: [JoinSubscriptionWhereInput!]

  """Logical OR on all given filters."""
  OR: [JoinSubscriptionWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [JoinSubscriptionWhereInput!]

  """The subscription event gets dispatched when it's listed in mutation_in"""
  mutation_in: [MutationType!]

  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String

  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]

  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: JoinWhereInput
}

input JoinUpdateInput {
  sourceOwner: String
  sourceTable: String
  sourceColumn: String
  targetOwner: String
  targetTable: String
  targetColumn: String
  inputColumn: InputColumnUpdateOneRequiredWithoutJoinsInput
}

input JoinUpdateManyDataInput {
  sourceOwner: String
  sourceTable: String
  sourceColumn: String
  targetOwner: String
  targetTable: String
  targetColumn: String
}

input JoinUpdateManyMutationInput {
  sourceOwner: String
  sourceTable: String
  sourceColumn: String
  targetOwner: String
  targetTable: String
  targetColumn: String
}

input JoinUpdateManyWithoutInputColumnInput {
  create: [JoinCreateWithoutInputColumnInput!]
  connect: [JoinWhereUniqueInput!]
  set: [JoinWhereUniqueInput!]
  disconnect: [JoinWhereUniqueInput!]
  delete: [JoinWhereUniqueInput!]
  update: [JoinUpdateWithWhereUniqueWithoutInputColumnInput!]
  updateMany: [JoinUpdateManyWithWhereNestedInput!]
  deleteMany: [JoinScalarWhereInput!]
  upsert: [JoinUpsertWithWhereUniqueWithoutInputColumnInput!]
}

input JoinUpdateManyWithWhereNestedInput {
  where: JoinScalarWhereInput!
  data: JoinUpdateManyDataInput!
}

input JoinUpdateWithoutInputColumnDataInput {
  sourceOwner: String
  sourceTable: String
  sourceColumn: String
  targetOwner: String
  targetTable: String
  targetColumn: String
}

input JoinUpdateWithWhereUniqueWithoutInputColumnInput {
  where: JoinWhereUniqueInput!
  data: JoinUpdateWithoutInputColumnDataInput!
}

input JoinUpsertWithWhereUniqueWithoutInputColumnInput {
  where: JoinWhereUniqueInput!
  update: JoinUpdateWithoutInputColumnDataInput!
  create: JoinCreateWithoutInputColumnInput!
}

input JoinWhereInput {
  """Logical AND on all given filters."""
  AND: [JoinWhereInput!]

  """Logical OR on all given filters."""
  OR: [JoinWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [JoinWhereInput!]
  id: ID

  """All values that are not equal to given value."""
  id_not: ID

  """All values that are contained in given list."""
  id_in: [ID!]

  """All values that are not contained in given list."""
  id_not_in: [ID!]

  """All values less than the given value."""
  id_lt: ID

  """All values less than or equal the given value."""
  id_lte: ID

  """All values greater than the given value."""
  id_gt: ID

  """All values greater than or equal the given value."""
  id_gte: ID

  """All values containing the given string."""
  id_contains: ID

  """All values not containing the given string."""
  id_not_contains: ID

  """All values starting with the given string."""
  id_starts_with: ID

  """All values not starting with the given string."""
  id_not_starts_with: ID

  """All values ending with the given string."""
  id_ends_with: ID

  """All values not ending with the given string."""
  id_not_ends_with: ID
  sourceOwner: String

  """All values that are not equal to given value."""
  sourceOwner_not: String

  """All values that are contained in given list."""
  sourceOwner_in: [String!]

  """All values that are not contained in given list."""
  sourceOwner_not_in: [String!]

  """All values less than the given value."""
  sourceOwner_lt: String

  """All values less than or equal the given value."""
  sourceOwner_lte: String

  """All values greater than the given value."""
  sourceOwner_gt: String

  """All values greater than or equal the given value."""
  sourceOwner_gte: String

  """All values containing the given string."""
  sourceOwner_contains: String

  """All values not containing the given string."""
  sourceOwner_not_contains: String

  """All values starting with the given string."""
  sourceOwner_starts_with: String

  """All values not starting with the given string."""
  sourceOwner_not_starts_with: String

  """All values ending with the given string."""
  sourceOwner_ends_with: String

  """All values not ending with the given string."""
  sourceOwner_not_ends_with: String
  sourceTable: String

  """All values that are not equal to given value."""
  sourceTable_not: String

  """All values that are contained in given list."""
  sourceTable_in: [String!]

  """All values that are not contained in given list."""
  sourceTable_not_in: [String!]

  """All values less than the given value."""
  sourceTable_lt: String

  """All values less than or equal the given value."""
  sourceTable_lte: String

  """All values greater than the given value."""
  sourceTable_gt: String

  """All values greater than or equal the given value."""
  sourceTable_gte: String

  """All values containing the given string."""
  sourceTable_contains: String

  """All values not containing the given string."""
  sourceTable_not_contains: String

  """All values starting with the given string."""
  sourceTable_starts_with: String

  """All values not starting with the given string."""
  sourceTable_not_starts_with: String

  """All values ending with the given string."""
  sourceTable_ends_with: String

  """All values not ending with the given string."""
  sourceTable_not_ends_with: String
  sourceColumn: String

  """All values that are not equal to given value."""
  sourceColumn_not: String

  """All values that are contained in given list."""
  sourceColumn_in: [String!]

  """All values that are not contained in given list."""
  sourceColumn_not_in: [String!]

  """All values less than the given value."""
  sourceColumn_lt: String

  """All values less than or equal the given value."""
  sourceColumn_lte: String

  """All values greater than the given value."""
  sourceColumn_gt: String

  """All values greater than or equal the given value."""
  sourceColumn_gte: String

  """All values containing the given string."""
  sourceColumn_contains: String

  """All values not containing the given string."""
  sourceColumn_not_contains: String

  """All values starting with the given string."""
  sourceColumn_starts_with: String

  """All values not starting with the given string."""
  sourceColumn_not_starts_with: String

  """All values ending with the given string."""
  sourceColumn_ends_with: String

  """All values not ending with the given string."""
  sourceColumn_not_ends_with: String
  targetOwner: String

  """All values that are not equal to given value."""
  targetOwner_not: String

  """All values that are contained in given list."""
  targetOwner_in: [String!]

  """All values that are not contained in given list."""
  targetOwner_not_in: [String!]

  """All values less than the given value."""
  targetOwner_lt: String

  """All values less than or equal the given value."""
  targetOwner_lte: String

  """All values greater than the given value."""
  targetOwner_gt: String

  """All values greater than or equal the given value."""
  targetOwner_gte: String

  """All values containing the given string."""
  targetOwner_contains: String

  """All values not containing the given string."""
  targetOwner_not_contains: String

  """All values starting with the given string."""
  targetOwner_starts_with: String

  """All values not starting with the given string."""
  targetOwner_not_starts_with: String

  """All values ending with the given string."""
  targetOwner_ends_with: String

  """All values not ending with the given string."""
  targetOwner_not_ends_with: String
  targetTable: String

  """All values that are not equal to given value."""
  targetTable_not: String

  """All values that are contained in given list."""
  targetTable_in: [String!]

  """All values that are not contained in given list."""
  targetTable_not_in: [String!]

  """All values less than the given value."""
  targetTable_lt: String

  """All values less than or equal the given value."""
  targetTable_lte: String

  """All values greater than the given value."""
  targetTable_gt: String

  """All values greater than or equal the given value."""
  targetTable_gte: String

  """All values containing the given string."""
  targetTable_contains: String

  """All values not containing the given string."""
  targetTable_not_contains: String

  """All values starting with the given string."""
  targetTable_starts_with: String

  """All values not starting with the given string."""
  targetTable_not_starts_with: String

  """All values ending with the given string."""
  targetTable_ends_with: String

  """All values not ending with the given string."""
  targetTable_not_ends_with: String
  targetColumn: String

  """All values that are not equal to given value."""
  targetColumn_not: String

  """All values that are contained in given list."""
  targetColumn_in: [String!]

  """All values that are not contained in given list."""
  targetColumn_not_in: [String!]

  """All values less than the given value."""
  targetColumn_lt: String

  """All values less than or equal the given value."""
  targetColumn_lte: String

  """All values greater than the given value."""
  targetColumn_gt: String

  """All values greater than or equal the given value."""
  targetColumn_gte: String

  """All values containing the given string."""
  targetColumn_contains: String

  """All values not containing the given string."""
  targetColumn_not_contains: String

  """All values starting with the given string."""
  targetColumn_starts_with: String

  """All values not starting with the given string."""
  targetColumn_not_starts_with: String

  """All values ending with the given string."""
  targetColumn_ends_with: String

  """All values not ending with the given string."""
  targetColumn_not_ends_with: String
  updatedAt: DateTime

  """All values that are not equal to given value."""
  updatedAt_not: DateTime

  """All values that are contained in given list."""
  updatedAt_in: [DateTime!]

  """All values that are not contained in given list."""
  updatedAt_not_in: [DateTime!]

  """All values less than the given value."""
  updatedAt_lt: DateTime

  """All values less than or equal the given value."""
  updatedAt_lte: DateTime

  """All values greater than the given value."""
  updatedAt_gt: DateTime

  """All values greater than or equal the given value."""
  updatedAt_gte: DateTime
  createdAt: DateTime

  """All values that are not equal to given value."""
  createdAt_not: DateTime

  """All values that are contained in given list."""
  createdAt_in: [DateTime!]

  """All values that are not contained in given list."""
  createdAt_not_in: [DateTime!]

  """All values less than the given value."""
  createdAt_lt: DateTime

  """All values less than or equal the given value."""
  createdAt_lte: DateTime

  """All values greater than the given value."""
  createdAt_gt: DateTime

  """All values greater than or equal the given value."""
  createdAt_gte: DateTime
  inputColumn: InputColumnWhereInput
}

input JoinWhereUniqueInput {
  id: ID
}

"""
The \`Long\` scalar type represents non-fractional signed whole numeric values.
Long can represent values between -(2^63) and 2^63 - 1.
"""
scalar Long

type Mutation {
  createSource(data: SourceCreateInput!): Source!
  createResource(data: ResourceCreateInput!): Resource!
  createAttribute(data: AttributeCreateInput!): Attribute!
  createInputColumn(data: InputColumnCreateInput!): InputColumn!
  createJoin(data: JoinCreateInput!): Join!
  createUser(data: UserCreateInput!): User!
  createCredential(data: CredentialCreateInput!): Credential!
  updateSource(data: SourceUpdateInput!, where: SourceWhereUniqueInput!): Source
  updateResource(data: ResourceUpdateInput!, where: ResourceWhereUniqueInput!): Resource
  updateAttribute(data: AttributeUpdateInput!, where: AttributeWhereUniqueInput!): Attribute
  updateInputColumn(data: InputColumnUpdateInput!, where: InputColumnWhereUniqueInput!): InputColumn
  updateJoin(data: JoinUpdateInput!, where: JoinWhereUniqueInput!): Join
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateCredential(data: CredentialUpdateInput!, where: CredentialWhereUniqueInput!): Credential
  deleteSource(where: SourceWhereUniqueInput!): Source
  deleteResource(where: ResourceWhereUniqueInput!): Resource
  deleteAttribute(where: AttributeWhereUniqueInput!): Attribute
  deleteInputColumn(where: InputColumnWhereUniqueInput!): InputColumn
  deleteJoin(where: JoinWhereUniqueInput!): Join
  deleteUser(where: UserWhereUniqueInput!): User
  deleteCredential(where: CredentialWhereUniqueInput!): Credential
  upsertSource(where: SourceWhereUniqueInput!, create: SourceCreateInput!, update: SourceUpdateInput!): Source!
  upsertResource(where: ResourceWhereUniqueInput!, create: ResourceCreateInput!, update: ResourceUpdateInput!): Resource!
  upsertAttribute(where: AttributeWhereUniqueInput!, create: AttributeCreateInput!, update: AttributeUpdateInput!): Attribute!
  upsertInputColumn(where: InputColumnWhereUniqueInput!, create: InputColumnCreateInput!, update: InputColumnUpdateInput!): InputColumn!
  upsertJoin(where: JoinWhereUniqueInput!, create: JoinCreateInput!, update: JoinUpdateInput!): Join!
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  upsertCredential(where: CredentialWhereUniqueInput!, create: CredentialCreateInput!, update: CredentialUpdateInput!): Credential!
  updateManySources(data: SourceUpdateManyMutationInput!, where: SourceWhereInput): BatchPayload!
  updateManyResources(data: ResourceUpdateManyMutationInput!, where: ResourceWhereInput): BatchPayload!
  updateManyAttributes(data: AttributeUpdateManyMutationInput!, where: AttributeWhereInput): BatchPayload!
  updateManyInputColumns(data: InputColumnUpdateManyMutationInput!, where: InputColumnWhereInput): BatchPayload!
  updateManyJoins(data: JoinUpdateManyMutationInput!, where: JoinWhereInput): BatchPayload!
  updateManyUsers(data: UserUpdateManyMutationInput!, where: UserWhereInput): BatchPayload!
  updateManyCredentials(data: CredentialUpdateManyMutationInput!, where: CredentialWhereInput): BatchPayload!
  deleteManySources(where: SourceWhereInput): BatchPayload!
  deleteManyResources(where: ResourceWhereInput): BatchPayload!
  deleteManyAttributes(where: AttributeWhereInput): BatchPayload!
  deleteManyInputColumns(where: InputColumnWhereInput): BatchPayload!
  deleteManyJoins(where: JoinWhereInput): BatchPayload!
  deleteManyUsers(where: UserWhereInput): BatchPayload!
  deleteManyCredentials(where: CredentialWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

"""An object with an ID"""
interface Node {
  """The id of the object."""
  id: ID!
}

"""Information about pagination in a connection."""
type PageInfo {
  """When paginating forwards, are there more items?"""
  hasNextPage: Boolean!

  """When paginating backwards, are there more items?"""
  hasPreviousPage: Boolean!

  """When paginating backwards, the cursor to continue."""
  startCursor: String

  """When paginating forwards, the cursor to continue."""
  endCursor: String
}

type Query {
  sources(where: SourceWhereInput, orderBy: SourceOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Source]!
  resources(where: ResourceWhereInput, orderBy: ResourceOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Resource]!
  attributes(where: AttributeWhereInput, orderBy: AttributeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Attribute]!
  inputColumns(where: InputColumnWhereInput, orderBy: InputColumnOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [InputColumn]!
  joins(where: JoinWhereInput, orderBy: JoinOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Join]!
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  credentials(where: CredentialWhereInput, orderBy: CredentialOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Credential]!
  source(where: SourceWhereUniqueInput!): Source
  resource(where: ResourceWhereUniqueInput!): Resource
  attribute(where: AttributeWhereUniqueInput!): Attribute
  inputColumn(where: InputColumnWhereUniqueInput!): InputColumn
  join(where: JoinWhereUniqueInput!): Join
  user(where: UserWhereUniqueInput!): User
  credential(where: CredentialWhereUniqueInput!): Credential
  sourcesConnection(where: SourceWhereInput, orderBy: SourceOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): SourceConnection!
  resourcesConnection(where: ResourceWhereInput, orderBy: ResourceOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ResourceConnection!
  attributesConnection(where: AttributeWhereInput, orderBy: AttributeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): AttributeConnection!
  inputColumnsConnection(where: InputColumnWhereInput, orderBy: InputColumnOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): InputColumnConnection!
  joinsConnection(where: JoinWhereInput, orderBy: JoinOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): JoinConnection!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  credentialsConnection(where: CredentialWhereInput, orderBy: CredentialOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): CredentialConnection!

  """Fetches an object given its ID"""
  node(
    """The ID of an object"""
    id: ID!
  ): Node
}

type Resource implements Node {
  id: ID!
  label: String
  fhirType: String!
  primaryKeyOwner: String
  primaryKeyTable: String
  primaryKeyColumn: String
  attributes(where: AttributeWhereInput, orderBy: AttributeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Attribute!]
  source: Source!
  updatedAt: DateTime!
  createdAt: DateTime!
}

"""A connection to a list of items."""
type ResourceConnection {
  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """A list of edges."""
  edges: [ResourceEdge]!
  aggregate: AggregateResource!
}

input ResourceCreateInput {
  id: ID
  label: String
  fhirType: String!
  primaryKeyOwner: String
  primaryKeyTable: String
  primaryKeyColumn: String
  attributes: AttributeCreateManyWithoutResourceInput
  source: SourceCreateOneWithoutResourcesInput!
}

input ResourceCreateManyWithoutSourceInput {
  create: [ResourceCreateWithoutSourceInput!]
  connect: [ResourceWhereUniqueInput!]
}

input ResourceCreateOneWithoutAttributesInput {
  create: ResourceCreateWithoutAttributesInput
  connect: ResourceWhereUniqueInput
}

input ResourceCreateWithoutAttributesInput {
  id: ID
  label: String
  fhirType: String!
  primaryKeyOwner: String
  primaryKeyTable: String
  primaryKeyColumn: String
  source: SourceCreateOneWithoutResourcesInput!
}

input ResourceCreateWithoutSourceInput {
  id: ID
  label: String
  fhirType: String!
  primaryKeyOwner: String
  primaryKeyTable: String
  primaryKeyColumn: String
  attributes: AttributeCreateManyWithoutResourceInput
}

"""An edge in a connection."""
type ResourceEdge {
  """The item at the end of the edge."""
  node: Resource!

  """A cursor for use in pagination."""
  cursor: String!
}

enum ResourceOrderByInput {
  id_ASC
  id_DESC
  label_ASC
  label_DESC
  fhirType_ASC
  fhirType_DESC
  primaryKeyOwner_ASC
  primaryKeyOwner_DESC
  primaryKeyTable_ASC
  primaryKeyTable_DESC
  primaryKeyColumn_ASC
  primaryKeyColumn_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type ResourcePreviousValues {
  id: ID!
  label: String
  fhirType: String!
  primaryKeyOwner: String
  primaryKeyTable: String
  primaryKeyColumn: String
  updatedAt: DateTime!
  createdAt: DateTime!
}

input ResourceScalarWhereInput {
  """Logical AND on all given filters."""
  AND: [ResourceScalarWhereInput!]

  """Logical OR on all given filters."""
  OR: [ResourceScalarWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [ResourceScalarWhereInput!]
  id: ID

  """All values that are not equal to given value."""
  id_not: ID

  """All values that are contained in given list."""
  id_in: [ID!]

  """All values that are not contained in given list."""
  id_not_in: [ID!]

  """All values less than the given value."""
  id_lt: ID

  """All values less than or equal the given value."""
  id_lte: ID

  """All values greater than the given value."""
  id_gt: ID

  """All values greater than or equal the given value."""
  id_gte: ID

  """All values containing the given string."""
  id_contains: ID

  """All values not containing the given string."""
  id_not_contains: ID

  """All values starting with the given string."""
  id_starts_with: ID

  """All values not starting with the given string."""
  id_not_starts_with: ID

  """All values ending with the given string."""
  id_ends_with: ID

  """All values not ending with the given string."""
  id_not_ends_with: ID
  label: String

  """All values that are not equal to given value."""
  label_not: String

  """All values that are contained in given list."""
  label_in: [String!]

  """All values that are not contained in given list."""
  label_not_in: [String!]

  """All values less than the given value."""
  label_lt: String

  """All values less than or equal the given value."""
  label_lte: String

  """All values greater than the given value."""
  label_gt: String

  """All values greater than or equal the given value."""
  label_gte: String

  """All values containing the given string."""
  label_contains: String

  """All values not containing the given string."""
  label_not_contains: String

  """All values starting with the given string."""
  label_starts_with: String

  """All values not starting with the given string."""
  label_not_starts_with: String

  """All values ending with the given string."""
  label_ends_with: String

  """All values not ending with the given string."""
  label_not_ends_with: String
  fhirType: String

  """All values that are not equal to given value."""
  fhirType_not: String

  """All values that are contained in given list."""
  fhirType_in: [String!]

  """All values that are not contained in given list."""
  fhirType_not_in: [String!]

  """All values less than the given value."""
  fhirType_lt: String

  """All values less than or equal the given value."""
  fhirType_lte: String

  """All values greater than the given value."""
  fhirType_gt: String

  """All values greater than or equal the given value."""
  fhirType_gte: String

  """All values containing the given string."""
  fhirType_contains: String

  """All values not containing the given string."""
  fhirType_not_contains: String

  """All values starting with the given string."""
  fhirType_starts_with: String

  """All values not starting with the given string."""
  fhirType_not_starts_with: String

  """All values ending with the given string."""
  fhirType_ends_with: String

  """All values not ending with the given string."""
  fhirType_not_ends_with: String
  primaryKeyOwner: String

  """All values that are not equal to given value."""
  primaryKeyOwner_not: String

  """All values that are contained in given list."""
  primaryKeyOwner_in: [String!]

  """All values that are not contained in given list."""
  primaryKeyOwner_not_in: [String!]

  """All values less than the given value."""
  primaryKeyOwner_lt: String

  """All values less than or equal the given value."""
  primaryKeyOwner_lte: String

  """All values greater than the given value."""
  primaryKeyOwner_gt: String

  """All values greater than or equal the given value."""
  primaryKeyOwner_gte: String

  """All values containing the given string."""
  primaryKeyOwner_contains: String

  """All values not containing the given string."""
  primaryKeyOwner_not_contains: String

  """All values starting with the given string."""
  primaryKeyOwner_starts_with: String

  """All values not starting with the given string."""
  primaryKeyOwner_not_starts_with: String

  """All values ending with the given string."""
  primaryKeyOwner_ends_with: String

  """All values not ending with the given string."""
  primaryKeyOwner_not_ends_with: String
  primaryKeyTable: String

  """All values that are not equal to given value."""
  primaryKeyTable_not: String

  """All values that are contained in given list."""
  primaryKeyTable_in: [String!]

  """All values that are not contained in given list."""
  primaryKeyTable_not_in: [String!]

  """All values less than the given value."""
  primaryKeyTable_lt: String

  """All values less than or equal the given value."""
  primaryKeyTable_lte: String

  """All values greater than the given value."""
  primaryKeyTable_gt: String

  """All values greater than or equal the given value."""
  primaryKeyTable_gte: String

  """All values containing the given string."""
  primaryKeyTable_contains: String

  """All values not containing the given string."""
  primaryKeyTable_not_contains: String

  """All values starting with the given string."""
  primaryKeyTable_starts_with: String

  """All values not starting with the given string."""
  primaryKeyTable_not_starts_with: String

  """All values ending with the given string."""
  primaryKeyTable_ends_with: String

  """All values not ending with the given string."""
  primaryKeyTable_not_ends_with: String
  primaryKeyColumn: String

  """All values that are not equal to given value."""
  primaryKeyColumn_not: String

  """All values that are contained in given list."""
  primaryKeyColumn_in: [String!]

  """All values that are not contained in given list."""
  primaryKeyColumn_not_in: [String!]

  """All values less than the given value."""
  primaryKeyColumn_lt: String

  """All values less than or equal the given value."""
  primaryKeyColumn_lte: String

  """All values greater than the given value."""
  primaryKeyColumn_gt: String

  """All values greater than or equal the given value."""
  primaryKeyColumn_gte: String

  """All values containing the given string."""
  primaryKeyColumn_contains: String

  """All values not containing the given string."""
  primaryKeyColumn_not_contains: String

  """All values starting with the given string."""
  primaryKeyColumn_starts_with: String

  """All values not starting with the given string."""
  primaryKeyColumn_not_starts_with: String

  """All values ending with the given string."""
  primaryKeyColumn_ends_with: String

  """All values not ending with the given string."""
  primaryKeyColumn_not_ends_with: String
  updatedAt: DateTime

  """All values that are not equal to given value."""
  updatedAt_not: DateTime

  """All values that are contained in given list."""
  updatedAt_in: [DateTime!]

  """All values that are not contained in given list."""
  updatedAt_not_in: [DateTime!]

  """All values less than the given value."""
  updatedAt_lt: DateTime

  """All values less than or equal the given value."""
  updatedAt_lte: DateTime

  """All values greater than the given value."""
  updatedAt_gt: DateTime

  """All values greater than or equal the given value."""
  updatedAt_gte: DateTime
  createdAt: DateTime

  """All values that are not equal to given value."""
  createdAt_not: DateTime

  """All values that are contained in given list."""
  createdAt_in: [DateTime!]

  """All values that are not contained in given list."""
  createdAt_not_in: [DateTime!]

  """All values less than the given value."""
  createdAt_lt: DateTime

  """All values less than or equal the given value."""
  createdAt_lte: DateTime

  """All values greater than the given value."""
  createdAt_gt: DateTime

  """All values greater than or equal the given value."""
  createdAt_gte: DateTime
}

type ResourceSubscriptionPayload {
  mutation: MutationType!
  node: Resource
  updatedFields: [String!]
  previousValues: ResourcePreviousValues
}

input ResourceSubscriptionWhereInput {
  """Logical AND on all given filters."""
  AND: [ResourceSubscriptionWhereInput!]

  """Logical OR on all given filters."""
  OR: [ResourceSubscriptionWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [ResourceSubscriptionWhereInput!]

  """The subscription event gets dispatched when it's listed in mutation_in"""
  mutation_in: [MutationType!]

  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String

  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]

  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: ResourceWhereInput
}

input ResourceUpdateInput {
  label: String
  fhirType: String
  primaryKeyOwner: String
  primaryKeyTable: String
  primaryKeyColumn: String
  attributes: AttributeUpdateManyWithoutResourceInput
  source: SourceUpdateOneRequiredWithoutResourcesInput
}

input ResourceUpdateManyDataInput {
  label: String
  fhirType: String
  primaryKeyOwner: String
  primaryKeyTable: String
  primaryKeyColumn: String
}

input ResourceUpdateManyMutationInput {
  label: String
  fhirType: String
  primaryKeyOwner: String
  primaryKeyTable: String
  primaryKeyColumn: String
}

input ResourceUpdateManyWithoutSourceInput {
  create: [ResourceCreateWithoutSourceInput!]
  connect: [ResourceWhereUniqueInput!]
  set: [ResourceWhereUniqueInput!]
  disconnect: [ResourceWhereUniqueInput!]
  delete: [ResourceWhereUniqueInput!]
  update: [ResourceUpdateWithWhereUniqueWithoutSourceInput!]
  updateMany: [ResourceUpdateManyWithWhereNestedInput!]
  deleteMany: [ResourceScalarWhereInput!]
  upsert: [ResourceUpsertWithWhereUniqueWithoutSourceInput!]
}

input ResourceUpdateManyWithWhereNestedInput {
  where: ResourceScalarWhereInput!
  data: ResourceUpdateManyDataInput!
}

input ResourceUpdateOneWithoutAttributesInput {
  create: ResourceCreateWithoutAttributesInput
  connect: ResourceWhereUniqueInput
  disconnect: Boolean
  delete: Boolean
  update: ResourceUpdateWithoutAttributesDataInput
  upsert: ResourceUpsertWithoutAttributesInput
}

input ResourceUpdateWithoutAttributesDataInput {
  label: String
  fhirType: String
  primaryKeyOwner: String
  primaryKeyTable: String
  primaryKeyColumn: String
  source: SourceUpdateOneRequiredWithoutResourcesInput
}

input ResourceUpdateWithoutSourceDataInput {
  label: String
  fhirType: String
  primaryKeyOwner: String
  primaryKeyTable: String
  primaryKeyColumn: String
  attributes: AttributeUpdateManyWithoutResourceInput
}

input ResourceUpdateWithWhereUniqueWithoutSourceInput {
  where: ResourceWhereUniqueInput!
  data: ResourceUpdateWithoutSourceDataInput!
}

input ResourceUpsertWithoutAttributesInput {
  update: ResourceUpdateWithoutAttributesDataInput!
  create: ResourceCreateWithoutAttributesInput!
}

input ResourceUpsertWithWhereUniqueWithoutSourceInput {
  where: ResourceWhereUniqueInput!
  update: ResourceUpdateWithoutSourceDataInput!
  create: ResourceCreateWithoutSourceInput!
}

input ResourceWhereInput {
  """Logical AND on all given filters."""
  AND: [ResourceWhereInput!]

  """Logical OR on all given filters."""
  OR: [ResourceWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [ResourceWhereInput!]
  id: ID

  """All values that are not equal to given value."""
  id_not: ID

  """All values that are contained in given list."""
  id_in: [ID!]

  """All values that are not contained in given list."""
  id_not_in: [ID!]

  """All values less than the given value."""
  id_lt: ID

  """All values less than or equal the given value."""
  id_lte: ID

  """All values greater than the given value."""
  id_gt: ID

  """All values greater than or equal the given value."""
  id_gte: ID

  """All values containing the given string."""
  id_contains: ID

  """All values not containing the given string."""
  id_not_contains: ID

  """All values starting with the given string."""
  id_starts_with: ID

  """All values not starting with the given string."""
  id_not_starts_with: ID

  """All values ending with the given string."""
  id_ends_with: ID

  """All values not ending with the given string."""
  id_not_ends_with: ID
  label: String

  """All values that are not equal to given value."""
  label_not: String

  """All values that are contained in given list."""
  label_in: [String!]

  """All values that are not contained in given list."""
  label_not_in: [String!]

  """All values less than the given value."""
  label_lt: String

  """All values less than or equal the given value."""
  label_lte: String

  """All values greater than the given value."""
  label_gt: String

  """All values greater than or equal the given value."""
  label_gte: String

  """All values containing the given string."""
  label_contains: String

  """All values not containing the given string."""
  label_not_contains: String

  """All values starting with the given string."""
  label_starts_with: String

  """All values not starting with the given string."""
  label_not_starts_with: String

  """All values ending with the given string."""
  label_ends_with: String

  """All values not ending with the given string."""
  label_not_ends_with: String
  fhirType: String

  """All values that are not equal to given value."""
  fhirType_not: String

  """All values that are contained in given list."""
  fhirType_in: [String!]

  """All values that are not contained in given list."""
  fhirType_not_in: [String!]

  """All values less than the given value."""
  fhirType_lt: String

  """All values less than or equal the given value."""
  fhirType_lte: String

  """All values greater than the given value."""
  fhirType_gt: String

  """All values greater than or equal the given value."""
  fhirType_gte: String

  """All values containing the given string."""
  fhirType_contains: String

  """All values not containing the given string."""
  fhirType_not_contains: String

  """All values starting with the given string."""
  fhirType_starts_with: String

  """All values not starting with the given string."""
  fhirType_not_starts_with: String

  """All values ending with the given string."""
  fhirType_ends_with: String

  """All values not ending with the given string."""
  fhirType_not_ends_with: String
  primaryKeyOwner: String

  """All values that are not equal to given value."""
  primaryKeyOwner_not: String

  """All values that are contained in given list."""
  primaryKeyOwner_in: [String!]

  """All values that are not contained in given list."""
  primaryKeyOwner_not_in: [String!]

  """All values less than the given value."""
  primaryKeyOwner_lt: String

  """All values less than or equal the given value."""
  primaryKeyOwner_lte: String

  """All values greater than the given value."""
  primaryKeyOwner_gt: String

  """All values greater than or equal the given value."""
  primaryKeyOwner_gte: String

  """All values containing the given string."""
  primaryKeyOwner_contains: String

  """All values not containing the given string."""
  primaryKeyOwner_not_contains: String

  """All values starting with the given string."""
  primaryKeyOwner_starts_with: String

  """All values not starting with the given string."""
  primaryKeyOwner_not_starts_with: String

  """All values ending with the given string."""
  primaryKeyOwner_ends_with: String

  """All values not ending with the given string."""
  primaryKeyOwner_not_ends_with: String
  primaryKeyTable: String

  """All values that are not equal to given value."""
  primaryKeyTable_not: String

  """All values that are contained in given list."""
  primaryKeyTable_in: [String!]

  """All values that are not contained in given list."""
  primaryKeyTable_not_in: [String!]

  """All values less than the given value."""
  primaryKeyTable_lt: String

  """All values less than or equal the given value."""
  primaryKeyTable_lte: String

  """All values greater than the given value."""
  primaryKeyTable_gt: String

  """All values greater than or equal the given value."""
  primaryKeyTable_gte: String

  """All values containing the given string."""
  primaryKeyTable_contains: String

  """All values not containing the given string."""
  primaryKeyTable_not_contains: String

  """All values starting with the given string."""
  primaryKeyTable_starts_with: String

  """All values not starting with the given string."""
  primaryKeyTable_not_starts_with: String

  """All values ending with the given string."""
  primaryKeyTable_ends_with: String

  """All values not ending with the given string."""
  primaryKeyTable_not_ends_with: String
  primaryKeyColumn: String

  """All values that are not equal to given value."""
  primaryKeyColumn_not: String

  """All values that are contained in given list."""
  primaryKeyColumn_in: [String!]

  """All values that are not contained in given list."""
  primaryKeyColumn_not_in: [String!]

  """All values less than the given value."""
  primaryKeyColumn_lt: String

  """All values less than or equal the given value."""
  primaryKeyColumn_lte: String

  """All values greater than the given value."""
  primaryKeyColumn_gt: String

  """All values greater than or equal the given value."""
  primaryKeyColumn_gte: String

  """All values containing the given string."""
  primaryKeyColumn_contains: String

  """All values not containing the given string."""
  primaryKeyColumn_not_contains: String

  """All values starting with the given string."""
  primaryKeyColumn_starts_with: String

  """All values not starting with the given string."""
  primaryKeyColumn_not_starts_with: String

  """All values ending with the given string."""
  primaryKeyColumn_ends_with: String

  """All values not ending with the given string."""
  primaryKeyColumn_not_ends_with: String
  updatedAt: DateTime

  """All values that are not equal to given value."""
  updatedAt_not: DateTime

  """All values that are contained in given list."""
  updatedAt_in: [DateTime!]

  """All values that are not contained in given list."""
  updatedAt_not_in: [DateTime!]

  """All values less than the given value."""
  updatedAt_lt: DateTime

  """All values less than or equal the given value."""
  updatedAt_lte: DateTime

  """All values greater than the given value."""
  updatedAt_gt: DateTime

  """All values greater than or equal the given value."""
  updatedAt_gte: DateTime
  createdAt: DateTime

  """All values that are not equal to given value."""
  createdAt_not: DateTime

  """All values that are contained in given list."""
  createdAt_in: [DateTime!]

  """All values that are not contained in given list."""
  createdAt_not_in: [DateTime!]

  """All values less than the given value."""
  createdAt_lt: DateTime

  """All values less than or equal the given value."""
  createdAt_lte: DateTime

  """All values greater than the given value."""
  createdAt_gt: DateTime

  """All values greater than or equal the given value."""
  createdAt_gte: DateTime
  attributes_every: AttributeWhereInput
  attributes_some: AttributeWhereInput
  attributes_none: AttributeWhereInput
  source: SourceWhereInput
}

input ResourceWhereUniqueInput {
  id: ID
}

enum Role {
  ADMIN
  USER
}

type Source implements Node {
  id: ID!
  name: String!
  hasOwner: Boolean!
  resources(where: ResourceWhereInput, orderBy: ResourceOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Resource!]
  updatedAt: DateTime!
  createdAt: DateTime!
  credential: Credential
}

"""A connection to a list of items."""
type SourceConnection {
  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """A list of edges."""
  edges: [SourceEdge]!
  aggregate: AggregateSource!
}

input SourceCreateInput {
  id: ID
  name: String!
  hasOwner: Boolean
  resources: ResourceCreateManyWithoutSourceInput
  credential: CredentialCreateOneWithoutSourceInput
}

input SourceCreateManyWithoutCredentialInput {
  create: [SourceCreateWithoutCredentialInput!]
  connect: [SourceWhereUniqueInput!]
}

input SourceCreateOneWithoutResourcesInput {
  create: SourceCreateWithoutResourcesInput
  connect: SourceWhereUniqueInput
}

input SourceCreateWithoutCredentialInput {
  id: ID
  name: String!
  hasOwner: Boolean
  resources: ResourceCreateManyWithoutSourceInput
}

input SourceCreateWithoutResourcesInput {
  id: ID
  name: String!
  hasOwner: Boolean
  credential: CredentialCreateOneWithoutSourceInput
}

"""An edge in a connection."""
type SourceEdge {
  """The item at the end of the edge."""
  node: Source!

  """A cursor for use in pagination."""
  cursor: String!
}

enum SourceOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
  hasOwner_ASC
  hasOwner_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type SourcePreviousValues {
  id: ID!
  name: String!
  hasOwner: Boolean!
  updatedAt: DateTime!
  createdAt: DateTime!
}

input SourceScalarWhereInput {
  """Logical AND on all given filters."""
  AND: [SourceScalarWhereInput!]

  """Logical OR on all given filters."""
  OR: [SourceScalarWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [SourceScalarWhereInput!]
  id: ID

  """All values that are not equal to given value."""
  id_not: ID

  """All values that are contained in given list."""
  id_in: [ID!]

  """All values that are not contained in given list."""
  id_not_in: [ID!]

  """All values less than the given value."""
  id_lt: ID

  """All values less than or equal the given value."""
  id_lte: ID

  """All values greater than the given value."""
  id_gt: ID

  """All values greater than or equal the given value."""
  id_gte: ID

  """All values containing the given string."""
  id_contains: ID

  """All values not containing the given string."""
  id_not_contains: ID

  """All values starting with the given string."""
  id_starts_with: ID

  """All values not starting with the given string."""
  id_not_starts_with: ID

  """All values ending with the given string."""
  id_ends_with: ID

  """All values not ending with the given string."""
  id_not_ends_with: ID
  name: String

  """All values that are not equal to given value."""
  name_not: String

  """All values that are contained in given list."""
  name_in: [String!]

  """All values that are not contained in given list."""
  name_not_in: [String!]

  """All values less than the given value."""
  name_lt: String

  """All values less than or equal the given value."""
  name_lte: String

  """All values greater than the given value."""
  name_gt: String

  """All values greater than or equal the given value."""
  name_gte: String

  """All values containing the given string."""
  name_contains: String

  """All values not containing the given string."""
  name_not_contains: String

  """All values starting with the given string."""
  name_starts_with: String

  """All values not starting with the given string."""
  name_not_starts_with: String

  """All values ending with the given string."""
  name_ends_with: String

  """All values not ending with the given string."""
  name_not_ends_with: String
  hasOwner: Boolean

  """All values that are not equal to given value."""
  hasOwner_not: Boolean
  updatedAt: DateTime

  """All values that are not equal to given value."""
  updatedAt_not: DateTime

  """All values that are contained in given list."""
  updatedAt_in: [DateTime!]

  """All values that are not contained in given list."""
  updatedAt_not_in: [DateTime!]

  """All values less than the given value."""
  updatedAt_lt: DateTime

  """All values less than or equal the given value."""
  updatedAt_lte: DateTime

  """All values greater than the given value."""
  updatedAt_gt: DateTime

  """All values greater than or equal the given value."""
  updatedAt_gte: DateTime
  createdAt: DateTime

  """All values that are not equal to given value."""
  createdAt_not: DateTime

  """All values that are contained in given list."""
  createdAt_in: [DateTime!]

  """All values that are not contained in given list."""
  createdAt_not_in: [DateTime!]

  """All values less than the given value."""
  createdAt_lt: DateTime

  """All values less than or equal the given value."""
  createdAt_lte: DateTime

  """All values greater than the given value."""
  createdAt_gt: DateTime

  """All values greater than or equal the given value."""
  createdAt_gte: DateTime
}

type SourceSubscriptionPayload {
  mutation: MutationType!
  node: Source
  updatedFields: [String!]
  previousValues: SourcePreviousValues
}

input SourceSubscriptionWhereInput {
  """Logical AND on all given filters."""
  AND: [SourceSubscriptionWhereInput!]

  """Logical OR on all given filters."""
  OR: [SourceSubscriptionWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [SourceSubscriptionWhereInput!]

  """The subscription event gets dispatched when it's listed in mutation_in"""
  mutation_in: [MutationType!]

  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String

  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]

  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: SourceWhereInput
}

input SourceUpdateInput {
  name: String
  hasOwner: Boolean
  resources: ResourceUpdateManyWithoutSourceInput
  credential: CredentialUpdateOneWithoutSourceInput
}

input SourceUpdateManyDataInput {
  name: String
  hasOwner: Boolean
}

input SourceUpdateManyMutationInput {
  name: String
  hasOwner: Boolean
}

input SourceUpdateManyWithoutCredentialInput {
  create: [SourceCreateWithoutCredentialInput!]
  connect: [SourceWhereUniqueInput!]
  set: [SourceWhereUniqueInput!]
  disconnect: [SourceWhereUniqueInput!]
  delete: [SourceWhereUniqueInput!]
  update: [SourceUpdateWithWhereUniqueWithoutCredentialInput!]
  updateMany: [SourceUpdateManyWithWhereNestedInput!]
  deleteMany: [SourceScalarWhereInput!]
  upsert: [SourceUpsertWithWhereUniqueWithoutCredentialInput!]
}

input SourceUpdateManyWithWhereNestedInput {
  where: SourceScalarWhereInput!
  data: SourceUpdateManyDataInput!
}

input SourceUpdateOneRequiredWithoutResourcesInput {
  create: SourceCreateWithoutResourcesInput
  connect: SourceWhereUniqueInput
  update: SourceUpdateWithoutResourcesDataInput
  upsert: SourceUpsertWithoutResourcesInput
}

input SourceUpdateWithoutCredentialDataInput {
  name: String
  hasOwner: Boolean
  resources: ResourceUpdateManyWithoutSourceInput
}

input SourceUpdateWithoutResourcesDataInput {
  name: String
  hasOwner: Boolean
  credential: CredentialUpdateOneWithoutSourceInput
}

input SourceUpdateWithWhereUniqueWithoutCredentialInput {
  where: SourceWhereUniqueInput!
  data: SourceUpdateWithoutCredentialDataInput!
}

input SourceUpsertWithoutResourcesInput {
  update: SourceUpdateWithoutResourcesDataInput!
  create: SourceCreateWithoutResourcesInput!
}

input SourceUpsertWithWhereUniqueWithoutCredentialInput {
  where: SourceWhereUniqueInput!
  update: SourceUpdateWithoutCredentialDataInput!
  create: SourceCreateWithoutCredentialInput!
}

input SourceWhereInput {
  """Logical AND on all given filters."""
  AND: [SourceWhereInput!]

  """Logical OR on all given filters."""
  OR: [SourceWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [SourceWhereInput!]
  id: ID

  """All values that are not equal to given value."""
  id_not: ID

  """All values that are contained in given list."""
  id_in: [ID!]

  """All values that are not contained in given list."""
  id_not_in: [ID!]

  """All values less than the given value."""
  id_lt: ID

  """All values less than or equal the given value."""
  id_lte: ID

  """All values greater than the given value."""
  id_gt: ID

  """All values greater than or equal the given value."""
  id_gte: ID

  """All values containing the given string."""
  id_contains: ID

  """All values not containing the given string."""
  id_not_contains: ID

  """All values starting with the given string."""
  id_starts_with: ID

  """All values not starting with the given string."""
  id_not_starts_with: ID

  """All values ending with the given string."""
  id_ends_with: ID

  """All values not ending with the given string."""
  id_not_ends_with: ID
  name: String

  """All values that are not equal to given value."""
  name_not: String

  """All values that are contained in given list."""
  name_in: [String!]

  """All values that are not contained in given list."""
  name_not_in: [String!]

  """All values less than the given value."""
  name_lt: String

  """All values less than or equal the given value."""
  name_lte: String

  """All values greater than the given value."""
  name_gt: String

  """All values greater than or equal the given value."""
  name_gte: String

  """All values containing the given string."""
  name_contains: String

  """All values not containing the given string."""
  name_not_contains: String

  """All values starting with the given string."""
  name_starts_with: String

  """All values not starting with the given string."""
  name_not_starts_with: String

  """All values ending with the given string."""
  name_ends_with: String

  """All values not ending with the given string."""
  name_not_ends_with: String
  hasOwner: Boolean

  """All values that are not equal to given value."""
  hasOwner_not: Boolean
  updatedAt: DateTime

  """All values that are not equal to given value."""
  updatedAt_not: DateTime

  """All values that are contained in given list."""
  updatedAt_in: [DateTime!]

  """All values that are not contained in given list."""
  updatedAt_not_in: [DateTime!]

  """All values less than the given value."""
  updatedAt_lt: DateTime

  """All values less than or equal the given value."""
  updatedAt_lte: DateTime

  """All values greater than the given value."""
  updatedAt_gt: DateTime

  """All values greater than or equal the given value."""
  updatedAt_gte: DateTime
  createdAt: DateTime

  """All values that are not equal to given value."""
  createdAt_not: DateTime

  """All values that are contained in given list."""
  createdAt_in: [DateTime!]

  """All values that are not contained in given list."""
  createdAt_not_in: [DateTime!]

  """All values less than the given value."""
  createdAt_lt: DateTime

  """All values less than or equal the given value."""
  createdAt_lte: DateTime

  """All values greater than the given value."""
  createdAt_gt: DateTime

  """All values greater than or equal the given value."""
  createdAt_gte: DateTime
  resources_every: ResourceWhereInput
  resources_some: ResourceWhereInput
  resources_none: ResourceWhereInput
  credential: CredentialWhereInput
}

input SourceWhereUniqueInput {
  id: ID
  name: String
}

type Subscription {
  source(where: SourceSubscriptionWhereInput): SourceSubscriptionPayload
  resource(where: ResourceSubscriptionWhereInput): ResourceSubscriptionPayload
  attribute(where: AttributeSubscriptionWhereInput): AttributeSubscriptionPayload
  inputColumn(where: InputColumnSubscriptionWhereInput): InputColumnSubscriptionPayload
  join(where: JoinSubscriptionWhereInput): JoinSubscriptionPayload
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
  credential(where: CredentialSubscriptionWhereInput): CredentialSubscriptionPayload
}

type User implements Node {
  id: ID!
  email: String!
  name: String!
  password: String!
  role: Role
  updatedAt: DateTime!
  createdAt: DateTime!
  credentials(where: CredentialWhereInput, orderBy: CredentialOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Credential!]
}

"""A connection to a list of items."""
type UserConnection {
  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """A list of edges."""
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  id: ID
  email: String!
  name: String!
  password: String!
  role: Role
  credentials: CredentialCreateManyInput
}

"""An edge in a connection."""
type UserEdge {
  """The item at the end of the edge."""
  node: User!

  """A cursor for use in pagination."""
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  email_ASC
  email_DESC
  name_ASC
  name_DESC
  password_ASC
  password_DESC
  role_ASC
  role_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type UserPreviousValues {
  id: ID!
  email: String!
  name: String!
  password: String!
  role: Role
  updatedAt: DateTime!
  createdAt: DateTime!
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  """Logical AND on all given filters."""
  AND: [UserSubscriptionWhereInput!]

  """Logical OR on all given filters."""
  OR: [UserSubscriptionWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [UserSubscriptionWhereInput!]

  """The subscription event gets dispatched when it's listed in mutation_in"""
  mutation_in: [MutationType!]

  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String

  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]

  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: UserWhereInput
}

input UserUpdateInput {
  email: String
  name: String
  password: String
  role: Role
  credentials: CredentialUpdateManyInput
}

input UserUpdateManyMutationInput {
  email: String
  name: String
  password: String
  role: Role
}

input UserWhereInput {
  """Logical AND on all given filters."""
  AND: [UserWhereInput!]

  """Logical OR on all given filters."""
  OR: [UserWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [UserWhereInput!]
  id: ID

  """All values that are not equal to given value."""
  id_not: ID

  """All values that are contained in given list."""
  id_in: [ID!]

  """All values that are not contained in given list."""
  id_not_in: [ID!]

  """All values less than the given value."""
  id_lt: ID

  """All values less than or equal the given value."""
  id_lte: ID

  """All values greater than the given value."""
  id_gt: ID

  """All values greater than or equal the given value."""
  id_gte: ID

  """All values containing the given string."""
  id_contains: ID

  """All values not containing the given string."""
  id_not_contains: ID

  """All values starting with the given string."""
  id_starts_with: ID

  """All values not starting with the given string."""
  id_not_starts_with: ID

  """All values ending with the given string."""
  id_ends_with: ID

  """All values not ending with the given string."""
  id_not_ends_with: ID
  email: String

  """All values that are not equal to given value."""
  email_not: String

  """All values that are contained in given list."""
  email_in: [String!]

  """All values that are not contained in given list."""
  email_not_in: [String!]

  """All values less than the given value."""
  email_lt: String

  """All values less than or equal the given value."""
  email_lte: String

  """All values greater than the given value."""
  email_gt: String

  """All values greater than or equal the given value."""
  email_gte: String

  """All values containing the given string."""
  email_contains: String

  """All values not containing the given string."""
  email_not_contains: String

  """All values starting with the given string."""
  email_starts_with: String

  """All values not starting with the given string."""
  email_not_starts_with: String

  """All values ending with the given string."""
  email_ends_with: String

  """All values not ending with the given string."""
  email_not_ends_with: String
  name: String

  """All values that are not equal to given value."""
  name_not: String

  """All values that are contained in given list."""
  name_in: [String!]

  """All values that are not contained in given list."""
  name_not_in: [String!]

  """All values less than the given value."""
  name_lt: String

  """All values less than or equal the given value."""
  name_lte: String

  """All values greater than the given value."""
  name_gt: String

  """All values greater than or equal the given value."""
  name_gte: String

  """All values containing the given string."""
  name_contains: String

  """All values not containing the given string."""
  name_not_contains: String

  """All values starting with the given string."""
  name_starts_with: String

  """All values not starting with the given string."""
  name_not_starts_with: String

  """All values ending with the given string."""
  name_ends_with: String

  """All values not ending with the given string."""
  name_not_ends_with: String
  password: String

  """All values that are not equal to given value."""
  password_not: String

  """All values that are contained in given list."""
  password_in: [String!]

  """All values that are not contained in given list."""
  password_not_in: [String!]

  """All values less than the given value."""
  password_lt: String

  """All values less than or equal the given value."""
  password_lte: String

  """All values greater than the given value."""
  password_gt: String

  """All values greater than or equal the given value."""
  password_gte: String

  """All values containing the given string."""
  password_contains: String

  """All values not containing the given string."""
  password_not_contains: String

  """All values starting with the given string."""
  password_starts_with: String

  """All values not starting with the given string."""
  password_not_starts_with: String

  """All values ending with the given string."""
  password_ends_with: String

  """All values not ending with the given string."""
  password_not_ends_with: String
  role: Role

  """All values that are not equal to given value."""
  role_not: Role

  """All values that are contained in given list."""
  role_in: [Role!]

  """All values that are not contained in given list."""
  role_not_in: [Role!]
  updatedAt: DateTime

  """All values that are not equal to given value."""
  updatedAt_not: DateTime

  """All values that are contained in given list."""
  updatedAt_in: [DateTime!]

  """All values that are not contained in given list."""
  updatedAt_not_in: [DateTime!]

  """All values less than the given value."""
  updatedAt_lt: DateTime

  """All values less than or equal the given value."""
  updatedAt_lte: DateTime

  """All values greater than the given value."""
  updatedAt_gt: DateTime

  """All values greater than or equal the given value."""
  updatedAt_gte: DateTime
  createdAt: DateTime

  """All values that are not equal to given value."""
  createdAt_not: DateTime

  """All values that are contained in given list."""
  createdAt_in: [DateTime!]

  """All values that are not contained in given list."""
  createdAt_not_in: [DateTime!]

  """All values less than the given value."""
  createdAt_lt: DateTime

  """All values less than or equal the given value."""
  createdAt_lte: DateTime

  """All values greater than the given value."""
  createdAt_gt: DateTime

  """All values greater than or equal the given value."""
  createdAt_gte: DateTime
  credentials_every: CredentialWhereInput
  credentials_some: CredentialWhereInput
  credentials_none: CredentialWhereInput
}

input UserWhereUniqueInput {
  id: ID
  email: String
}
`;

export const Prisma = makePrismaBindingClass<BindingConstructor<Prisma>>({
  typeDefs
});

/**
 * Types
 */

export type AttributeOrderByInput =
  | "id_ASC"
  | "id_DESC"
  | "name_ASC"
  | "name_DESC"
  | "mergingScript_ASC"
  | "mergingScript_DESC"
  | "isProfile_ASC"
  | "isProfile_DESC"
  | "type_ASC"
  | "type_DESC"
  | "comment_ASC"
  | "comment_DESC"
  | "depth_ASC"
  | "depth_DESC"
  | "updatedAt_ASC"
  | "updatedAt_DESC"
  | "createdAt_ASC"
  | "createdAt_DESC";

export type CredentialOrderByInput =
  | "id_ASC"
  | "id_DESC"
  | "host_ASC"
  | "host_DESC"
  | "port_ASC"
  | "port_DESC"
  | "login_ASC"
  | "login_DESC"
  | "password_ASC"
  | "password_DESC"
  | "type_ASC"
  | "type_DESC";

export type DatabaseType = "POSTGRES";

export type InputColumnOrderByInput =
  | "id_ASC"
  | "id_DESC"
  | "owner_ASC"
  | "owner_DESC"
  | "table_ASC"
  | "table_DESC"
  | "column_ASC"
  | "column_DESC"
  | "script_ASC"
  | "script_DESC"
  | "staticValue_ASC"
  | "staticValue_DESC"
  | "updatedAt_ASC"
  | "updatedAt_DESC"
  | "createdAt_ASC"
  | "createdAt_DESC";

export type JoinOrderByInput =
  | "id_ASC"
  | "id_DESC"
  | "sourceOwner_ASC"
  | "sourceOwner_DESC"
  | "sourceTable_ASC"
  | "sourceTable_DESC"
  | "sourceColumn_ASC"
  | "sourceColumn_DESC"
  | "targetOwner_ASC"
  | "targetOwner_DESC"
  | "targetTable_ASC"
  | "targetTable_DESC"
  | "targetColumn_ASC"
  | "targetColumn_DESC"
  | "updatedAt_ASC"
  | "updatedAt_DESC"
  | "createdAt_ASC"
  | "createdAt_DESC";

export type MutationType = "CREATED" | "UPDATED" | "DELETED";

export type ResourceOrderByInput =
  | "id_ASC"
  | "id_DESC"
  | "label_ASC"
  | "label_DESC"
  | "fhirType_ASC"
  | "fhirType_DESC"
  | "primaryKeyOwner_ASC"
  | "primaryKeyOwner_DESC"
  | "primaryKeyTable_ASC"
  | "primaryKeyTable_DESC"
  | "primaryKeyColumn_ASC"
  | "primaryKeyColumn_DESC"
  | "updatedAt_ASC"
  | "updatedAt_DESC"
  | "createdAt_ASC"
  | "createdAt_DESC";

export type Role = "ADMIN" | "USER";

export type SourceOrderByInput =
  | "id_ASC"
  | "id_DESC"
  | "name_ASC"
  | "name_DESC"
  | "hasOwner_ASC"
  | "hasOwner_DESC"
  | "updatedAt_ASC"
  | "updatedAt_DESC"
  | "createdAt_ASC"
  | "createdAt_DESC";

export type UserOrderByInput =
  | "id_ASC"
  | "id_DESC"
  | "email_ASC"
  | "email_DESC"
  | "name_ASC"
  | "name_DESC"
  | "password_ASC"
  | "password_DESC"
  | "role_ASC"
  | "role_DESC"
  | "updatedAt_ASC"
  | "updatedAt_DESC"
  | "createdAt_ASC"
  | "createdAt_DESC";

export interface AttributeCreateInput {
  id?: ID_Input | null;
  name: String;
  mergingScript?: String | null;
  isProfile?: Boolean | null;
  type?: String | null;
  comment?: String | null;
  depth?: Int | null;
  resource?: ResourceCreateOneWithoutAttributesInput | null;
  attributes?: AttributeCreateManyWithoutAttributeInput | null;
  attribute?: AttributeCreateOneWithoutAttributesInput | null;
  inputColumns?: InputColumnCreateManyWithoutAttributeInput | null;
}

export interface AttributeCreateManyWithoutAttributeInput {
  create?:
    | AttributeCreateWithoutAttributeInput[]
    | AttributeCreateWithoutAttributeInput
    | null;
  connect?: AttributeWhereUniqueInput[] | AttributeWhereUniqueInput | null;
}

export interface AttributeCreateManyWithoutResourceInput {
  create?:
    | AttributeCreateWithoutResourceInput[]
    | AttributeCreateWithoutResourceInput
    | null;
  connect?: AttributeWhereUniqueInput[] | AttributeWhereUniqueInput | null;
}

export interface AttributeCreateOneWithoutAttributesInput {
  create?: AttributeCreateWithoutAttributesInput | null;
  connect?: AttributeWhereUniqueInput | null;
}

export interface AttributeCreateOneWithoutInputColumnsInput {
  create?: AttributeCreateWithoutInputColumnsInput | null;
  connect?: AttributeWhereUniqueInput | null;
}

export interface AttributeCreateWithoutAttributeInput {
  id?: ID_Input | null;
  name: String;
  mergingScript?: String | null;
  isProfile?: Boolean | null;
  type?: String | null;
  comment?: String | null;
  depth?: Int | null;
  resource?: ResourceCreateOneWithoutAttributesInput | null;
  attributes?: AttributeCreateManyWithoutAttributeInput | null;
  inputColumns?: InputColumnCreateManyWithoutAttributeInput | null;
}

export interface AttributeCreateWithoutAttributesInput {
  id?: ID_Input | null;
  name: String;
  mergingScript?: String | null;
  isProfile?: Boolean | null;
  type?: String | null;
  comment?: String | null;
  depth?: Int | null;
  resource?: ResourceCreateOneWithoutAttributesInput | null;
  attribute?: AttributeCreateOneWithoutAttributesInput | null;
  inputColumns?: InputColumnCreateManyWithoutAttributeInput | null;
}

export interface AttributeCreateWithoutInputColumnsInput {
  id?: ID_Input | null;
  name: String;
  mergingScript?: String | null;
  isProfile?: Boolean | null;
  type?: String | null;
  comment?: String | null;
  depth?: Int | null;
  resource?: ResourceCreateOneWithoutAttributesInput | null;
  attributes?: AttributeCreateManyWithoutAttributeInput | null;
  attribute?: AttributeCreateOneWithoutAttributesInput | null;
}

export interface AttributeCreateWithoutResourceInput {
  id?: ID_Input | null;
  name: String;
  mergingScript?: String | null;
  isProfile?: Boolean | null;
  type?: String | null;
  comment?: String | null;
  depth?: Int | null;
  attributes?: AttributeCreateManyWithoutAttributeInput | null;
  attribute?: AttributeCreateOneWithoutAttributesInput | null;
  inputColumns?: InputColumnCreateManyWithoutAttributeInput | null;
}

export interface AttributeScalarWhereInput {
  AND?: AttributeScalarWhereInput[] | AttributeScalarWhereInput | null;
  OR?: AttributeScalarWhereInput[] | AttributeScalarWhereInput | null;
  NOT?: AttributeScalarWhereInput[] | AttributeScalarWhereInput | null;
  id?: ID_Input | null;
  id_not?: ID_Input | null;
  id_in?: ID_Output[] | ID_Output | null;
  id_not_in?: ID_Output[] | ID_Output | null;
  id_lt?: ID_Input | null;
  id_lte?: ID_Input | null;
  id_gt?: ID_Input | null;
  id_gte?: ID_Input | null;
  id_contains?: ID_Input | null;
  id_not_contains?: ID_Input | null;
  id_starts_with?: ID_Input | null;
  id_not_starts_with?: ID_Input | null;
  id_ends_with?: ID_Input | null;
  id_not_ends_with?: ID_Input | null;
  name?: String | null;
  name_not?: String | null;
  name_in?: String[] | String | null;
  name_not_in?: String[] | String | null;
  name_lt?: String | null;
  name_lte?: String | null;
  name_gt?: String | null;
  name_gte?: String | null;
  name_contains?: String | null;
  name_not_contains?: String | null;
  name_starts_with?: String | null;
  name_not_starts_with?: String | null;
  name_ends_with?: String | null;
  name_not_ends_with?: String | null;
  mergingScript?: String | null;
  mergingScript_not?: String | null;
  mergingScript_in?: String[] | String | null;
  mergingScript_not_in?: String[] | String | null;
  mergingScript_lt?: String | null;
  mergingScript_lte?: String | null;
  mergingScript_gt?: String | null;
  mergingScript_gte?: String | null;
  mergingScript_contains?: String | null;
  mergingScript_not_contains?: String | null;
  mergingScript_starts_with?: String | null;
  mergingScript_not_starts_with?: String | null;
  mergingScript_ends_with?: String | null;
  mergingScript_not_ends_with?: String | null;
  isProfile?: Boolean | null;
  isProfile_not?: Boolean | null;
  type?: String | null;
  type_not?: String | null;
  type_in?: String[] | String | null;
  type_not_in?: String[] | String | null;
  type_lt?: String | null;
  type_lte?: String | null;
  type_gt?: String | null;
  type_gte?: String | null;
  type_contains?: String | null;
  type_not_contains?: String | null;
  type_starts_with?: String | null;
  type_not_starts_with?: String | null;
  type_ends_with?: String | null;
  type_not_ends_with?: String | null;
  comment?: String | null;
  comment_not?: String | null;
  comment_in?: String[] | String | null;
  comment_not_in?: String[] | String | null;
  comment_lt?: String | null;
  comment_lte?: String | null;
  comment_gt?: String | null;
  comment_gte?: String | null;
  comment_contains?: String | null;
  comment_not_contains?: String | null;
  comment_starts_with?: String | null;
  comment_not_starts_with?: String | null;
  comment_ends_with?: String | null;
  comment_not_ends_with?: String | null;
  depth?: Int | null;
  depth_not?: Int | null;
  depth_in?: Int[] | Int | null;
  depth_not_in?: Int[] | Int | null;
  depth_lt?: Int | null;
  depth_lte?: Int | null;
  depth_gt?: Int | null;
  depth_gte?: Int | null;
  updatedAt?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_in?: DateTime[] | DateTime | null;
  updatedAt_not_in?: DateTime[] | DateTime | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  createdAt?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_in?: DateTime[] | DateTime | null;
  createdAt_not_in?: DateTime[] | DateTime | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
}

export interface AttributeSubscriptionWhereInput {
  AND?:
    | AttributeSubscriptionWhereInput[]
    | AttributeSubscriptionWhereInput
    | null;
  OR?:
    | AttributeSubscriptionWhereInput[]
    | AttributeSubscriptionWhereInput
    | null;
  NOT?:
    | AttributeSubscriptionWhereInput[]
    | AttributeSubscriptionWhereInput
    | null;
  mutation_in?: MutationType[] | MutationType | null;
  updatedFields_contains?: String | null;
  updatedFields_contains_every?: String[] | String | null;
  updatedFields_contains_some?: String[] | String | null;
  node?: AttributeWhereInput | null;
}

export interface AttributeUpdateInput {
  name?: String | null;
  mergingScript?: String | null;
  isProfile?: Boolean | null;
  type?: String | null;
  comment?: String | null;
  depth?: Int | null;
  resource?: ResourceUpdateOneWithoutAttributesInput | null;
  attributes?: AttributeUpdateManyWithoutAttributeInput | null;
  attribute?: AttributeUpdateOneWithoutAttributesInput | null;
  inputColumns?: InputColumnUpdateManyWithoutAttributeInput | null;
}

export interface AttributeUpdateManyDataInput {
  name?: String | null;
  mergingScript?: String | null;
  isProfile?: Boolean | null;
  type?: String | null;
  comment?: String | null;
  depth?: Int | null;
}

export interface AttributeUpdateManyMutationInput {
  name?: String | null;
  mergingScript?: String | null;
  isProfile?: Boolean | null;
  type?: String | null;
  comment?: String | null;
  depth?: Int | null;
}

export interface AttributeUpdateManyWithoutAttributeInput {
  create?:
    | AttributeCreateWithoutAttributeInput[]
    | AttributeCreateWithoutAttributeInput
    | null;
  connect?: AttributeWhereUniqueInput[] | AttributeWhereUniqueInput | null;
  set?: AttributeWhereUniqueInput[] | AttributeWhereUniqueInput | null;
  disconnect?: AttributeWhereUniqueInput[] | AttributeWhereUniqueInput | null;
  delete?: AttributeWhereUniqueInput[] | AttributeWhereUniqueInput | null;
  update?:
    | AttributeUpdateWithWhereUniqueWithoutAttributeInput[]
    | AttributeUpdateWithWhereUniqueWithoutAttributeInput
    | null;
  updateMany?:
    | AttributeUpdateManyWithWhereNestedInput[]
    | AttributeUpdateManyWithWhereNestedInput
    | null;
  deleteMany?: AttributeScalarWhereInput[] | AttributeScalarWhereInput | null;
  upsert?:
    | AttributeUpsertWithWhereUniqueWithoutAttributeInput[]
    | AttributeUpsertWithWhereUniqueWithoutAttributeInput
    | null;
}

export interface AttributeUpdateManyWithoutResourceInput {
  create?:
    | AttributeCreateWithoutResourceInput[]
    | AttributeCreateWithoutResourceInput
    | null;
  connect?: AttributeWhereUniqueInput[] | AttributeWhereUniqueInput | null;
  set?: AttributeWhereUniqueInput[] | AttributeWhereUniqueInput | null;
  disconnect?: AttributeWhereUniqueInput[] | AttributeWhereUniqueInput | null;
  delete?: AttributeWhereUniqueInput[] | AttributeWhereUniqueInput | null;
  update?:
    | AttributeUpdateWithWhereUniqueWithoutResourceInput[]
    | AttributeUpdateWithWhereUniqueWithoutResourceInput
    | null;
  updateMany?:
    | AttributeUpdateManyWithWhereNestedInput[]
    | AttributeUpdateManyWithWhereNestedInput
    | null;
  deleteMany?: AttributeScalarWhereInput[] | AttributeScalarWhereInput | null;
  upsert?:
    | AttributeUpsertWithWhereUniqueWithoutResourceInput[]
    | AttributeUpsertWithWhereUniqueWithoutResourceInput
    | null;
}

export interface AttributeUpdateManyWithWhereNestedInput {
  where: AttributeScalarWhereInput;
  data: AttributeUpdateManyDataInput;
}

export interface AttributeUpdateOneRequiredWithoutInputColumnsInput {
  create?: AttributeCreateWithoutInputColumnsInput | null;
  connect?: AttributeWhereUniqueInput | null;
  update?: AttributeUpdateWithoutInputColumnsDataInput | null;
  upsert?: AttributeUpsertWithoutInputColumnsInput | null;
}

export interface AttributeUpdateOneWithoutAttributesInput {
  create?: AttributeCreateWithoutAttributesInput | null;
  connect?: AttributeWhereUniqueInput | null;
  disconnect?: Boolean | null;
  delete?: Boolean | null;
  update?: AttributeUpdateWithoutAttributesDataInput | null;
  upsert?: AttributeUpsertWithoutAttributesInput | null;
}

export interface AttributeUpdateWithoutAttributeDataInput {
  name?: String | null;
  mergingScript?: String | null;
  isProfile?: Boolean | null;
  type?: String | null;
  comment?: String | null;
  depth?: Int | null;
  resource?: ResourceUpdateOneWithoutAttributesInput | null;
  attributes?: AttributeUpdateManyWithoutAttributeInput | null;
  inputColumns?: InputColumnUpdateManyWithoutAttributeInput | null;
}

export interface AttributeUpdateWithoutAttributesDataInput {
  name?: String | null;
  mergingScript?: String | null;
  isProfile?: Boolean | null;
  type?: String | null;
  comment?: String | null;
  depth?: Int | null;
  resource?: ResourceUpdateOneWithoutAttributesInput | null;
  attribute?: AttributeUpdateOneWithoutAttributesInput | null;
  inputColumns?: InputColumnUpdateManyWithoutAttributeInput | null;
}

export interface AttributeUpdateWithoutInputColumnsDataInput {
  name?: String | null;
  mergingScript?: String | null;
  isProfile?: Boolean | null;
  type?: String | null;
  comment?: String | null;
  depth?: Int | null;
  resource?: ResourceUpdateOneWithoutAttributesInput | null;
  attributes?: AttributeUpdateManyWithoutAttributeInput | null;
  attribute?: AttributeUpdateOneWithoutAttributesInput | null;
}

export interface AttributeUpdateWithoutResourceDataInput {
  name?: String | null;
  mergingScript?: String | null;
  isProfile?: Boolean | null;
  type?: String | null;
  comment?: String | null;
  depth?: Int | null;
  attributes?: AttributeUpdateManyWithoutAttributeInput | null;
  attribute?: AttributeUpdateOneWithoutAttributesInput | null;
  inputColumns?: InputColumnUpdateManyWithoutAttributeInput | null;
}

export interface AttributeUpdateWithWhereUniqueWithoutAttributeInput {
  where: AttributeWhereUniqueInput;
  data: AttributeUpdateWithoutAttributeDataInput;
}

export interface AttributeUpdateWithWhereUniqueWithoutResourceInput {
  where: AttributeWhereUniqueInput;
  data: AttributeUpdateWithoutResourceDataInput;
}

export interface AttributeUpsertWithoutAttributesInput {
  update: AttributeUpdateWithoutAttributesDataInput;
  create: AttributeCreateWithoutAttributesInput;
}

export interface AttributeUpsertWithoutInputColumnsInput {
  update: AttributeUpdateWithoutInputColumnsDataInput;
  create: AttributeCreateWithoutInputColumnsInput;
}

export interface AttributeUpsertWithWhereUniqueWithoutAttributeInput {
  where: AttributeWhereUniqueInput;
  update: AttributeUpdateWithoutAttributeDataInput;
  create: AttributeCreateWithoutAttributeInput;
}

export interface AttributeUpsertWithWhereUniqueWithoutResourceInput {
  where: AttributeWhereUniqueInput;
  update: AttributeUpdateWithoutResourceDataInput;
  create: AttributeCreateWithoutResourceInput;
}

export interface AttributeWhereInput {
  AND?: AttributeWhereInput[] | AttributeWhereInput | null;
  OR?: AttributeWhereInput[] | AttributeWhereInput | null;
  NOT?: AttributeWhereInput[] | AttributeWhereInput | null;
  id?: ID_Input | null;
  id_not?: ID_Input | null;
  id_in?: ID_Output[] | ID_Output | null;
  id_not_in?: ID_Output[] | ID_Output | null;
  id_lt?: ID_Input | null;
  id_lte?: ID_Input | null;
  id_gt?: ID_Input | null;
  id_gte?: ID_Input | null;
  id_contains?: ID_Input | null;
  id_not_contains?: ID_Input | null;
  id_starts_with?: ID_Input | null;
  id_not_starts_with?: ID_Input | null;
  id_ends_with?: ID_Input | null;
  id_not_ends_with?: ID_Input | null;
  name?: String | null;
  name_not?: String | null;
  name_in?: String[] | String | null;
  name_not_in?: String[] | String | null;
  name_lt?: String | null;
  name_lte?: String | null;
  name_gt?: String | null;
  name_gte?: String | null;
  name_contains?: String | null;
  name_not_contains?: String | null;
  name_starts_with?: String | null;
  name_not_starts_with?: String | null;
  name_ends_with?: String | null;
  name_not_ends_with?: String | null;
  mergingScript?: String | null;
  mergingScript_not?: String | null;
  mergingScript_in?: String[] | String | null;
  mergingScript_not_in?: String[] | String | null;
  mergingScript_lt?: String | null;
  mergingScript_lte?: String | null;
  mergingScript_gt?: String | null;
  mergingScript_gte?: String | null;
  mergingScript_contains?: String | null;
  mergingScript_not_contains?: String | null;
  mergingScript_starts_with?: String | null;
  mergingScript_not_starts_with?: String | null;
  mergingScript_ends_with?: String | null;
  mergingScript_not_ends_with?: String | null;
  isProfile?: Boolean | null;
  isProfile_not?: Boolean | null;
  type?: String | null;
  type_not?: String | null;
  type_in?: String[] | String | null;
  type_not_in?: String[] | String | null;
  type_lt?: String | null;
  type_lte?: String | null;
  type_gt?: String | null;
  type_gte?: String | null;
  type_contains?: String | null;
  type_not_contains?: String | null;
  type_starts_with?: String | null;
  type_not_starts_with?: String | null;
  type_ends_with?: String | null;
  type_not_ends_with?: String | null;
  comment?: String | null;
  comment_not?: String | null;
  comment_in?: String[] | String | null;
  comment_not_in?: String[] | String | null;
  comment_lt?: String | null;
  comment_lte?: String | null;
  comment_gt?: String | null;
  comment_gte?: String | null;
  comment_contains?: String | null;
  comment_not_contains?: String | null;
  comment_starts_with?: String | null;
  comment_not_starts_with?: String | null;
  comment_ends_with?: String | null;
  comment_not_ends_with?: String | null;
  depth?: Int | null;
  depth_not?: Int | null;
  depth_in?: Int[] | Int | null;
  depth_not_in?: Int[] | Int | null;
  depth_lt?: Int | null;
  depth_lte?: Int | null;
  depth_gt?: Int | null;
  depth_gte?: Int | null;
  updatedAt?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_in?: DateTime[] | DateTime | null;
  updatedAt_not_in?: DateTime[] | DateTime | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  createdAt?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_in?: DateTime[] | DateTime | null;
  createdAt_not_in?: DateTime[] | DateTime | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
  resource?: ResourceWhereInput | null;
  attributes_every?: AttributeWhereInput | null;
  attributes_some?: AttributeWhereInput | null;
  attributes_none?: AttributeWhereInput | null;
  attribute?: AttributeWhereInput | null;
  inputColumns_every?: InputColumnWhereInput | null;
  inputColumns_some?: InputColumnWhereInput | null;
  inputColumns_none?: InputColumnWhereInput | null;
}

export interface AttributeWhereUniqueInput {
  id?: ID_Input | null;
}

export interface CredentialCreateInput {
  id?: ID_Input | null;
  host: String;
  port: String;
  login: String;
  password?: String | null;
  type: DatabaseType;
  source?: SourceCreateManyWithoutCredentialInput | null;
}

export interface CredentialCreateManyInput {
  create?: CredentialCreateInput[] | CredentialCreateInput | null;
  connect?: CredentialWhereUniqueInput[] | CredentialWhereUniqueInput | null;
}

export interface CredentialCreateOneWithoutSourceInput {
  create?: CredentialCreateWithoutSourceInput | null;
  connect?: CredentialWhereUniqueInput | null;
}

export interface CredentialCreateWithoutSourceInput {
  id?: ID_Input | null;
  host: String;
  port: String;
  login: String;
  password?: String | null;
  type: DatabaseType;
}

export interface CredentialScalarWhereInput {
  AND?: CredentialScalarWhereInput[] | CredentialScalarWhereInput | null;
  OR?: CredentialScalarWhereInput[] | CredentialScalarWhereInput | null;
  NOT?: CredentialScalarWhereInput[] | CredentialScalarWhereInput | null;
  id?: ID_Input | null;
  id_not?: ID_Input | null;
  id_in?: ID_Output[] | ID_Output | null;
  id_not_in?: ID_Output[] | ID_Output | null;
  id_lt?: ID_Input | null;
  id_lte?: ID_Input | null;
  id_gt?: ID_Input | null;
  id_gte?: ID_Input | null;
  id_contains?: ID_Input | null;
  id_not_contains?: ID_Input | null;
  id_starts_with?: ID_Input | null;
  id_not_starts_with?: ID_Input | null;
  id_ends_with?: ID_Input | null;
  id_not_ends_with?: ID_Input | null;
  host?: String | null;
  host_not?: String | null;
  host_in?: String[] | String | null;
  host_not_in?: String[] | String | null;
  host_lt?: String | null;
  host_lte?: String | null;
  host_gt?: String | null;
  host_gte?: String | null;
  host_contains?: String | null;
  host_not_contains?: String | null;
  host_starts_with?: String | null;
  host_not_starts_with?: String | null;
  host_ends_with?: String | null;
  host_not_ends_with?: String | null;
  port?: String | null;
  port_not?: String | null;
  port_in?: String[] | String | null;
  port_not_in?: String[] | String | null;
  port_lt?: String | null;
  port_lte?: String | null;
  port_gt?: String | null;
  port_gte?: String | null;
  port_contains?: String | null;
  port_not_contains?: String | null;
  port_starts_with?: String | null;
  port_not_starts_with?: String | null;
  port_ends_with?: String | null;
  port_not_ends_with?: String | null;
  login?: String | null;
  login_not?: String | null;
  login_in?: String[] | String | null;
  login_not_in?: String[] | String | null;
  login_lt?: String | null;
  login_lte?: String | null;
  login_gt?: String | null;
  login_gte?: String | null;
  login_contains?: String | null;
  login_not_contains?: String | null;
  login_starts_with?: String | null;
  login_not_starts_with?: String | null;
  login_ends_with?: String | null;
  login_not_ends_with?: String | null;
  password?: String | null;
  password_not?: String | null;
  password_in?: String[] | String | null;
  password_not_in?: String[] | String | null;
  password_lt?: String | null;
  password_lte?: String | null;
  password_gt?: String | null;
  password_gte?: String | null;
  password_contains?: String | null;
  password_not_contains?: String | null;
  password_starts_with?: String | null;
  password_not_starts_with?: String | null;
  password_ends_with?: String | null;
  password_not_ends_with?: String | null;
  type?: DatabaseType | null;
  type_not?: DatabaseType | null;
  type_in?: DatabaseType[] | DatabaseType | null;
  type_not_in?: DatabaseType[] | DatabaseType | null;
}

export interface CredentialSubscriptionWhereInput {
  AND?:
    | CredentialSubscriptionWhereInput[]
    | CredentialSubscriptionWhereInput
    | null;
  OR?:
    | CredentialSubscriptionWhereInput[]
    | CredentialSubscriptionWhereInput
    | null;
  NOT?:
    | CredentialSubscriptionWhereInput[]
    | CredentialSubscriptionWhereInput
    | null;
  mutation_in?: MutationType[] | MutationType | null;
  updatedFields_contains?: String | null;
  updatedFields_contains_every?: String[] | String | null;
  updatedFields_contains_some?: String[] | String | null;
  node?: CredentialWhereInput | null;
}

export interface CredentialUpdateDataInput {
  host?: String | null;
  port?: String | null;
  login?: String | null;
  password?: String | null;
  type?: DatabaseType | null;
  source?: SourceUpdateManyWithoutCredentialInput | null;
}

export interface CredentialUpdateInput {
  host?: String | null;
  port?: String | null;
  login?: String | null;
  password?: String | null;
  type?: DatabaseType | null;
  source?: SourceUpdateManyWithoutCredentialInput | null;
}

export interface CredentialUpdateManyDataInput {
  host?: String | null;
  port?: String | null;
  login?: String | null;
  password?: String | null;
  type?: DatabaseType | null;
}

export interface CredentialUpdateManyInput {
  create?: CredentialCreateInput[] | CredentialCreateInput | null;
  connect?: CredentialWhereUniqueInput[] | CredentialWhereUniqueInput | null;
  set?: CredentialWhereUniqueInput[] | CredentialWhereUniqueInput | null;
  disconnect?: CredentialWhereUniqueInput[] | CredentialWhereUniqueInput | null;
  delete?: CredentialWhereUniqueInput[] | CredentialWhereUniqueInput | null;
  update?:
    | CredentialUpdateWithWhereUniqueNestedInput[]
    | CredentialUpdateWithWhereUniqueNestedInput
    | null;
  updateMany?:
    | CredentialUpdateManyWithWhereNestedInput[]
    | CredentialUpdateManyWithWhereNestedInput
    | null;
  deleteMany?: CredentialScalarWhereInput[] | CredentialScalarWhereInput | null;
  upsert?:
    | CredentialUpsertWithWhereUniqueNestedInput[]
    | CredentialUpsertWithWhereUniqueNestedInput
    | null;
}

export interface CredentialUpdateManyMutationInput {
  host?: String | null;
  port?: String | null;
  login?: String | null;
  password?: String | null;
  type?: DatabaseType | null;
}

export interface CredentialUpdateManyWithWhereNestedInput {
  where: CredentialScalarWhereInput;
  data: CredentialUpdateManyDataInput;
}

export interface CredentialUpdateOneWithoutSourceInput {
  create?: CredentialCreateWithoutSourceInput | null;
  connect?: CredentialWhereUniqueInput | null;
  disconnect?: Boolean | null;
  delete?: Boolean | null;
  update?: CredentialUpdateWithoutSourceDataInput | null;
  upsert?: CredentialUpsertWithoutSourceInput | null;
}

export interface CredentialUpdateWithoutSourceDataInput {
  host?: String | null;
  port?: String | null;
  login?: String | null;
  password?: String | null;
  type?: DatabaseType | null;
}

export interface CredentialUpdateWithWhereUniqueNestedInput {
  where: CredentialWhereUniqueInput;
  data: CredentialUpdateDataInput;
}

export interface CredentialUpsertWithoutSourceInput {
  update: CredentialUpdateWithoutSourceDataInput;
  create: CredentialCreateWithoutSourceInput;
}

export interface CredentialUpsertWithWhereUniqueNestedInput {
  where: CredentialWhereUniqueInput;
  update: CredentialUpdateDataInput;
  create: CredentialCreateInput;
}

export interface CredentialWhereInput {
  AND?: CredentialWhereInput[] | CredentialWhereInput | null;
  OR?: CredentialWhereInput[] | CredentialWhereInput | null;
  NOT?: CredentialWhereInput[] | CredentialWhereInput | null;
  id?: ID_Input | null;
  id_not?: ID_Input | null;
  id_in?: ID_Output[] | ID_Output | null;
  id_not_in?: ID_Output[] | ID_Output | null;
  id_lt?: ID_Input | null;
  id_lte?: ID_Input | null;
  id_gt?: ID_Input | null;
  id_gte?: ID_Input | null;
  id_contains?: ID_Input | null;
  id_not_contains?: ID_Input | null;
  id_starts_with?: ID_Input | null;
  id_not_starts_with?: ID_Input | null;
  id_ends_with?: ID_Input | null;
  id_not_ends_with?: ID_Input | null;
  host?: String | null;
  host_not?: String | null;
  host_in?: String[] | String | null;
  host_not_in?: String[] | String | null;
  host_lt?: String | null;
  host_lte?: String | null;
  host_gt?: String | null;
  host_gte?: String | null;
  host_contains?: String | null;
  host_not_contains?: String | null;
  host_starts_with?: String | null;
  host_not_starts_with?: String | null;
  host_ends_with?: String | null;
  host_not_ends_with?: String | null;
  port?: String | null;
  port_not?: String | null;
  port_in?: String[] | String | null;
  port_not_in?: String[] | String | null;
  port_lt?: String | null;
  port_lte?: String | null;
  port_gt?: String | null;
  port_gte?: String | null;
  port_contains?: String | null;
  port_not_contains?: String | null;
  port_starts_with?: String | null;
  port_not_starts_with?: String | null;
  port_ends_with?: String | null;
  port_not_ends_with?: String | null;
  login?: String | null;
  login_not?: String | null;
  login_in?: String[] | String | null;
  login_not_in?: String[] | String | null;
  login_lt?: String | null;
  login_lte?: String | null;
  login_gt?: String | null;
  login_gte?: String | null;
  login_contains?: String | null;
  login_not_contains?: String | null;
  login_starts_with?: String | null;
  login_not_starts_with?: String | null;
  login_ends_with?: String | null;
  login_not_ends_with?: String | null;
  password?: String | null;
  password_not?: String | null;
  password_in?: String[] | String | null;
  password_not_in?: String[] | String | null;
  password_lt?: String | null;
  password_lte?: String | null;
  password_gt?: String | null;
  password_gte?: String | null;
  password_contains?: String | null;
  password_not_contains?: String | null;
  password_starts_with?: String | null;
  password_not_starts_with?: String | null;
  password_ends_with?: String | null;
  password_not_ends_with?: String | null;
  type?: DatabaseType | null;
  type_not?: DatabaseType | null;
  type_in?: DatabaseType[] | DatabaseType | null;
  type_not_in?: DatabaseType[] | DatabaseType | null;
  source_every?: SourceWhereInput | null;
  source_some?: SourceWhereInput | null;
  source_none?: SourceWhereInput | null;
}

export interface CredentialWhereUniqueInput {
  id?: ID_Input | null;
}

export interface InputColumnCreateInput {
  id?: ID_Input | null;
  owner?: String | null;
  table?: String | null;
  column?: String | null;
  script?: String | null;
  staticValue?: String | null;
  joins?: JoinCreateManyWithoutInputColumnInput | null;
  attribute: AttributeCreateOneWithoutInputColumnsInput;
}

export interface InputColumnCreateManyWithoutAttributeInput {
  create?:
    | InputColumnCreateWithoutAttributeInput[]
    | InputColumnCreateWithoutAttributeInput
    | null;
  connect?: InputColumnWhereUniqueInput[] | InputColumnWhereUniqueInput | null;
}

export interface InputColumnCreateOneWithoutJoinsInput {
  create?: InputColumnCreateWithoutJoinsInput | null;
  connect?: InputColumnWhereUniqueInput | null;
}

export interface InputColumnCreateWithoutAttributeInput {
  id?: ID_Input | null;
  owner?: String | null;
  table?: String | null;
  column?: String | null;
  script?: String | null;
  staticValue?: String | null;
  joins?: JoinCreateManyWithoutInputColumnInput | null;
}

export interface InputColumnCreateWithoutJoinsInput {
  id?: ID_Input | null;
  owner?: String | null;
  table?: String | null;
  column?: String | null;
  script?: String | null;
  staticValue?: String | null;
  attribute: AttributeCreateOneWithoutInputColumnsInput;
}

export interface InputColumnScalarWhereInput {
  AND?: InputColumnScalarWhereInput[] | InputColumnScalarWhereInput | null;
  OR?: InputColumnScalarWhereInput[] | InputColumnScalarWhereInput | null;
  NOT?: InputColumnScalarWhereInput[] | InputColumnScalarWhereInput | null;
  id?: ID_Input | null;
  id_not?: ID_Input | null;
  id_in?: ID_Output[] | ID_Output | null;
  id_not_in?: ID_Output[] | ID_Output | null;
  id_lt?: ID_Input | null;
  id_lte?: ID_Input | null;
  id_gt?: ID_Input | null;
  id_gte?: ID_Input | null;
  id_contains?: ID_Input | null;
  id_not_contains?: ID_Input | null;
  id_starts_with?: ID_Input | null;
  id_not_starts_with?: ID_Input | null;
  id_ends_with?: ID_Input | null;
  id_not_ends_with?: ID_Input | null;
  owner?: String | null;
  owner_not?: String | null;
  owner_in?: String[] | String | null;
  owner_not_in?: String[] | String | null;
  owner_lt?: String | null;
  owner_lte?: String | null;
  owner_gt?: String | null;
  owner_gte?: String | null;
  owner_contains?: String | null;
  owner_not_contains?: String | null;
  owner_starts_with?: String | null;
  owner_not_starts_with?: String | null;
  owner_ends_with?: String | null;
  owner_not_ends_with?: String | null;
  table?: String | null;
  table_not?: String | null;
  table_in?: String[] | String | null;
  table_not_in?: String[] | String | null;
  table_lt?: String | null;
  table_lte?: String | null;
  table_gt?: String | null;
  table_gte?: String | null;
  table_contains?: String | null;
  table_not_contains?: String | null;
  table_starts_with?: String | null;
  table_not_starts_with?: String | null;
  table_ends_with?: String | null;
  table_not_ends_with?: String | null;
  column?: String | null;
  column_not?: String | null;
  column_in?: String[] | String | null;
  column_not_in?: String[] | String | null;
  column_lt?: String | null;
  column_lte?: String | null;
  column_gt?: String | null;
  column_gte?: String | null;
  column_contains?: String | null;
  column_not_contains?: String | null;
  column_starts_with?: String | null;
  column_not_starts_with?: String | null;
  column_ends_with?: String | null;
  column_not_ends_with?: String | null;
  script?: String | null;
  script_not?: String | null;
  script_in?: String[] | String | null;
  script_not_in?: String[] | String | null;
  script_lt?: String | null;
  script_lte?: String | null;
  script_gt?: String | null;
  script_gte?: String | null;
  script_contains?: String | null;
  script_not_contains?: String | null;
  script_starts_with?: String | null;
  script_not_starts_with?: String | null;
  script_ends_with?: String | null;
  script_not_ends_with?: String | null;
  staticValue?: String | null;
  staticValue_not?: String | null;
  staticValue_in?: String[] | String | null;
  staticValue_not_in?: String[] | String | null;
  staticValue_lt?: String | null;
  staticValue_lte?: String | null;
  staticValue_gt?: String | null;
  staticValue_gte?: String | null;
  staticValue_contains?: String | null;
  staticValue_not_contains?: String | null;
  staticValue_starts_with?: String | null;
  staticValue_not_starts_with?: String | null;
  staticValue_ends_with?: String | null;
  staticValue_not_ends_with?: String | null;
  updatedAt?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_in?: DateTime[] | DateTime | null;
  updatedAt_not_in?: DateTime[] | DateTime | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  createdAt?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_in?: DateTime[] | DateTime | null;
  createdAt_not_in?: DateTime[] | DateTime | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
}

export interface InputColumnSubscriptionWhereInput {
  AND?:
    | InputColumnSubscriptionWhereInput[]
    | InputColumnSubscriptionWhereInput
    | null;
  OR?:
    | InputColumnSubscriptionWhereInput[]
    | InputColumnSubscriptionWhereInput
    | null;
  NOT?:
    | InputColumnSubscriptionWhereInput[]
    | InputColumnSubscriptionWhereInput
    | null;
  mutation_in?: MutationType[] | MutationType | null;
  updatedFields_contains?: String | null;
  updatedFields_contains_every?: String[] | String | null;
  updatedFields_contains_some?: String[] | String | null;
  node?: InputColumnWhereInput | null;
}

export interface InputColumnUpdateInput {
  owner?: String | null;
  table?: String | null;
  column?: String | null;
  script?: String | null;
  staticValue?: String | null;
  joins?: JoinUpdateManyWithoutInputColumnInput | null;
  attribute?: AttributeUpdateOneRequiredWithoutInputColumnsInput | null;
}

export interface InputColumnUpdateManyDataInput {
  owner?: String | null;
  table?: String | null;
  column?: String | null;
  script?: String | null;
  staticValue?: String | null;
}

export interface InputColumnUpdateManyMutationInput {
  owner?: String | null;
  table?: String | null;
  column?: String | null;
  script?: String | null;
  staticValue?: String | null;
}

export interface InputColumnUpdateManyWithoutAttributeInput {
  create?:
    | InputColumnCreateWithoutAttributeInput[]
    | InputColumnCreateWithoutAttributeInput
    | null;
  connect?: InputColumnWhereUniqueInput[] | InputColumnWhereUniqueInput | null;
  set?: InputColumnWhereUniqueInput[] | InputColumnWhereUniqueInput | null;
  disconnect?:
    | InputColumnWhereUniqueInput[]
    | InputColumnWhereUniqueInput
    | null;
  delete?: InputColumnWhereUniqueInput[] | InputColumnWhereUniqueInput | null;
  update?:
    | InputColumnUpdateWithWhereUniqueWithoutAttributeInput[]
    | InputColumnUpdateWithWhereUniqueWithoutAttributeInput
    | null;
  updateMany?:
    | InputColumnUpdateManyWithWhereNestedInput[]
    | InputColumnUpdateManyWithWhereNestedInput
    | null;
  deleteMany?:
    | InputColumnScalarWhereInput[]
    | InputColumnScalarWhereInput
    | null;
  upsert?:
    | InputColumnUpsertWithWhereUniqueWithoutAttributeInput[]
    | InputColumnUpsertWithWhereUniqueWithoutAttributeInput
    | null;
}

export interface InputColumnUpdateManyWithWhereNestedInput {
  where: InputColumnScalarWhereInput;
  data: InputColumnUpdateManyDataInput;
}

export interface InputColumnUpdateOneRequiredWithoutJoinsInput {
  create?: InputColumnCreateWithoutJoinsInput | null;
  connect?: InputColumnWhereUniqueInput | null;
  update?: InputColumnUpdateWithoutJoinsDataInput | null;
  upsert?: InputColumnUpsertWithoutJoinsInput | null;
}

export interface InputColumnUpdateWithoutAttributeDataInput {
  owner?: String | null;
  table?: String | null;
  column?: String | null;
  script?: String | null;
  staticValue?: String | null;
  joins?: JoinUpdateManyWithoutInputColumnInput | null;
}

export interface InputColumnUpdateWithoutJoinsDataInput {
  owner?: String | null;
  table?: String | null;
  column?: String | null;
  script?: String | null;
  staticValue?: String | null;
  attribute?: AttributeUpdateOneRequiredWithoutInputColumnsInput | null;
}

export interface InputColumnUpdateWithWhereUniqueWithoutAttributeInput {
  where: InputColumnWhereUniqueInput;
  data: InputColumnUpdateWithoutAttributeDataInput;
}

export interface InputColumnUpsertWithoutJoinsInput {
  update: InputColumnUpdateWithoutJoinsDataInput;
  create: InputColumnCreateWithoutJoinsInput;
}

export interface InputColumnUpsertWithWhereUniqueWithoutAttributeInput {
  where: InputColumnWhereUniqueInput;
  update: InputColumnUpdateWithoutAttributeDataInput;
  create: InputColumnCreateWithoutAttributeInput;
}

export interface InputColumnWhereInput {
  AND?: InputColumnWhereInput[] | InputColumnWhereInput | null;
  OR?: InputColumnWhereInput[] | InputColumnWhereInput | null;
  NOT?: InputColumnWhereInput[] | InputColumnWhereInput | null;
  id?: ID_Input | null;
  id_not?: ID_Input | null;
  id_in?: ID_Output[] | ID_Output | null;
  id_not_in?: ID_Output[] | ID_Output | null;
  id_lt?: ID_Input | null;
  id_lte?: ID_Input | null;
  id_gt?: ID_Input | null;
  id_gte?: ID_Input | null;
  id_contains?: ID_Input | null;
  id_not_contains?: ID_Input | null;
  id_starts_with?: ID_Input | null;
  id_not_starts_with?: ID_Input | null;
  id_ends_with?: ID_Input | null;
  id_not_ends_with?: ID_Input | null;
  owner?: String | null;
  owner_not?: String | null;
  owner_in?: String[] | String | null;
  owner_not_in?: String[] | String | null;
  owner_lt?: String | null;
  owner_lte?: String | null;
  owner_gt?: String | null;
  owner_gte?: String | null;
  owner_contains?: String | null;
  owner_not_contains?: String | null;
  owner_starts_with?: String | null;
  owner_not_starts_with?: String | null;
  owner_ends_with?: String | null;
  owner_not_ends_with?: String | null;
  table?: String | null;
  table_not?: String | null;
  table_in?: String[] | String | null;
  table_not_in?: String[] | String | null;
  table_lt?: String | null;
  table_lte?: String | null;
  table_gt?: String | null;
  table_gte?: String | null;
  table_contains?: String | null;
  table_not_contains?: String | null;
  table_starts_with?: String | null;
  table_not_starts_with?: String | null;
  table_ends_with?: String | null;
  table_not_ends_with?: String | null;
  column?: String | null;
  column_not?: String | null;
  column_in?: String[] | String | null;
  column_not_in?: String[] | String | null;
  column_lt?: String | null;
  column_lte?: String | null;
  column_gt?: String | null;
  column_gte?: String | null;
  column_contains?: String | null;
  column_not_contains?: String | null;
  column_starts_with?: String | null;
  column_not_starts_with?: String | null;
  column_ends_with?: String | null;
  column_not_ends_with?: String | null;
  script?: String | null;
  script_not?: String | null;
  script_in?: String[] | String | null;
  script_not_in?: String[] | String | null;
  script_lt?: String | null;
  script_lte?: String | null;
  script_gt?: String | null;
  script_gte?: String | null;
  script_contains?: String | null;
  script_not_contains?: String | null;
  script_starts_with?: String | null;
  script_not_starts_with?: String | null;
  script_ends_with?: String | null;
  script_not_ends_with?: String | null;
  staticValue?: String | null;
  staticValue_not?: String | null;
  staticValue_in?: String[] | String | null;
  staticValue_not_in?: String[] | String | null;
  staticValue_lt?: String | null;
  staticValue_lte?: String | null;
  staticValue_gt?: String | null;
  staticValue_gte?: String | null;
  staticValue_contains?: String | null;
  staticValue_not_contains?: String | null;
  staticValue_starts_with?: String | null;
  staticValue_not_starts_with?: String | null;
  staticValue_ends_with?: String | null;
  staticValue_not_ends_with?: String | null;
  updatedAt?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_in?: DateTime[] | DateTime | null;
  updatedAt_not_in?: DateTime[] | DateTime | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  createdAt?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_in?: DateTime[] | DateTime | null;
  createdAt_not_in?: DateTime[] | DateTime | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
  joins_every?: JoinWhereInput | null;
  joins_some?: JoinWhereInput | null;
  joins_none?: JoinWhereInput | null;
  attribute?: AttributeWhereInput | null;
}

export interface InputColumnWhereUniqueInput {
  id?: ID_Input | null;
}

export interface JoinCreateInput {
  id?: ID_Input | null;
  sourceOwner?: String | null;
  sourceTable?: String | null;
  sourceColumn?: String | null;
  targetOwner?: String | null;
  targetTable?: String | null;
  targetColumn?: String | null;
  inputColumn: InputColumnCreateOneWithoutJoinsInput;
}

export interface JoinCreateManyWithoutInputColumnInput {
  create?:
    | JoinCreateWithoutInputColumnInput[]
    | JoinCreateWithoutInputColumnInput
    | null;
  connect?: JoinWhereUniqueInput[] | JoinWhereUniqueInput | null;
}

export interface JoinCreateWithoutInputColumnInput {
  id?: ID_Input | null;
  sourceOwner?: String | null;
  sourceTable?: String | null;
  sourceColumn?: String | null;
  targetOwner?: String | null;
  targetTable?: String | null;
  targetColumn?: String | null;
}

export interface JoinScalarWhereInput {
  AND?: JoinScalarWhereInput[] | JoinScalarWhereInput | null;
  OR?: JoinScalarWhereInput[] | JoinScalarWhereInput | null;
  NOT?: JoinScalarWhereInput[] | JoinScalarWhereInput | null;
  id?: ID_Input | null;
  id_not?: ID_Input | null;
  id_in?: ID_Output[] | ID_Output | null;
  id_not_in?: ID_Output[] | ID_Output | null;
  id_lt?: ID_Input | null;
  id_lte?: ID_Input | null;
  id_gt?: ID_Input | null;
  id_gte?: ID_Input | null;
  id_contains?: ID_Input | null;
  id_not_contains?: ID_Input | null;
  id_starts_with?: ID_Input | null;
  id_not_starts_with?: ID_Input | null;
  id_ends_with?: ID_Input | null;
  id_not_ends_with?: ID_Input | null;
  sourceOwner?: String | null;
  sourceOwner_not?: String | null;
  sourceOwner_in?: String[] | String | null;
  sourceOwner_not_in?: String[] | String | null;
  sourceOwner_lt?: String | null;
  sourceOwner_lte?: String | null;
  sourceOwner_gt?: String | null;
  sourceOwner_gte?: String | null;
  sourceOwner_contains?: String | null;
  sourceOwner_not_contains?: String | null;
  sourceOwner_starts_with?: String | null;
  sourceOwner_not_starts_with?: String | null;
  sourceOwner_ends_with?: String | null;
  sourceOwner_not_ends_with?: String | null;
  sourceTable?: String | null;
  sourceTable_not?: String | null;
  sourceTable_in?: String[] | String | null;
  sourceTable_not_in?: String[] | String | null;
  sourceTable_lt?: String | null;
  sourceTable_lte?: String | null;
  sourceTable_gt?: String | null;
  sourceTable_gte?: String | null;
  sourceTable_contains?: String | null;
  sourceTable_not_contains?: String | null;
  sourceTable_starts_with?: String | null;
  sourceTable_not_starts_with?: String | null;
  sourceTable_ends_with?: String | null;
  sourceTable_not_ends_with?: String | null;
  sourceColumn?: String | null;
  sourceColumn_not?: String | null;
  sourceColumn_in?: String[] | String | null;
  sourceColumn_not_in?: String[] | String | null;
  sourceColumn_lt?: String | null;
  sourceColumn_lte?: String | null;
  sourceColumn_gt?: String | null;
  sourceColumn_gte?: String | null;
  sourceColumn_contains?: String | null;
  sourceColumn_not_contains?: String | null;
  sourceColumn_starts_with?: String | null;
  sourceColumn_not_starts_with?: String | null;
  sourceColumn_ends_with?: String | null;
  sourceColumn_not_ends_with?: String | null;
  targetOwner?: String | null;
  targetOwner_not?: String | null;
  targetOwner_in?: String[] | String | null;
  targetOwner_not_in?: String[] | String | null;
  targetOwner_lt?: String | null;
  targetOwner_lte?: String | null;
  targetOwner_gt?: String | null;
  targetOwner_gte?: String | null;
  targetOwner_contains?: String | null;
  targetOwner_not_contains?: String | null;
  targetOwner_starts_with?: String | null;
  targetOwner_not_starts_with?: String | null;
  targetOwner_ends_with?: String | null;
  targetOwner_not_ends_with?: String | null;
  targetTable?: String | null;
  targetTable_not?: String | null;
  targetTable_in?: String[] | String | null;
  targetTable_not_in?: String[] | String | null;
  targetTable_lt?: String | null;
  targetTable_lte?: String | null;
  targetTable_gt?: String | null;
  targetTable_gte?: String | null;
  targetTable_contains?: String | null;
  targetTable_not_contains?: String | null;
  targetTable_starts_with?: String | null;
  targetTable_not_starts_with?: String | null;
  targetTable_ends_with?: String | null;
  targetTable_not_ends_with?: String | null;
  targetColumn?: String | null;
  targetColumn_not?: String | null;
  targetColumn_in?: String[] | String | null;
  targetColumn_not_in?: String[] | String | null;
  targetColumn_lt?: String | null;
  targetColumn_lte?: String | null;
  targetColumn_gt?: String | null;
  targetColumn_gte?: String | null;
  targetColumn_contains?: String | null;
  targetColumn_not_contains?: String | null;
  targetColumn_starts_with?: String | null;
  targetColumn_not_starts_with?: String | null;
  targetColumn_ends_with?: String | null;
  targetColumn_not_ends_with?: String | null;
  updatedAt?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_in?: DateTime[] | DateTime | null;
  updatedAt_not_in?: DateTime[] | DateTime | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  createdAt?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_in?: DateTime[] | DateTime | null;
  createdAt_not_in?: DateTime[] | DateTime | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
}

export interface JoinSubscriptionWhereInput {
  AND?: JoinSubscriptionWhereInput[] | JoinSubscriptionWhereInput | null;
  OR?: JoinSubscriptionWhereInput[] | JoinSubscriptionWhereInput | null;
  NOT?: JoinSubscriptionWhereInput[] | JoinSubscriptionWhereInput | null;
  mutation_in?: MutationType[] | MutationType | null;
  updatedFields_contains?: String | null;
  updatedFields_contains_every?: String[] | String | null;
  updatedFields_contains_some?: String[] | String | null;
  node?: JoinWhereInput | null;
}

export interface JoinUpdateInput {
  sourceOwner?: String | null;
  sourceTable?: String | null;
  sourceColumn?: String | null;
  targetOwner?: String | null;
  targetTable?: String | null;
  targetColumn?: String | null;
  inputColumn?: InputColumnUpdateOneRequiredWithoutJoinsInput | null;
}

export interface JoinUpdateManyDataInput {
  sourceOwner?: String | null;
  sourceTable?: String | null;
  sourceColumn?: String | null;
  targetOwner?: String | null;
  targetTable?: String | null;
  targetColumn?: String | null;
}

export interface JoinUpdateManyMutationInput {
  sourceOwner?: String | null;
  sourceTable?: String | null;
  sourceColumn?: String | null;
  targetOwner?: String | null;
  targetTable?: String | null;
  targetColumn?: String | null;
}

export interface JoinUpdateManyWithoutInputColumnInput {
  create?:
    | JoinCreateWithoutInputColumnInput[]
    | JoinCreateWithoutInputColumnInput
    | null;
  connect?: JoinWhereUniqueInput[] | JoinWhereUniqueInput | null;
  set?: JoinWhereUniqueInput[] | JoinWhereUniqueInput | null;
  disconnect?: JoinWhereUniqueInput[] | JoinWhereUniqueInput | null;
  delete?: JoinWhereUniqueInput[] | JoinWhereUniqueInput | null;
  update?:
    | JoinUpdateWithWhereUniqueWithoutInputColumnInput[]
    | JoinUpdateWithWhereUniqueWithoutInputColumnInput
    | null;
  updateMany?:
    | JoinUpdateManyWithWhereNestedInput[]
    | JoinUpdateManyWithWhereNestedInput
    | null;
  deleteMany?: JoinScalarWhereInput[] | JoinScalarWhereInput | null;
  upsert?:
    | JoinUpsertWithWhereUniqueWithoutInputColumnInput[]
    | JoinUpsertWithWhereUniqueWithoutInputColumnInput
    | null;
}

export interface JoinUpdateManyWithWhereNestedInput {
  where: JoinScalarWhereInput;
  data: JoinUpdateManyDataInput;
}

export interface JoinUpdateWithoutInputColumnDataInput {
  sourceOwner?: String | null;
  sourceTable?: String | null;
  sourceColumn?: String | null;
  targetOwner?: String | null;
  targetTable?: String | null;
  targetColumn?: String | null;
}

export interface JoinUpdateWithWhereUniqueWithoutInputColumnInput {
  where: JoinWhereUniqueInput;
  data: JoinUpdateWithoutInputColumnDataInput;
}

export interface JoinUpsertWithWhereUniqueWithoutInputColumnInput {
  where: JoinWhereUniqueInput;
  update: JoinUpdateWithoutInputColumnDataInput;
  create: JoinCreateWithoutInputColumnInput;
}

export interface JoinWhereInput {
  AND?: JoinWhereInput[] | JoinWhereInput | null;
  OR?: JoinWhereInput[] | JoinWhereInput | null;
  NOT?: JoinWhereInput[] | JoinWhereInput | null;
  id?: ID_Input | null;
  id_not?: ID_Input | null;
  id_in?: ID_Output[] | ID_Output | null;
  id_not_in?: ID_Output[] | ID_Output | null;
  id_lt?: ID_Input | null;
  id_lte?: ID_Input | null;
  id_gt?: ID_Input | null;
  id_gte?: ID_Input | null;
  id_contains?: ID_Input | null;
  id_not_contains?: ID_Input | null;
  id_starts_with?: ID_Input | null;
  id_not_starts_with?: ID_Input | null;
  id_ends_with?: ID_Input | null;
  id_not_ends_with?: ID_Input | null;
  sourceOwner?: String | null;
  sourceOwner_not?: String | null;
  sourceOwner_in?: String[] | String | null;
  sourceOwner_not_in?: String[] | String | null;
  sourceOwner_lt?: String | null;
  sourceOwner_lte?: String | null;
  sourceOwner_gt?: String | null;
  sourceOwner_gte?: String | null;
  sourceOwner_contains?: String | null;
  sourceOwner_not_contains?: String | null;
  sourceOwner_starts_with?: String | null;
  sourceOwner_not_starts_with?: String | null;
  sourceOwner_ends_with?: String | null;
  sourceOwner_not_ends_with?: String | null;
  sourceTable?: String | null;
  sourceTable_not?: String | null;
  sourceTable_in?: String[] | String | null;
  sourceTable_not_in?: String[] | String | null;
  sourceTable_lt?: String | null;
  sourceTable_lte?: String | null;
  sourceTable_gt?: String | null;
  sourceTable_gte?: String | null;
  sourceTable_contains?: String | null;
  sourceTable_not_contains?: String | null;
  sourceTable_starts_with?: String | null;
  sourceTable_not_starts_with?: String | null;
  sourceTable_ends_with?: String | null;
  sourceTable_not_ends_with?: String | null;
  sourceColumn?: String | null;
  sourceColumn_not?: String | null;
  sourceColumn_in?: String[] | String | null;
  sourceColumn_not_in?: String[] | String | null;
  sourceColumn_lt?: String | null;
  sourceColumn_lte?: String | null;
  sourceColumn_gt?: String | null;
  sourceColumn_gte?: String | null;
  sourceColumn_contains?: String | null;
  sourceColumn_not_contains?: String | null;
  sourceColumn_starts_with?: String | null;
  sourceColumn_not_starts_with?: String | null;
  sourceColumn_ends_with?: String | null;
  sourceColumn_not_ends_with?: String | null;
  targetOwner?: String | null;
  targetOwner_not?: String | null;
  targetOwner_in?: String[] | String | null;
  targetOwner_not_in?: String[] | String | null;
  targetOwner_lt?: String | null;
  targetOwner_lte?: String | null;
  targetOwner_gt?: String | null;
  targetOwner_gte?: String | null;
  targetOwner_contains?: String | null;
  targetOwner_not_contains?: String | null;
  targetOwner_starts_with?: String | null;
  targetOwner_not_starts_with?: String | null;
  targetOwner_ends_with?: String | null;
  targetOwner_not_ends_with?: String | null;
  targetTable?: String | null;
  targetTable_not?: String | null;
  targetTable_in?: String[] | String | null;
  targetTable_not_in?: String[] | String | null;
  targetTable_lt?: String | null;
  targetTable_lte?: String | null;
  targetTable_gt?: String | null;
  targetTable_gte?: String | null;
  targetTable_contains?: String | null;
  targetTable_not_contains?: String | null;
  targetTable_starts_with?: String | null;
  targetTable_not_starts_with?: String | null;
  targetTable_ends_with?: String | null;
  targetTable_not_ends_with?: String | null;
  targetColumn?: String | null;
  targetColumn_not?: String | null;
  targetColumn_in?: String[] | String | null;
  targetColumn_not_in?: String[] | String | null;
  targetColumn_lt?: String | null;
  targetColumn_lte?: String | null;
  targetColumn_gt?: String | null;
  targetColumn_gte?: String | null;
  targetColumn_contains?: String | null;
  targetColumn_not_contains?: String | null;
  targetColumn_starts_with?: String | null;
  targetColumn_not_starts_with?: String | null;
  targetColumn_ends_with?: String | null;
  targetColumn_not_ends_with?: String | null;
  updatedAt?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_in?: DateTime[] | DateTime | null;
  updatedAt_not_in?: DateTime[] | DateTime | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  createdAt?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_in?: DateTime[] | DateTime | null;
  createdAt_not_in?: DateTime[] | DateTime | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
  inputColumn?: InputColumnWhereInput | null;
}

export interface JoinWhereUniqueInput {
  id?: ID_Input | null;
}

export interface ResourceCreateInput {
  id?: ID_Input | null;
  label?: String | null;
  fhirType: String;
  primaryKeyOwner?: String | null;
  primaryKeyTable?: String | null;
  primaryKeyColumn?: String | null;
  attributes?: AttributeCreateManyWithoutResourceInput | null;
  source: SourceCreateOneWithoutResourcesInput;
}

export interface ResourceCreateManyWithoutSourceInput {
  create?:
    | ResourceCreateWithoutSourceInput[]
    | ResourceCreateWithoutSourceInput
    | null;
  connect?: ResourceWhereUniqueInput[] | ResourceWhereUniqueInput | null;
}

export interface ResourceCreateOneWithoutAttributesInput {
  create?: ResourceCreateWithoutAttributesInput | null;
  connect?: ResourceWhereUniqueInput | null;
}

export interface ResourceCreateWithoutAttributesInput {
  id?: ID_Input | null;
  label?: String | null;
  fhirType: String;
  primaryKeyOwner?: String | null;
  primaryKeyTable?: String | null;
  primaryKeyColumn?: String | null;
  source: SourceCreateOneWithoutResourcesInput;
}

export interface ResourceCreateWithoutSourceInput {
  id?: ID_Input | null;
  label?: String | null;
  fhirType: String;
  primaryKeyOwner?: String | null;
  primaryKeyTable?: String | null;
  primaryKeyColumn?: String | null;
  attributes?: AttributeCreateManyWithoutResourceInput | null;
}

export interface ResourceScalarWhereInput {
  AND?: ResourceScalarWhereInput[] | ResourceScalarWhereInput | null;
  OR?: ResourceScalarWhereInput[] | ResourceScalarWhereInput | null;
  NOT?: ResourceScalarWhereInput[] | ResourceScalarWhereInput | null;
  id?: ID_Input | null;
  id_not?: ID_Input | null;
  id_in?: ID_Output[] | ID_Output | null;
  id_not_in?: ID_Output[] | ID_Output | null;
  id_lt?: ID_Input | null;
  id_lte?: ID_Input | null;
  id_gt?: ID_Input | null;
  id_gte?: ID_Input | null;
  id_contains?: ID_Input | null;
  id_not_contains?: ID_Input | null;
  id_starts_with?: ID_Input | null;
  id_not_starts_with?: ID_Input | null;
  id_ends_with?: ID_Input | null;
  id_not_ends_with?: ID_Input | null;
  label?: String | null;
  label_not?: String | null;
  label_in?: String[] | String | null;
  label_not_in?: String[] | String | null;
  label_lt?: String | null;
  label_lte?: String | null;
  label_gt?: String | null;
  label_gte?: String | null;
  label_contains?: String | null;
  label_not_contains?: String | null;
  label_starts_with?: String | null;
  label_not_starts_with?: String | null;
  label_ends_with?: String | null;
  label_not_ends_with?: String | null;
  fhirType?: String | null;
  fhirType_not?: String | null;
  fhirType_in?: String[] | String | null;
  fhirType_not_in?: String[] | String | null;
  fhirType_lt?: String | null;
  fhirType_lte?: String | null;
  fhirType_gt?: String | null;
  fhirType_gte?: String | null;
  fhirType_contains?: String | null;
  fhirType_not_contains?: String | null;
  fhirType_starts_with?: String | null;
  fhirType_not_starts_with?: String | null;
  fhirType_ends_with?: String | null;
  fhirType_not_ends_with?: String | null;
  primaryKeyOwner?: String | null;
  primaryKeyOwner_not?: String | null;
  primaryKeyOwner_in?: String[] | String | null;
  primaryKeyOwner_not_in?: String[] | String | null;
  primaryKeyOwner_lt?: String | null;
  primaryKeyOwner_lte?: String | null;
  primaryKeyOwner_gt?: String | null;
  primaryKeyOwner_gte?: String | null;
  primaryKeyOwner_contains?: String | null;
  primaryKeyOwner_not_contains?: String | null;
  primaryKeyOwner_starts_with?: String | null;
  primaryKeyOwner_not_starts_with?: String | null;
  primaryKeyOwner_ends_with?: String | null;
  primaryKeyOwner_not_ends_with?: String | null;
  primaryKeyTable?: String | null;
  primaryKeyTable_not?: String | null;
  primaryKeyTable_in?: String[] | String | null;
  primaryKeyTable_not_in?: String[] | String | null;
  primaryKeyTable_lt?: String | null;
  primaryKeyTable_lte?: String | null;
  primaryKeyTable_gt?: String | null;
  primaryKeyTable_gte?: String | null;
  primaryKeyTable_contains?: String | null;
  primaryKeyTable_not_contains?: String | null;
  primaryKeyTable_starts_with?: String | null;
  primaryKeyTable_not_starts_with?: String | null;
  primaryKeyTable_ends_with?: String | null;
  primaryKeyTable_not_ends_with?: String | null;
  primaryKeyColumn?: String | null;
  primaryKeyColumn_not?: String | null;
  primaryKeyColumn_in?: String[] | String | null;
  primaryKeyColumn_not_in?: String[] | String | null;
  primaryKeyColumn_lt?: String | null;
  primaryKeyColumn_lte?: String | null;
  primaryKeyColumn_gt?: String | null;
  primaryKeyColumn_gte?: String | null;
  primaryKeyColumn_contains?: String | null;
  primaryKeyColumn_not_contains?: String | null;
  primaryKeyColumn_starts_with?: String | null;
  primaryKeyColumn_not_starts_with?: String | null;
  primaryKeyColumn_ends_with?: String | null;
  primaryKeyColumn_not_ends_with?: String | null;
  updatedAt?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_in?: DateTime[] | DateTime | null;
  updatedAt_not_in?: DateTime[] | DateTime | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  createdAt?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_in?: DateTime[] | DateTime | null;
  createdAt_not_in?: DateTime[] | DateTime | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
}

export interface ResourceSubscriptionWhereInput {
  AND?:
    | ResourceSubscriptionWhereInput[]
    | ResourceSubscriptionWhereInput
    | null;
  OR?: ResourceSubscriptionWhereInput[] | ResourceSubscriptionWhereInput | null;
  NOT?:
    | ResourceSubscriptionWhereInput[]
    | ResourceSubscriptionWhereInput
    | null;
  mutation_in?: MutationType[] | MutationType | null;
  updatedFields_contains?: String | null;
  updatedFields_contains_every?: String[] | String | null;
  updatedFields_contains_some?: String[] | String | null;
  node?: ResourceWhereInput | null;
}

export interface ResourceUpdateInput {
  label?: String | null;
  fhirType?: String | null;
  primaryKeyOwner?: String | null;
  primaryKeyTable?: String | null;
  primaryKeyColumn?: String | null;
  attributes?: AttributeUpdateManyWithoutResourceInput | null;
  source?: SourceUpdateOneRequiredWithoutResourcesInput | null;
}

export interface ResourceUpdateManyDataInput {
  label?: String | null;
  fhirType?: String | null;
  primaryKeyOwner?: String | null;
  primaryKeyTable?: String | null;
  primaryKeyColumn?: String | null;
}

export interface ResourceUpdateManyMutationInput {
  label?: String | null;
  fhirType?: String | null;
  primaryKeyOwner?: String | null;
  primaryKeyTable?: String | null;
  primaryKeyColumn?: String | null;
}

export interface ResourceUpdateManyWithoutSourceInput {
  create?:
    | ResourceCreateWithoutSourceInput[]
    | ResourceCreateWithoutSourceInput
    | null;
  connect?: ResourceWhereUniqueInput[] | ResourceWhereUniqueInput | null;
  set?: ResourceWhereUniqueInput[] | ResourceWhereUniqueInput | null;
  disconnect?: ResourceWhereUniqueInput[] | ResourceWhereUniqueInput | null;
  delete?: ResourceWhereUniqueInput[] | ResourceWhereUniqueInput | null;
  update?:
    | ResourceUpdateWithWhereUniqueWithoutSourceInput[]
    | ResourceUpdateWithWhereUniqueWithoutSourceInput
    | null;
  updateMany?:
    | ResourceUpdateManyWithWhereNestedInput[]
    | ResourceUpdateManyWithWhereNestedInput
    | null;
  deleteMany?: ResourceScalarWhereInput[] | ResourceScalarWhereInput | null;
  upsert?:
    | ResourceUpsertWithWhereUniqueWithoutSourceInput[]
    | ResourceUpsertWithWhereUniqueWithoutSourceInput
    | null;
}

export interface ResourceUpdateManyWithWhereNestedInput {
  where: ResourceScalarWhereInput;
  data: ResourceUpdateManyDataInput;
}

export interface ResourceUpdateOneWithoutAttributesInput {
  create?: ResourceCreateWithoutAttributesInput | null;
  connect?: ResourceWhereUniqueInput | null;
  disconnect?: Boolean | null;
  delete?: Boolean | null;
  update?: ResourceUpdateWithoutAttributesDataInput | null;
  upsert?: ResourceUpsertWithoutAttributesInput | null;
}

export interface ResourceUpdateWithoutAttributesDataInput {
  label?: String | null;
  fhirType?: String | null;
  primaryKeyOwner?: String | null;
  primaryKeyTable?: String | null;
  primaryKeyColumn?: String | null;
  source?: SourceUpdateOneRequiredWithoutResourcesInput | null;
}

export interface ResourceUpdateWithoutSourceDataInput {
  label?: String | null;
  fhirType?: String | null;
  primaryKeyOwner?: String | null;
  primaryKeyTable?: String | null;
  primaryKeyColumn?: String | null;
  attributes?: AttributeUpdateManyWithoutResourceInput | null;
}

export interface ResourceUpdateWithWhereUniqueWithoutSourceInput {
  where: ResourceWhereUniqueInput;
  data: ResourceUpdateWithoutSourceDataInput;
}

export interface ResourceUpsertWithoutAttributesInput {
  update: ResourceUpdateWithoutAttributesDataInput;
  create: ResourceCreateWithoutAttributesInput;
}

export interface ResourceUpsertWithWhereUniqueWithoutSourceInput {
  where: ResourceWhereUniqueInput;
  update: ResourceUpdateWithoutSourceDataInput;
  create: ResourceCreateWithoutSourceInput;
}

export interface ResourceWhereInput {
  AND?: ResourceWhereInput[] | ResourceWhereInput | null;
  OR?: ResourceWhereInput[] | ResourceWhereInput | null;
  NOT?: ResourceWhereInput[] | ResourceWhereInput | null;
  id?: ID_Input | null;
  id_not?: ID_Input | null;
  id_in?: ID_Output[] | ID_Output | null;
  id_not_in?: ID_Output[] | ID_Output | null;
  id_lt?: ID_Input | null;
  id_lte?: ID_Input | null;
  id_gt?: ID_Input | null;
  id_gte?: ID_Input | null;
  id_contains?: ID_Input | null;
  id_not_contains?: ID_Input | null;
  id_starts_with?: ID_Input | null;
  id_not_starts_with?: ID_Input | null;
  id_ends_with?: ID_Input | null;
  id_not_ends_with?: ID_Input | null;
  label?: String | null;
  label_not?: String | null;
  label_in?: String[] | String | null;
  label_not_in?: String[] | String | null;
  label_lt?: String | null;
  label_lte?: String | null;
  label_gt?: String | null;
  label_gte?: String | null;
  label_contains?: String | null;
  label_not_contains?: String | null;
  label_starts_with?: String | null;
  label_not_starts_with?: String | null;
  label_ends_with?: String | null;
  label_not_ends_with?: String | null;
  fhirType?: String | null;
  fhirType_not?: String | null;
  fhirType_in?: String[] | String | null;
  fhirType_not_in?: String[] | String | null;
  fhirType_lt?: String | null;
  fhirType_lte?: String | null;
  fhirType_gt?: String | null;
  fhirType_gte?: String | null;
  fhirType_contains?: String | null;
  fhirType_not_contains?: String | null;
  fhirType_starts_with?: String | null;
  fhirType_not_starts_with?: String | null;
  fhirType_ends_with?: String | null;
  fhirType_not_ends_with?: String | null;
  primaryKeyOwner?: String | null;
  primaryKeyOwner_not?: String | null;
  primaryKeyOwner_in?: String[] | String | null;
  primaryKeyOwner_not_in?: String[] | String | null;
  primaryKeyOwner_lt?: String | null;
  primaryKeyOwner_lte?: String | null;
  primaryKeyOwner_gt?: String | null;
  primaryKeyOwner_gte?: String | null;
  primaryKeyOwner_contains?: String | null;
  primaryKeyOwner_not_contains?: String | null;
  primaryKeyOwner_starts_with?: String | null;
  primaryKeyOwner_not_starts_with?: String | null;
  primaryKeyOwner_ends_with?: String | null;
  primaryKeyOwner_not_ends_with?: String | null;
  primaryKeyTable?: String | null;
  primaryKeyTable_not?: String | null;
  primaryKeyTable_in?: String[] | String | null;
  primaryKeyTable_not_in?: String[] | String | null;
  primaryKeyTable_lt?: String | null;
  primaryKeyTable_lte?: String | null;
  primaryKeyTable_gt?: String | null;
  primaryKeyTable_gte?: String | null;
  primaryKeyTable_contains?: String | null;
  primaryKeyTable_not_contains?: String | null;
  primaryKeyTable_starts_with?: String | null;
  primaryKeyTable_not_starts_with?: String | null;
  primaryKeyTable_ends_with?: String | null;
  primaryKeyTable_not_ends_with?: String | null;
  primaryKeyColumn?: String | null;
  primaryKeyColumn_not?: String | null;
  primaryKeyColumn_in?: String[] | String | null;
  primaryKeyColumn_not_in?: String[] | String | null;
  primaryKeyColumn_lt?: String | null;
  primaryKeyColumn_lte?: String | null;
  primaryKeyColumn_gt?: String | null;
  primaryKeyColumn_gte?: String | null;
  primaryKeyColumn_contains?: String | null;
  primaryKeyColumn_not_contains?: String | null;
  primaryKeyColumn_starts_with?: String | null;
  primaryKeyColumn_not_starts_with?: String | null;
  primaryKeyColumn_ends_with?: String | null;
  primaryKeyColumn_not_ends_with?: String | null;
  updatedAt?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_in?: DateTime[] | DateTime | null;
  updatedAt_not_in?: DateTime[] | DateTime | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  createdAt?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_in?: DateTime[] | DateTime | null;
  createdAt_not_in?: DateTime[] | DateTime | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
  attributes_every?: AttributeWhereInput | null;
  attributes_some?: AttributeWhereInput | null;
  attributes_none?: AttributeWhereInput | null;
  source?: SourceWhereInput | null;
}

export interface ResourceWhereUniqueInput {
  id?: ID_Input | null;
}

export interface SourceCreateInput {
  id?: ID_Input | null;
  name: String;
  hasOwner?: Boolean | null;
  resources?: ResourceCreateManyWithoutSourceInput | null;
  credential?: CredentialCreateOneWithoutSourceInput | null;
}

export interface SourceCreateManyWithoutCredentialInput {
  create?:
    | SourceCreateWithoutCredentialInput[]
    | SourceCreateWithoutCredentialInput
    | null;
  connect?: SourceWhereUniqueInput[] | SourceWhereUniqueInput | null;
}

export interface SourceCreateOneWithoutResourcesInput {
  create?: SourceCreateWithoutResourcesInput | null;
  connect?: SourceWhereUniqueInput | null;
}

export interface SourceCreateWithoutCredentialInput {
  id?: ID_Input | null;
  name: String;
  hasOwner?: Boolean | null;
  resources?: ResourceCreateManyWithoutSourceInput | null;
}

export interface SourceCreateWithoutResourcesInput {
  id?: ID_Input | null;
  name: String;
  hasOwner?: Boolean | null;
  credential?: CredentialCreateOneWithoutSourceInput | null;
}

export interface SourceScalarWhereInput {
  AND?: SourceScalarWhereInput[] | SourceScalarWhereInput | null;
  OR?: SourceScalarWhereInput[] | SourceScalarWhereInput | null;
  NOT?: SourceScalarWhereInput[] | SourceScalarWhereInput | null;
  id?: ID_Input | null;
  id_not?: ID_Input | null;
  id_in?: ID_Output[] | ID_Output | null;
  id_not_in?: ID_Output[] | ID_Output | null;
  id_lt?: ID_Input | null;
  id_lte?: ID_Input | null;
  id_gt?: ID_Input | null;
  id_gte?: ID_Input | null;
  id_contains?: ID_Input | null;
  id_not_contains?: ID_Input | null;
  id_starts_with?: ID_Input | null;
  id_not_starts_with?: ID_Input | null;
  id_ends_with?: ID_Input | null;
  id_not_ends_with?: ID_Input | null;
  name?: String | null;
  name_not?: String | null;
  name_in?: String[] | String | null;
  name_not_in?: String[] | String | null;
  name_lt?: String | null;
  name_lte?: String | null;
  name_gt?: String | null;
  name_gte?: String | null;
  name_contains?: String | null;
  name_not_contains?: String | null;
  name_starts_with?: String | null;
  name_not_starts_with?: String | null;
  name_ends_with?: String | null;
  name_not_ends_with?: String | null;
  hasOwner?: Boolean | null;
  hasOwner_not?: Boolean | null;
  updatedAt?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_in?: DateTime[] | DateTime | null;
  updatedAt_not_in?: DateTime[] | DateTime | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  createdAt?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_in?: DateTime[] | DateTime | null;
  createdAt_not_in?: DateTime[] | DateTime | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
}

export interface SourceSubscriptionWhereInput {
  AND?: SourceSubscriptionWhereInput[] | SourceSubscriptionWhereInput | null;
  OR?: SourceSubscriptionWhereInput[] | SourceSubscriptionWhereInput | null;
  NOT?: SourceSubscriptionWhereInput[] | SourceSubscriptionWhereInput | null;
  mutation_in?: MutationType[] | MutationType | null;
  updatedFields_contains?: String | null;
  updatedFields_contains_every?: String[] | String | null;
  updatedFields_contains_some?: String[] | String | null;
  node?: SourceWhereInput | null;
}

export interface SourceUpdateInput {
  name?: String | null;
  hasOwner?: Boolean | null;
  resources?: ResourceUpdateManyWithoutSourceInput | null;
  credential?: CredentialUpdateOneWithoutSourceInput | null;
}

export interface SourceUpdateManyDataInput {
  name?: String | null;
  hasOwner?: Boolean | null;
}

export interface SourceUpdateManyMutationInput {
  name?: String | null;
  hasOwner?: Boolean | null;
}

export interface SourceUpdateManyWithoutCredentialInput {
  create?:
    | SourceCreateWithoutCredentialInput[]
    | SourceCreateWithoutCredentialInput
    | null;
  connect?: SourceWhereUniqueInput[] | SourceWhereUniqueInput | null;
  set?: SourceWhereUniqueInput[] | SourceWhereUniqueInput | null;
  disconnect?: SourceWhereUniqueInput[] | SourceWhereUniqueInput | null;
  delete?: SourceWhereUniqueInput[] | SourceWhereUniqueInput | null;
  update?:
    | SourceUpdateWithWhereUniqueWithoutCredentialInput[]
    | SourceUpdateWithWhereUniqueWithoutCredentialInput
    | null;
  updateMany?:
    | SourceUpdateManyWithWhereNestedInput[]
    | SourceUpdateManyWithWhereNestedInput
    | null;
  deleteMany?: SourceScalarWhereInput[] | SourceScalarWhereInput | null;
  upsert?:
    | SourceUpsertWithWhereUniqueWithoutCredentialInput[]
    | SourceUpsertWithWhereUniqueWithoutCredentialInput
    | null;
}

export interface SourceUpdateManyWithWhereNestedInput {
  where: SourceScalarWhereInput;
  data: SourceUpdateManyDataInput;
}

export interface SourceUpdateOneRequiredWithoutResourcesInput {
  create?: SourceCreateWithoutResourcesInput | null;
  connect?: SourceWhereUniqueInput | null;
  update?: SourceUpdateWithoutResourcesDataInput | null;
  upsert?: SourceUpsertWithoutResourcesInput | null;
}

export interface SourceUpdateWithoutCredentialDataInput {
  name?: String | null;
  hasOwner?: Boolean | null;
  resources?: ResourceUpdateManyWithoutSourceInput | null;
}

export interface SourceUpdateWithoutResourcesDataInput {
  name?: String | null;
  hasOwner?: Boolean | null;
  credential?: CredentialUpdateOneWithoutSourceInput | null;
}

export interface SourceUpdateWithWhereUniqueWithoutCredentialInput {
  where: SourceWhereUniqueInput;
  data: SourceUpdateWithoutCredentialDataInput;
}

export interface SourceUpsertWithoutResourcesInput {
  update: SourceUpdateWithoutResourcesDataInput;
  create: SourceCreateWithoutResourcesInput;
}

export interface SourceUpsertWithWhereUniqueWithoutCredentialInput {
  where: SourceWhereUniqueInput;
  update: SourceUpdateWithoutCredentialDataInput;
  create: SourceCreateWithoutCredentialInput;
}

export interface SourceWhereInput {
  AND?: SourceWhereInput[] | SourceWhereInput | null;
  OR?: SourceWhereInput[] | SourceWhereInput | null;
  NOT?: SourceWhereInput[] | SourceWhereInput | null;
  id?: ID_Input | null;
  id_not?: ID_Input | null;
  id_in?: ID_Output[] | ID_Output | null;
  id_not_in?: ID_Output[] | ID_Output | null;
  id_lt?: ID_Input | null;
  id_lte?: ID_Input | null;
  id_gt?: ID_Input | null;
  id_gte?: ID_Input | null;
  id_contains?: ID_Input | null;
  id_not_contains?: ID_Input | null;
  id_starts_with?: ID_Input | null;
  id_not_starts_with?: ID_Input | null;
  id_ends_with?: ID_Input | null;
  id_not_ends_with?: ID_Input | null;
  name?: String | null;
  name_not?: String | null;
  name_in?: String[] | String | null;
  name_not_in?: String[] | String | null;
  name_lt?: String | null;
  name_lte?: String | null;
  name_gt?: String | null;
  name_gte?: String | null;
  name_contains?: String | null;
  name_not_contains?: String | null;
  name_starts_with?: String | null;
  name_not_starts_with?: String | null;
  name_ends_with?: String | null;
  name_not_ends_with?: String | null;
  hasOwner?: Boolean | null;
  hasOwner_not?: Boolean | null;
  updatedAt?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_in?: DateTime[] | DateTime | null;
  updatedAt_not_in?: DateTime[] | DateTime | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  createdAt?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_in?: DateTime[] | DateTime | null;
  createdAt_not_in?: DateTime[] | DateTime | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
  resources_every?: ResourceWhereInput | null;
  resources_some?: ResourceWhereInput | null;
  resources_none?: ResourceWhereInput | null;
  credential?: CredentialWhereInput | null;
}

export interface SourceWhereUniqueInput {
  id?: ID_Input | null;
  name?: String | null;
}

export interface UserCreateInput {
  id?: ID_Input | null;
  email: String;
  name: String;
  password: String;
  role?: Role | null;
  credentials?: CredentialCreateManyInput | null;
}

export interface UserSubscriptionWhereInput {
  AND?: UserSubscriptionWhereInput[] | UserSubscriptionWhereInput | null;
  OR?: UserSubscriptionWhereInput[] | UserSubscriptionWhereInput | null;
  NOT?: UserSubscriptionWhereInput[] | UserSubscriptionWhereInput | null;
  mutation_in?: MutationType[] | MutationType | null;
  updatedFields_contains?: String | null;
  updatedFields_contains_every?: String[] | String | null;
  updatedFields_contains_some?: String[] | String | null;
  node?: UserWhereInput | null;
}

export interface UserUpdateInput {
  email?: String | null;
  name?: String | null;
  password?: String | null;
  role?: Role | null;
  credentials?: CredentialUpdateManyInput | null;
}

export interface UserUpdateManyMutationInput {
  email?: String | null;
  name?: String | null;
  password?: String | null;
  role?: Role | null;
}

export interface UserWhereInput {
  AND?: UserWhereInput[] | UserWhereInput | null;
  OR?: UserWhereInput[] | UserWhereInput | null;
  NOT?: UserWhereInput[] | UserWhereInput | null;
  id?: ID_Input | null;
  id_not?: ID_Input | null;
  id_in?: ID_Output[] | ID_Output | null;
  id_not_in?: ID_Output[] | ID_Output | null;
  id_lt?: ID_Input | null;
  id_lte?: ID_Input | null;
  id_gt?: ID_Input | null;
  id_gte?: ID_Input | null;
  id_contains?: ID_Input | null;
  id_not_contains?: ID_Input | null;
  id_starts_with?: ID_Input | null;
  id_not_starts_with?: ID_Input | null;
  id_ends_with?: ID_Input | null;
  id_not_ends_with?: ID_Input | null;
  email?: String | null;
  email_not?: String | null;
  email_in?: String[] | String | null;
  email_not_in?: String[] | String | null;
  email_lt?: String | null;
  email_lte?: String | null;
  email_gt?: String | null;
  email_gte?: String | null;
  email_contains?: String | null;
  email_not_contains?: String | null;
  email_starts_with?: String | null;
  email_not_starts_with?: String | null;
  email_ends_with?: String | null;
  email_not_ends_with?: String | null;
  name?: String | null;
  name_not?: String | null;
  name_in?: String[] | String | null;
  name_not_in?: String[] | String | null;
  name_lt?: String | null;
  name_lte?: String | null;
  name_gt?: String | null;
  name_gte?: String | null;
  name_contains?: String | null;
  name_not_contains?: String | null;
  name_starts_with?: String | null;
  name_not_starts_with?: String | null;
  name_ends_with?: String | null;
  name_not_ends_with?: String | null;
  password?: String | null;
  password_not?: String | null;
  password_in?: String[] | String | null;
  password_not_in?: String[] | String | null;
  password_lt?: String | null;
  password_lte?: String | null;
  password_gt?: String | null;
  password_gte?: String | null;
  password_contains?: String | null;
  password_not_contains?: String | null;
  password_starts_with?: String | null;
  password_not_starts_with?: String | null;
  password_ends_with?: String | null;
  password_not_ends_with?: String | null;
  role?: Role | null;
  role_not?: Role | null;
  role_in?: Role[] | Role | null;
  role_not_in?: Role[] | Role | null;
  updatedAt?: DateTime | null;
  updatedAt_not?: DateTime | null;
  updatedAt_in?: DateTime[] | DateTime | null;
  updatedAt_not_in?: DateTime[] | DateTime | null;
  updatedAt_lt?: DateTime | null;
  updatedAt_lte?: DateTime | null;
  updatedAt_gt?: DateTime | null;
  updatedAt_gte?: DateTime | null;
  createdAt?: DateTime | null;
  createdAt_not?: DateTime | null;
  createdAt_in?: DateTime[] | DateTime | null;
  createdAt_not_in?: DateTime[] | DateTime | null;
  createdAt_lt?: DateTime | null;
  createdAt_lte?: DateTime | null;
  createdAt_gt?: DateTime | null;
  createdAt_gte?: DateTime | null;
  credentials_every?: CredentialWhereInput | null;
  credentials_some?: CredentialWhereInput | null;
  credentials_none?: CredentialWhereInput | null;
}

export interface UserWhereUniqueInput {
  id?: ID_Input | null;
  email?: String | null;
}

/*
 * An object with an ID

 */
export interface Node {
  id: ID_Output;
}

export interface AggregateAttribute {
  count: Int;
}

export interface AggregateCredential {
  count: Int;
}

export interface AggregateInputColumn {
  count: Int;
}

export interface AggregateJoin {
  count: Int;
}

export interface AggregateResource {
  count: Int;
}

export interface AggregateSource {
  count: Int;
}

export interface AggregateUser {
  count: Int;
}

export interface Attribute extends Node {
  id: ID_Output;
  name: String;
  mergingScript?: String | null;
  isProfile?: Boolean | null;
  type?: String | null;
  comment?: String | null;
  depth?: Int | null;
  resource?: Resource | null;
  attributes?: Array<Attribute> | null;
  attribute?: Attribute | null;
  inputColumns?: Array<InputColumn> | null;
  updatedAt: DateTime;
  createdAt: DateTime;
}

/*
 * A connection to a list of items.

 */
export interface AttributeConnection {
  pageInfo: PageInfo;
  edges: Array<AttributeEdge | null>;
  aggregate: AggregateAttribute;
}

/*
 * An edge in a connection.

 */
export interface AttributeEdge {
  node: Attribute;
  cursor: String;
}

export interface AttributePreviousValues {
  id: ID_Output;
  name: String;
  mergingScript?: String | null;
  isProfile?: Boolean | null;
  type?: String | null;
  comment?: String | null;
  depth?: Int | null;
  updatedAt: DateTime;
  createdAt: DateTime;
}

export interface AttributeSubscriptionPayload {
  mutation: MutationType;
  node?: Attribute | null;
  updatedFields?: Array<String> | null;
  previousValues?: AttributePreviousValues | null;
}

export interface BatchPayload {
  count: Long;
}

export interface Credential extends Node {
  id: ID_Output;
  host: String;
  port: String;
  login: String;
  password?: String | null;
  type: DatabaseType;
  source?: Array<Source> | null;
}

/*
 * A connection to a list of items.

 */
export interface CredentialConnection {
  pageInfo: PageInfo;
  edges: Array<CredentialEdge | null>;
  aggregate: AggregateCredential;
}

/*
 * An edge in a connection.

 */
export interface CredentialEdge {
  node: Credential;
  cursor: String;
}

export interface CredentialPreviousValues {
  id: ID_Output;
  host: String;
  port: String;
  login: String;
  password?: String | null;
  type: DatabaseType;
}

export interface CredentialSubscriptionPayload {
  mutation: MutationType;
  node?: Credential | null;
  updatedFields?: Array<String> | null;
  previousValues?: CredentialPreviousValues | null;
}

export interface InputColumn extends Node {
  id: ID_Output;
  owner?: String | null;
  table?: String | null;
  column?: String | null;
  script?: String | null;
  staticValue?: String | null;
  joins?: Array<Join> | null;
  attribute: Attribute;
  updatedAt: DateTime;
  createdAt: DateTime;
}

/*
 * A connection to a list of items.

 */
export interface InputColumnConnection {
  pageInfo: PageInfo;
  edges: Array<InputColumnEdge | null>;
  aggregate: AggregateInputColumn;
}

/*
 * An edge in a connection.

 */
export interface InputColumnEdge {
  node: InputColumn;
  cursor: String;
}

export interface InputColumnPreviousValues {
  id: ID_Output;
  owner?: String | null;
  table?: String | null;
  column?: String | null;
  script?: String | null;
  staticValue?: String | null;
  updatedAt: DateTime;
  createdAt: DateTime;
}

export interface InputColumnSubscriptionPayload {
  mutation: MutationType;
  node?: InputColumn | null;
  updatedFields?: Array<String> | null;
  previousValues?: InputColumnPreviousValues | null;
}

export interface Join extends Node {
  id: ID_Output;
  sourceOwner?: String | null;
  sourceTable?: String | null;
  sourceColumn?: String | null;
  targetOwner?: String | null;
  targetTable?: String | null;
  targetColumn?: String | null;
  inputColumn: InputColumn;
  updatedAt: DateTime;
  createdAt: DateTime;
}

/*
 * A connection to a list of items.

 */
export interface JoinConnection {
  pageInfo: PageInfo;
  edges: Array<JoinEdge | null>;
  aggregate: AggregateJoin;
}

/*
 * An edge in a connection.

 */
export interface JoinEdge {
  node: Join;
  cursor: String;
}

export interface JoinPreviousValues {
  id: ID_Output;
  sourceOwner?: String | null;
  sourceTable?: String | null;
  sourceColumn?: String | null;
  targetOwner?: String | null;
  targetTable?: String | null;
  targetColumn?: String | null;
  updatedAt: DateTime;
  createdAt: DateTime;
}

export interface JoinSubscriptionPayload {
  mutation: MutationType;
  node?: Join | null;
  updatedFields?: Array<String> | null;
  previousValues?: JoinPreviousValues | null;
}

/*
 * Information about pagination in a connection.

 */
export interface PageInfo {
  hasNextPage: Boolean;
  hasPreviousPage: Boolean;
  startCursor?: String | null;
  endCursor?: String | null;
}

export interface Resource extends Node {
  id: ID_Output;
  label?: String | null;
  fhirType: String;
  primaryKeyOwner?: String | null;
  primaryKeyTable?: String | null;
  primaryKeyColumn?: String | null;
  attributes?: Array<Attribute> | null;
  source: Source;
  updatedAt: DateTime;
  createdAt: DateTime;
}

/*
 * A connection to a list of items.

 */
export interface ResourceConnection {
  pageInfo: PageInfo;
  edges: Array<ResourceEdge | null>;
  aggregate: AggregateResource;
}

/*
 * An edge in a connection.

 */
export interface ResourceEdge {
  node: Resource;
  cursor: String;
}

export interface ResourcePreviousValues {
  id: ID_Output;
  label?: String | null;
  fhirType: String;
  primaryKeyOwner?: String | null;
  primaryKeyTable?: String | null;
  primaryKeyColumn?: String | null;
  updatedAt: DateTime;
  createdAt: DateTime;
}

export interface ResourceSubscriptionPayload {
  mutation: MutationType;
  node?: Resource | null;
  updatedFields?: Array<String> | null;
  previousValues?: ResourcePreviousValues | null;
}

export interface Source extends Node {
  id: ID_Output;
  name: String;
  hasOwner: Boolean;
  resources?: Array<Resource> | null;
  updatedAt: DateTime;
  createdAt: DateTime;
  credential?: Credential | null;
}

/*
 * A connection to a list of items.

 */
export interface SourceConnection {
  pageInfo: PageInfo;
  edges: Array<SourceEdge | null>;
  aggregate: AggregateSource;
}

/*
 * An edge in a connection.

 */
export interface SourceEdge {
  node: Source;
  cursor: String;
}

export interface SourcePreviousValues {
  id: ID_Output;
  name: String;
  hasOwner: Boolean;
  updatedAt: DateTime;
  createdAt: DateTime;
}

export interface SourceSubscriptionPayload {
  mutation: MutationType;
  node?: Source | null;
  updatedFields?: Array<String> | null;
  previousValues?: SourcePreviousValues | null;
}

export interface User extends Node {
  id: ID_Output;
  email: String;
  name: String;
  password: String;
  role?: Role | null;
  updatedAt: DateTime;
  createdAt: DateTime;
  credentials?: Array<Credential> | null;
}

/*
 * A connection to a list of items.

 */
export interface UserConnection {
  pageInfo: PageInfo;
  edges: Array<UserEdge | null>;
  aggregate: AggregateUser;
}

/*
 * An edge in a connection.

 */
export interface UserEdge {
  node: User;
  cursor: String;
}

export interface UserPreviousValues {
  id: ID_Output;
  email: String;
  name: String;
  password: String;
  role?: Role | null;
  updatedAt: DateTime;
  createdAt: DateTime;
}

export interface UserSubscriptionPayload {
  mutation: MutationType;
  node?: User | null;
  updatedFields?: Array<String> | null;
  previousValues?: UserPreviousValues | null;
}

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean;

export type DateTime = Date | string;

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number;
export type ID_Output = string;

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
*/
export type Int = number;

/*
The `Long` scalar type represents non-fractional signed whole numeric values.
Long can represent values between -(2^63) and 2^63 - 1.
*/
export type Long = string;

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string;

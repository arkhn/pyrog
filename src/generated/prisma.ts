import { GraphQLResolveInfo, GraphQLSchema } from 'graphql'
import { IResolvers } from 'graphql-tools/dist/Interfaces'
import { Options } from 'graphql-binding'
import { makePrismaBindingClass, BasePrismaOptions } from 'prisma-binding'

export interface Query {
    databases: <T = Database[]>(args: { where?: DatabaseWhereInput, orderBy?: DatabaseOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    resources: <T = Resource[]>(args: { where?: ResourceWhereInput, orderBy?: ResourceOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    attributes: <T = Attribute[]>(args: { where?: AttributeWhereInput, orderBy?: AttributeOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    inputColumns: <T = InputColumn[]>(args: { where?: InputColumnWhereInput, orderBy?: InputColumnOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    joins: <T = Join[]>(args: { where?: JoinWhereInput, orderBy?: JoinOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    database: <T = Database | null>(args: { where: DatabaseWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    resource: <T = Resource | null>(args: { where: ResourceWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    attribute: <T = Attribute | null>(args: { where: AttributeWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    inputColumn: <T = InputColumn | null>(args: { where: InputColumnWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    join: <T = Join | null>(args: { where: JoinWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    databasesConnection: <T = DatabaseConnection>(args: { where?: DatabaseWhereInput, orderBy?: DatabaseOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    resourcesConnection: <T = ResourceConnection>(args: { where?: ResourceWhereInput, orderBy?: ResourceOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    attributesConnection: <T = AttributeConnection>(args: { where?: AttributeWhereInput, orderBy?: AttributeOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    inputColumnsConnection: <T = InputColumnConnection>(args: { where?: InputColumnWhereInput, orderBy?: InputColumnOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    joinsConnection: <T = JoinConnection>(args: { where?: JoinWhereInput, orderBy?: JoinOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    node: <T = Node | null>(args: { id: ID_Output }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Mutation {
    createDatabase: <T = Database>(args: { data: DatabaseCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createResource: <T = Resource>(args: { data: ResourceCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createAttribute: <T = Attribute>(args: { data: AttributeCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createInputColumn: <T = InputColumn>(args: { data: InputColumnCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createJoin: <T = Join>(args: { data: JoinCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateDatabase: <T = Database | null>(args: { data: DatabaseUpdateInput, where: DatabaseWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateResource: <T = Resource | null>(args: { data: ResourceUpdateInput, where: ResourceWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateAttribute: <T = Attribute | null>(args: { data: AttributeUpdateInput, where: AttributeWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateInputColumn: <T = InputColumn | null>(args: { data: InputColumnUpdateInput, where: InputColumnWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateJoin: <T = Join | null>(args: { data: JoinUpdateInput, where: JoinWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteDatabase: <T = Database | null>(args: { where: DatabaseWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteResource: <T = Resource | null>(args: { where: ResourceWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteAttribute: <T = Attribute | null>(args: { where: AttributeWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteInputColumn: <T = InputColumn | null>(args: { where: InputColumnWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteJoin: <T = Join | null>(args: { where: JoinWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    upsertDatabase: <T = Database>(args: { where: DatabaseWhereUniqueInput, create: DatabaseCreateInput, update: DatabaseUpdateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    upsertResource: <T = Resource>(args: { where: ResourceWhereUniqueInput, create: ResourceCreateInput, update: ResourceUpdateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    upsertAttribute: <T = Attribute>(args: { where: AttributeWhereUniqueInput, create: AttributeCreateInput, update: AttributeUpdateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    upsertInputColumn: <T = InputColumn>(args: { where: InputColumnWhereUniqueInput, create: InputColumnCreateInput, update: InputColumnUpdateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    upsertJoin: <T = Join>(args: { where: JoinWhereUniqueInput, create: JoinCreateInput, update: JoinUpdateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateManyDatabases: <T = BatchPayload>(args: { data: DatabaseUpdateManyMutationInput, where?: DatabaseWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateManyResources: <T = BatchPayload>(args: { data: ResourceUpdateManyMutationInput, where?: ResourceWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateManyAttributes: <T = BatchPayload>(args: { data: AttributeUpdateManyMutationInput, where?: AttributeWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateManyInputColumns: <T = BatchPayload>(args: { data: InputColumnUpdateManyMutationInput, where?: InputColumnWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateManyJoins: <T = BatchPayload>(args: { data: JoinUpdateManyMutationInput, where?: JoinWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteManyDatabases: <T = BatchPayload>(args: { where?: DatabaseWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteManyResources: <T = BatchPayload>(args: { where?: ResourceWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteManyAttributes: <T = BatchPayload>(args: { where?: AttributeWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteManyInputColumns: <T = BatchPayload>(args: { where?: InputColumnWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteManyJoins: <T = BatchPayload>(args: { where?: JoinWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Subscription {
    database: <T = DatabaseSubscriptionPayload | null>(args: { where?: DatabaseSubscriptionWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> ,
    resource: <T = ResourceSubscriptionPayload | null>(args: { where?: ResourceSubscriptionWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> ,
    attribute: <T = AttributeSubscriptionPayload | null>(args: { where?: AttributeSubscriptionWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> ,
    inputColumn: <T = InputColumnSubscriptionPayload | null>(args: { where?: InputColumnSubscriptionWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> ,
    join: <T = JoinSubscriptionPayload | null>(args: { where?: JoinSubscriptionWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> 
  }

export interface Exists {
  Database: (where?: DatabaseWhereInput) => Promise<boolean>
  Resource: (where?: ResourceWhereInput) => Promise<boolean>
  Attribute: (where?: AttributeWhereInput) => Promise<boolean>
  InputColumn: (where?: InputColumnWhereInput) => Promise<boolean>
  Join: (where?: JoinWhereInput) => Promise<boolean>
}

export interface Prisma {
  query: Query
  mutation: Mutation
  subscription: Subscription
  exists: Exists
  request: <T = any>(query: string, variables?: {[key: string]: any}) => Promise<T>
  delegate(operation: 'query' | 'mutation', fieldName: string, args: {
    [key: string]: any;
}, infoOrQuery?: GraphQLResolveInfo | string, options?: Options): Promise<any>;
delegateSubscription(fieldName: string, args?: {
    [key: string]: any;
}, infoOrQuery?: GraphQLResolveInfo | string, options?: Options): Promise<AsyncIterator<any>>;
getAbstractResolvers(filterSchema?: GraphQLSchema | string): IResolvers;
}

export interface BindingConstructor<T> {
  new(options: BasePrismaOptions): T
}
/**
 * Type Defs
*/

const typeDefs = `type AggregateAttribute {
  count: Int!
}

type AggregateDatabase {
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

  """
  The subscription event gets dispatched when it's listed in mutation_in
  """
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

type Database implements Node {
  id: ID!
  name: String!
  resources(where: ResourceWhereInput, orderBy: ResourceOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Resource!]
}

"""A connection to a list of items."""
type DatabaseConnection {
  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """A list of edges."""
  edges: [DatabaseEdge]!
  aggregate: AggregateDatabase!
}

input DatabaseCreateInput {
  name: String!
  resources: ResourceCreateManyWithoutDatabaseInput
}

input DatabaseCreateOneWithoutResourcesInput {
  create: DatabaseCreateWithoutResourcesInput
  connect: DatabaseWhereUniqueInput
}

input DatabaseCreateWithoutResourcesInput {
  name: String!
}

"""An edge in a connection."""
type DatabaseEdge {
  """The item at the end of the edge."""
  node: Database!

  """A cursor for use in pagination."""
  cursor: String!
}

enum DatabaseOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type DatabasePreviousValues {
  id: ID!
  name: String!
}

type DatabaseSubscriptionPayload {
  mutation: MutationType!
  node: Database
  updatedFields: [String!]
  previousValues: DatabasePreviousValues
}

input DatabaseSubscriptionWhereInput {
  """Logical AND on all given filters."""
  AND: [DatabaseSubscriptionWhereInput!]

  """Logical OR on all given filters."""
  OR: [DatabaseSubscriptionWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [DatabaseSubscriptionWhereInput!]

  """
  The subscription event gets dispatched when it's listed in mutation_in
  """
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
  node: DatabaseWhereInput
}

input DatabaseUpdateInput {
  name: String
  resources: ResourceUpdateManyWithoutDatabaseInput
}

input DatabaseUpdateManyMutationInput {
  name: String
}

input DatabaseUpdateOneRequiredWithoutResourcesInput {
  create: DatabaseCreateWithoutResourcesInput
  connect: DatabaseWhereUniqueInput
  update: DatabaseUpdateWithoutResourcesDataInput
  upsert: DatabaseUpsertWithoutResourcesInput
}

input DatabaseUpdateWithoutResourcesDataInput {
  name: String
}

input DatabaseUpsertWithoutResourcesInput {
  update: DatabaseUpdateWithoutResourcesDataInput!
  create: DatabaseCreateWithoutResourcesInput!
}

input DatabaseWhereInput {
  """Logical AND on all given filters."""
  AND: [DatabaseWhereInput!]

  """Logical OR on all given filters."""
  OR: [DatabaseWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [DatabaseWhereInput!]
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
  resources_every: ResourceWhereInput
  resources_some: ResourceWhereInput
  resources_none: ResourceWhereInput
}

input DatabaseWhereUniqueInput {
  id: ID
  name: String
}

type InputColumn implements Node {
  id: ID!
  owner: String
  table: String
  column: String
  script: String
  staticValue: String
  joins(where: JoinWhereInput, orderBy: JoinOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Join!]
  attribute: Attribute!
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
  owner: String
  table: String
  column: String
  script: String
  staticValue: String
  joins: JoinCreateManyWithoutInputColumnInput
}

input InputColumnCreateWithoutJoinsInput {
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

  """
  The subscription event gets dispatched when it's listed in mutation_in
  """
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

  """
  The subscription event gets dispatched when it's listed in mutation_in
  """
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
  createDatabase(data: DatabaseCreateInput!): Database!
  createResource(data: ResourceCreateInput!): Resource!
  createAttribute(data: AttributeCreateInput!): Attribute!
  createInputColumn(data: InputColumnCreateInput!): InputColumn!
  createJoin(data: JoinCreateInput!): Join!
  updateDatabase(data: DatabaseUpdateInput!, where: DatabaseWhereUniqueInput!): Database
  updateResource(data: ResourceUpdateInput!, where: ResourceWhereUniqueInput!): Resource
  updateAttribute(data: AttributeUpdateInput!, where: AttributeWhereUniqueInput!): Attribute
  updateInputColumn(data: InputColumnUpdateInput!, where: InputColumnWhereUniqueInput!): InputColumn
  updateJoin(data: JoinUpdateInput!, where: JoinWhereUniqueInput!): Join
  deleteDatabase(where: DatabaseWhereUniqueInput!): Database
  deleteResource(where: ResourceWhereUniqueInput!): Resource
  deleteAttribute(where: AttributeWhereUniqueInput!): Attribute
  deleteInputColumn(where: InputColumnWhereUniqueInput!): InputColumn
  deleteJoin(where: JoinWhereUniqueInput!): Join
  upsertDatabase(where: DatabaseWhereUniqueInput!, create: DatabaseCreateInput!, update: DatabaseUpdateInput!): Database!
  upsertResource(where: ResourceWhereUniqueInput!, create: ResourceCreateInput!, update: ResourceUpdateInput!): Resource!
  upsertAttribute(where: AttributeWhereUniqueInput!, create: AttributeCreateInput!, update: AttributeUpdateInput!): Attribute!
  upsertInputColumn(where: InputColumnWhereUniqueInput!, create: InputColumnCreateInput!, update: InputColumnUpdateInput!): InputColumn!
  upsertJoin(where: JoinWhereUniqueInput!, create: JoinCreateInput!, update: JoinUpdateInput!): Join!
  updateManyDatabases(data: DatabaseUpdateManyMutationInput!, where: DatabaseWhereInput): BatchPayload!
  updateManyResources(data: ResourceUpdateManyMutationInput!, where: ResourceWhereInput): BatchPayload!
  updateManyAttributes(data: AttributeUpdateManyMutationInput!, where: AttributeWhereInput): BatchPayload!
  updateManyInputColumns(data: InputColumnUpdateManyMutationInput!, where: InputColumnWhereInput): BatchPayload!
  updateManyJoins(data: JoinUpdateManyMutationInput!, where: JoinWhereInput): BatchPayload!
  deleteManyDatabases(where: DatabaseWhereInput): BatchPayload!
  deleteManyResources(where: ResourceWhereInput): BatchPayload!
  deleteManyAttributes(where: AttributeWhereInput): BatchPayload!
  deleteManyInputColumns(where: InputColumnWhereInput): BatchPayload!
  deleteManyJoins(where: JoinWhereInput): BatchPayload!
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
  databases(where: DatabaseWhereInput, orderBy: DatabaseOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Database]!
  resources(where: ResourceWhereInput, orderBy: ResourceOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Resource]!
  attributes(where: AttributeWhereInput, orderBy: AttributeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Attribute]!
  inputColumns(where: InputColumnWhereInput, orderBy: InputColumnOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [InputColumn]!
  joins(where: JoinWhereInput, orderBy: JoinOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Join]!
  database(where: DatabaseWhereUniqueInput!): Database
  resource(where: ResourceWhereUniqueInput!): Resource
  attribute(where: AttributeWhereUniqueInput!): Attribute
  inputColumn(where: InputColumnWhereUniqueInput!): InputColumn
  join(where: JoinWhereUniqueInput!): Join
  databasesConnection(where: DatabaseWhereInput, orderBy: DatabaseOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): DatabaseConnection!
  resourcesConnection(where: ResourceWhereInput, orderBy: ResourceOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ResourceConnection!
  attributesConnection(where: AttributeWhereInput, orderBy: AttributeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): AttributeConnection!
  inputColumnsConnection(where: InputColumnWhereInput, orderBy: InputColumnOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): InputColumnConnection!
  joinsConnection(where: JoinWhereInput, orderBy: JoinOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): JoinConnection!

  """Fetches an object given its ID"""
  node(
    """The ID of an object"""
    id: ID!
  ): Node
}

type Resource implements Node {
  id: ID!
  name: String!
  primaryKeyOwner: String
  primaryKeyTable: String
  primaryKeyColumn: String
  attributes(where: AttributeWhereInput, orderBy: AttributeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Attribute!]
  database: Database!
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
  name: String!
  primaryKeyOwner: String
  primaryKeyTable: String
  primaryKeyColumn: String
  attributes: AttributeCreateManyWithoutResourceInput
  database: DatabaseCreateOneWithoutResourcesInput!
}

input ResourceCreateManyWithoutDatabaseInput {
  create: [ResourceCreateWithoutDatabaseInput!]
  connect: [ResourceWhereUniqueInput!]
}

input ResourceCreateOneWithoutAttributesInput {
  create: ResourceCreateWithoutAttributesInput
  connect: ResourceWhereUniqueInput
}

input ResourceCreateWithoutAttributesInput {
  name: String!
  primaryKeyOwner: String
  primaryKeyTable: String
  primaryKeyColumn: String
  database: DatabaseCreateOneWithoutResourcesInput!
}

input ResourceCreateWithoutDatabaseInput {
  name: String!
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
  name_ASC
  name_DESC
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
  name: String!
  primaryKeyOwner: String
  primaryKeyTable: String
  primaryKeyColumn: String
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

  """
  The subscription event gets dispatched when it's listed in mutation_in
  """
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
  name: String
  primaryKeyOwner: String
  primaryKeyTable: String
  primaryKeyColumn: String
  attributes: AttributeUpdateManyWithoutResourceInput
  database: DatabaseUpdateOneRequiredWithoutResourcesInput
}

input ResourceUpdateManyDataInput {
  name: String
  primaryKeyOwner: String
  primaryKeyTable: String
  primaryKeyColumn: String
}

input ResourceUpdateManyMutationInput {
  name: String
  primaryKeyOwner: String
  primaryKeyTable: String
  primaryKeyColumn: String
}

input ResourceUpdateManyWithoutDatabaseInput {
  create: [ResourceCreateWithoutDatabaseInput!]
  connect: [ResourceWhereUniqueInput!]
  disconnect: [ResourceWhereUniqueInput!]
  delete: [ResourceWhereUniqueInput!]
  update: [ResourceUpdateWithWhereUniqueWithoutDatabaseInput!]
  updateMany: [ResourceUpdateManyWithWhereNestedInput!]
  deleteMany: [ResourceScalarWhereInput!]
  upsert: [ResourceUpsertWithWhereUniqueWithoutDatabaseInput!]
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
  name: String
  primaryKeyOwner: String
  primaryKeyTable: String
  primaryKeyColumn: String
  database: DatabaseUpdateOneRequiredWithoutResourcesInput
}

input ResourceUpdateWithoutDatabaseDataInput {
  name: String
  primaryKeyOwner: String
  primaryKeyTable: String
  primaryKeyColumn: String
  attributes: AttributeUpdateManyWithoutResourceInput
}

input ResourceUpdateWithWhereUniqueWithoutDatabaseInput {
  where: ResourceWhereUniqueInput!
  data: ResourceUpdateWithoutDatabaseDataInput!
}

input ResourceUpsertWithoutAttributesInput {
  update: ResourceUpdateWithoutAttributesDataInput!
  create: ResourceCreateWithoutAttributesInput!
}

input ResourceUpsertWithWhereUniqueWithoutDatabaseInput {
  where: ResourceWhereUniqueInput!
  update: ResourceUpdateWithoutDatabaseDataInput!
  create: ResourceCreateWithoutDatabaseInput!
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
  attributes_every: AttributeWhereInput
  attributes_some: AttributeWhereInput
  attributes_none: AttributeWhereInput
  database: DatabaseWhereInput
}

input ResourceWhereUniqueInput {
  id: ID
}

type Subscription {
  database(where: DatabaseSubscriptionWhereInput): DatabaseSubscriptionPayload
  resource(where: ResourceSubscriptionWhereInput): ResourceSubscriptionPayload
  attribute(where: AttributeSubscriptionWhereInput): AttributeSubscriptionPayload
  inputColumn(where: InputColumnSubscriptionWhereInput): InputColumnSubscriptionPayload
  join(where: JoinSubscriptionWhereInput): JoinSubscriptionPayload
}
`

export const Prisma = makePrismaBindingClass<BindingConstructor<Prisma>>({typeDefs})

/**
 * Types
*/

export type DatabaseOrderByInput =   'id_ASC' |
  'id_DESC' |
  'name_ASC' |
  'name_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'createdAt_ASC' |
  'createdAt_DESC'

export type ResourceOrderByInput =   'id_ASC' |
  'id_DESC' |
  'name_ASC' |
  'name_DESC' |
  'primaryKeyOwner_ASC' |
  'primaryKeyOwner_DESC' |
  'primaryKeyTable_ASC' |
  'primaryKeyTable_DESC' |
  'primaryKeyColumn_ASC' |
  'primaryKeyColumn_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'createdAt_ASC' |
  'createdAt_DESC'

export type AttributeOrderByInput =   'id_ASC' |
  'id_DESC' |
  'name_ASC' |
  'name_DESC' |
  'mergingScript_ASC' |
  'mergingScript_DESC' |
  'isProfile_ASC' |
  'isProfile_DESC' |
  'type_ASC' |
  'type_DESC' |
  'comment_ASC' |
  'comment_DESC' |
  'depth_ASC' |
  'depth_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'createdAt_ASC' |
  'createdAt_DESC'

export type InputColumnOrderByInput =   'id_ASC' |
  'id_DESC' |
  'owner_ASC' |
  'owner_DESC' |
  'table_ASC' |
  'table_DESC' |
  'column_ASC' |
  'column_DESC' |
  'script_ASC' |
  'script_DESC' |
  'staticValue_ASC' |
  'staticValue_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'createdAt_ASC' |
  'createdAt_DESC'

export type JoinOrderByInput =   'id_ASC' |
  'id_DESC' |
  'sourceOwner_ASC' |
  'sourceOwner_DESC' |
  'sourceTable_ASC' |
  'sourceTable_DESC' |
  'sourceColumn_ASC' |
  'sourceColumn_DESC' |
  'targetOwner_ASC' |
  'targetOwner_DESC' |
  'targetTable_ASC' |
  'targetTable_DESC' |
  'targetColumn_ASC' |
  'targetColumn_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'createdAt_ASC' |
  'createdAt_DESC'

export type MutationType =   'CREATED' |
  'UPDATED' |
  'DELETED'

export interface DatabaseWhereInput {
  AND?: DatabaseWhereInput[] | DatabaseWhereInput
  OR?: DatabaseWhereInput[] | DatabaseWhereInput
  NOT?: DatabaseWhereInput[] | DatabaseWhereInput
  id?: ID_Input
  id_not?: ID_Input
  id_in?: ID_Input[] | ID_Input
  id_not_in?: ID_Input[] | ID_Input
  id_lt?: ID_Input
  id_lte?: ID_Input
  id_gt?: ID_Input
  id_gte?: ID_Input
  id_contains?: ID_Input
  id_not_contains?: ID_Input
  id_starts_with?: ID_Input
  id_not_starts_with?: ID_Input
  id_ends_with?: ID_Input
  id_not_ends_with?: ID_Input
  name?: String
  name_not?: String
  name_in?: String[] | String
  name_not_in?: String[] | String
  name_lt?: String
  name_lte?: String
  name_gt?: String
  name_gte?: String
  name_contains?: String
  name_not_contains?: String
  name_starts_with?: String
  name_not_starts_with?: String
  name_ends_with?: String
  name_not_ends_with?: String
  resources_every?: ResourceWhereInput
  resources_some?: ResourceWhereInput
  resources_none?: ResourceWhereInput
}

export interface ResourceWhereInput {
  AND?: ResourceWhereInput[] | ResourceWhereInput
  OR?: ResourceWhereInput[] | ResourceWhereInput
  NOT?: ResourceWhereInput[] | ResourceWhereInput
  id?: ID_Input
  id_not?: ID_Input
  id_in?: ID_Input[] | ID_Input
  id_not_in?: ID_Input[] | ID_Input
  id_lt?: ID_Input
  id_lte?: ID_Input
  id_gt?: ID_Input
  id_gte?: ID_Input
  id_contains?: ID_Input
  id_not_contains?: ID_Input
  id_starts_with?: ID_Input
  id_not_starts_with?: ID_Input
  id_ends_with?: ID_Input
  id_not_ends_with?: ID_Input
  name?: String
  name_not?: String
  name_in?: String[] | String
  name_not_in?: String[] | String
  name_lt?: String
  name_lte?: String
  name_gt?: String
  name_gte?: String
  name_contains?: String
  name_not_contains?: String
  name_starts_with?: String
  name_not_starts_with?: String
  name_ends_with?: String
  name_not_ends_with?: String
  primaryKeyOwner?: String
  primaryKeyOwner_not?: String
  primaryKeyOwner_in?: String[] | String
  primaryKeyOwner_not_in?: String[] | String
  primaryKeyOwner_lt?: String
  primaryKeyOwner_lte?: String
  primaryKeyOwner_gt?: String
  primaryKeyOwner_gte?: String
  primaryKeyOwner_contains?: String
  primaryKeyOwner_not_contains?: String
  primaryKeyOwner_starts_with?: String
  primaryKeyOwner_not_starts_with?: String
  primaryKeyOwner_ends_with?: String
  primaryKeyOwner_not_ends_with?: String
  primaryKeyTable?: String
  primaryKeyTable_not?: String
  primaryKeyTable_in?: String[] | String
  primaryKeyTable_not_in?: String[] | String
  primaryKeyTable_lt?: String
  primaryKeyTable_lte?: String
  primaryKeyTable_gt?: String
  primaryKeyTable_gte?: String
  primaryKeyTable_contains?: String
  primaryKeyTable_not_contains?: String
  primaryKeyTable_starts_with?: String
  primaryKeyTable_not_starts_with?: String
  primaryKeyTable_ends_with?: String
  primaryKeyTable_not_ends_with?: String
  primaryKeyColumn?: String
  primaryKeyColumn_not?: String
  primaryKeyColumn_in?: String[] | String
  primaryKeyColumn_not_in?: String[] | String
  primaryKeyColumn_lt?: String
  primaryKeyColumn_lte?: String
  primaryKeyColumn_gt?: String
  primaryKeyColumn_gte?: String
  primaryKeyColumn_contains?: String
  primaryKeyColumn_not_contains?: String
  primaryKeyColumn_starts_with?: String
  primaryKeyColumn_not_starts_with?: String
  primaryKeyColumn_ends_with?: String
  primaryKeyColumn_not_ends_with?: String
  attributes_every?: AttributeWhereInput
  attributes_some?: AttributeWhereInput
  attributes_none?: AttributeWhereInput
  database?: DatabaseWhereInput
}

export interface AttributeWhereInput {
  AND?: AttributeWhereInput[] | AttributeWhereInput
  OR?: AttributeWhereInput[] | AttributeWhereInput
  NOT?: AttributeWhereInput[] | AttributeWhereInput
  id?: ID_Input
  id_not?: ID_Input
  id_in?: ID_Input[] | ID_Input
  id_not_in?: ID_Input[] | ID_Input
  id_lt?: ID_Input
  id_lte?: ID_Input
  id_gt?: ID_Input
  id_gte?: ID_Input
  id_contains?: ID_Input
  id_not_contains?: ID_Input
  id_starts_with?: ID_Input
  id_not_starts_with?: ID_Input
  id_ends_with?: ID_Input
  id_not_ends_with?: ID_Input
  name?: String
  name_not?: String
  name_in?: String[] | String
  name_not_in?: String[] | String
  name_lt?: String
  name_lte?: String
  name_gt?: String
  name_gte?: String
  name_contains?: String
  name_not_contains?: String
  name_starts_with?: String
  name_not_starts_with?: String
  name_ends_with?: String
  name_not_ends_with?: String
  mergingScript?: String
  mergingScript_not?: String
  mergingScript_in?: String[] | String
  mergingScript_not_in?: String[] | String
  mergingScript_lt?: String
  mergingScript_lte?: String
  mergingScript_gt?: String
  mergingScript_gte?: String
  mergingScript_contains?: String
  mergingScript_not_contains?: String
  mergingScript_starts_with?: String
  mergingScript_not_starts_with?: String
  mergingScript_ends_with?: String
  mergingScript_not_ends_with?: String
  isProfile?: Boolean
  isProfile_not?: Boolean
  type?: String
  type_not?: String
  type_in?: String[] | String
  type_not_in?: String[] | String
  type_lt?: String
  type_lte?: String
  type_gt?: String
  type_gte?: String
  type_contains?: String
  type_not_contains?: String
  type_starts_with?: String
  type_not_starts_with?: String
  type_ends_with?: String
  type_not_ends_with?: String
  comment?: String
  comment_not?: String
  comment_in?: String[] | String
  comment_not_in?: String[] | String
  comment_lt?: String
  comment_lte?: String
  comment_gt?: String
  comment_gte?: String
  comment_contains?: String
  comment_not_contains?: String
  comment_starts_with?: String
  comment_not_starts_with?: String
  comment_ends_with?: String
  comment_not_ends_with?: String
  depth?: Int
  depth_not?: Int
  depth_in?: Int[] | Int
  depth_not_in?: Int[] | Int
  depth_lt?: Int
  depth_lte?: Int
  depth_gt?: Int
  depth_gte?: Int
  resource?: ResourceWhereInput
  attributes_every?: AttributeWhereInput
  attributes_some?: AttributeWhereInput
  attributes_none?: AttributeWhereInput
  attribute?: AttributeWhereInput
  inputColumns_every?: InputColumnWhereInput
  inputColumns_some?: InputColumnWhereInput
  inputColumns_none?: InputColumnWhereInput
}

export interface InputColumnWhereInput {
  AND?: InputColumnWhereInput[] | InputColumnWhereInput
  OR?: InputColumnWhereInput[] | InputColumnWhereInput
  NOT?: InputColumnWhereInput[] | InputColumnWhereInput
  id?: ID_Input
  id_not?: ID_Input
  id_in?: ID_Input[] | ID_Input
  id_not_in?: ID_Input[] | ID_Input
  id_lt?: ID_Input
  id_lte?: ID_Input
  id_gt?: ID_Input
  id_gte?: ID_Input
  id_contains?: ID_Input
  id_not_contains?: ID_Input
  id_starts_with?: ID_Input
  id_not_starts_with?: ID_Input
  id_ends_with?: ID_Input
  id_not_ends_with?: ID_Input
  owner?: String
  owner_not?: String
  owner_in?: String[] | String
  owner_not_in?: String[] | String
  owner_lt?: String
  owner_lte?: String
  owner_gt?: String
  owner_gte?: String
  owner_contains?: String
  owner_not_contains?: String
  owner_starts_with?: String
  owner_not_starts_with?: String
  owner_ends_with?: String
  owner_not_ends_with?: String
  table?: String
  table_not?: String
  table_in?: String[] | String
  table_not_in?: String[] | String
  table_lt?: String
  table_lte?: String
  table_gt?: String
  table_gte?: String
  table_contains?: String
  table_not_contains?: String
  table_starts_with?: String
  table_not_starts_with?: String
  table_ends_with?: String
  table_not_ends_with?: String
  column?: String
  column_not?: String
  column_in?: String[] | String
  column_not_in?: String[] | String
  column_lt?: String
  column_lte?: String
  column_gt?: String
  column_gte?: String
  column_contains?: String
  column_not_contains?: String
  column_starts_with?: String
  column_not_starts_with?: String
  column_ends_with?: String
  column_not_ends_with?: String
  script?: String
  script_not?: String
  script_in?: String[] | String
  script_not_in?: String[] | String
  script_lt?: String
  script_lte?: String
  script_gt?: String
  script_gte?: String
  script_contains?: String
  script_not_contains?: String
  script_starts_with?: String
  script_not_starts_with?: String
  script_ends_with?: String
  script_not_ends_with?: String
  staticValue?: String
  staticValue_not?: String
  staticValue_in?: String[] | String
  staticValue_not_in?: String[] | String
  staticValue_lt?: String
  staticValue_lte?: String
  staticValue_gt?: String
  staticValue_gte?: String
  staticValue_contains?: String
  staticValue_not_contains?: String
  staticValue_starts_with?: String
  staticValue_not_starts_with?: String
  staticValue_ends_with?: String
  staticValue_not_ends_with?: String
  joins_every?: JoinWhereInput
  joins_some?: JoinWhereInput
  joins_none?: JoinWhereInput
  attribute?: AttributeWhereInput
}

export interface JoinWhereInput {
  AND?: JoinWhereInput[] | JoinWhereInput
  OR?: JoinWhereInput[] | JoinWhereInput
  NOT?: JoinWhereInput[] | JoinWhereInput
  id?: ID_Input
  id_not?: ID_Input
  id_in?: ID_Input[] | ID_Input
  id_not_in?: ID_Input[] | ID_Input
  id_lt?: ID_Input
  id_lte?: ID_Input
  id_gt?: ID_Input
  id_gte?: ID_Input
  id_contains?: ID_Input
  id_not_contains?: ID_Input
  id_starts_with?: ID_Input
  id_not_starts_with?: ID_Input
  id_ends_with?: ID_Input
  id_not_ends_with?: ID_Input
  sourceOwner?: String
  sourceOwner_not?: String
  sourceOwner_in?: String[] | String
  sourceOwner_not_in?: String[] | String
  sourceOwner_lt?: String
  sourceOwner_lte?: String
  sourceOwner_gt?: String
  sourceOwner_gte?: String
  sourceOwner_contains?: String
  sourceOwner_not_contains?: String
  sourceOwner_starts_with?: String
  sourceOwner_not_starts_with?: String
  sourceOwner_ends_with?: String
  sourceOwner_not_ends_with?: String
  sourceTable?: String
  sourceTable_not?: String
  sourceTable_in?: String[] | String
  sourceTable_not_in?: String[] | String
  sourceTable_lt?: String
  sourceTable_lte?: String
  sourceTable_gt?: String
  sourceTable_gte?: String
  sourceTable_contains?: String
  sourceTable_not_contains?: String
  sourceTable_starts_with?: String
  sourceTable_not_starts_with?: String
  sourceTable_ends_with?: String
  sourceTable_not_ends_with?: String
  sourceColumn?: String
  sourceColumn_not?: String
  sourceColumn_in?: String[] | String
  sourceColumn_not_in?: String[] | String
  sourceColumn_lt?: String
  sourceColumn_lte?: String
  sourceColumn_gt?: String
  sourceColumn_gte?: String
  sourceColumn_contains?: String
  sourceColumn_not_contains?: String
  sourceColumn_starts_with?: String
  sourceColumn_not_starts_with?: String
  sourceColumn_ends_with?: String
  sourceColumn_not_ends_with?: String
  targetOwner?: String
  targetOwner_not?: String
  targetOwner_in?: String[] | String
  targetOwner_not_in?: String[] | String
  targetOwner_lt?: String
  targetOwner_lte?: String
  targetOwner_gt?: String
  targetOwner_gte?: String
  targetOwner_contains?: String
  targetOwner_not_contains?: String
  targetOwner_starts_with?: String
  targetOwner_not_starts_with?: String
  targetOwner_ends_with?: String
  targetOwner_not_ends_with?: String
  targetTable?: String
  targetTable_not?: String
  targetTable_in?: String[] | String
  targetTable_not_in?: String[] | String
  targetTable_lt?: String
  targetTable_lte?: String
  targetTable_gt?: String
  targetTable_gte?: String
  targetTable_contains?: String
  targetTable_not_contains?: String
  targetTable_starts_with?: String
  targetTable_not_starts_with?: String
  targetTable_ends_with?: String
  targetTable_not_ends_with?: String
  targetColumn?: String
  targetColumn_not?: String
  targetColumn_in?: String[] | String
  targetColumn_not_in?: String[] | String
  targetColumn_lt?: String
  targetColumn_lte?: String
  targetColumn_gt?: String
  targetColumn_gte?: String
  targetColumn_contains?: String
  targetColumn_not_contains?: String
  targetColumn_starts_with?: String
  targetColumn_not_starts_with?: String
  targetColumn_ends_with?: String
  targetColumn_not_ends_with?: String
  inputColumn?: InputColumnWhereInput
}

export interface DatabaseWhereUniqueInput {
  id?: ID_Input
  name?: String
}

export interface ResourceWhereUniqueInput {
  id?: ID_Input
}

export interface AttributeWhereUniqueInput {
  id?: ID_Input
}

export interface InputColumnWhereUniqueInput {
  id?: ID_Input
}

export interface JoinWhereUniqueInput {
  id?: ID_Input
}

export interface DatabaseCreateInput {
  name: String
  resources?: ResourceCreateManyWithoutDatabaseInput
}

export interface ResourceCreateManyWithoutDatabaseInput {
  create?: ResourceCreateWithoutDatabaseInput[] | ResourceCreateWithoutDatabaseInput
  connect?: ResourceWhereUniqueInput[] | ResourceWhereUniqueInput
}

export interface ResourceCreateWithoutDatabaseInput {
  name: String
  primaryKeyOwner?: String
  primaryKeyTable?: String
  primaryKeyColumn?: String
  attributes?: AttributeCreateManyWithoutResourceInput
}

export interface AttributeCreateManyWithoutResourceInput {
  create?: AttributeCreateWithoutResourceInput[] | AttributeCreateWithoutResourceInput
  connect?: AttributeWhereUniqueInput[] | AttributeWhereUniqueInput
}

export interface AttributeCreateWithoutResourceInput {
  name: String
  mergingScript?: String
  isProfile?: Boolean
  type?: String
  comment?: String
  depth?: Int
  attributes?: AttributeCreateManyWithoutAttributeInput
  attribute?: AttributeCreateOneWithoutAttributesInput
  inputColumns?: InputColumnCreateManyWithoutAttributeInput
}

export interface AttributeCreateManyWithoutAttributeInput {
  create?: AttributeCreateWithoutAttributeInput[] | AttributeCreateWithoutAttributeInput
  connect?: AttributeWhereUniqueInput[] | AttributeWhereUniqueInput
}

export interface AttributeCreateWithoutAttributeInput {
  name: String
  mergingScript?: String
  isProfile?: Boolean
  type?: String
  comment?: String
  depth?: Int
  resource?: ResourceCreateOneWithoutAttributesInput
  attributes?: AttributeCreateManyWithoutAttributeInput
  inputColumns?: InputColumnCreateManyWithoutAttributeInput
}

export interface ResourceCreateOneWithoutAttributesInput {
  create?: ResourceCreateWithoutAttributesInput
  connect?: ResourceWhereUniqueInput
}

export interface ResourceCreateWithoutAttributesInput {
  name: String
  primaryKeyOwner?: String
  primaryKeyTable?: String
  primaryKeyColumn?: String
  database: DatabaseCreateOneWithoutResourcesInput
}

export interface DatabaseCreateOneWithoutResourcesInput {
  create?: DatabaseCreateWithoutResourcesInput
  connect?: DatabaseWhereUniqueInput
}

export interface DatabaseCreateWithoutResourcesInput {
  name: String
}

export interface InputColumnCreateManyWithoutAttributeInput {
  create?: InputColumnCreateWithoutAttributeInput[] | InputColumnCreateWithoutAttributeInput
  connect?: InputColumnWhereUniqueInput[] | InputColumnWhereUniqueInput
}

export interface InputColumnCreateWithoutAttributeInput {
  owner?: String
  table?: String
  column?: String
  script?: String
  staticValue?: String
  joins?: JoinCreateManyWithoutInputColumnInput
}

export interface JoinCreateManyWithoutInputColumnInput {
  create?: JoinCreateWithoutInputColumnInput[] | JoinCreateWithoutInputColumnInput
  connect?: JoinWhereUniqueInput[] | JoinWhereUniqueInput
}

export interface JoinCreateWithoutInputColumnInput {
  sourceOwner?: String
  sourceTable?: String
  sourceColumn?: String
  targetOwner?: String
  targetTable?: String
  targetColumn?: String
}

export interface AttributeCreateOneWithoutAttributesInput {
  create?: AttributeCreateWithoutAttributesInput
  connect?: AttributeWhereUniqueInput
}

export interface AttributeCreateWithoutAttributesInput {
  name: String
  mergingScript?: String
  isProfile?: Boolean
  type?: String
  comment?: String
  depth?: Int
  resource?: ResourceCreateOneWithoutAttributesInput
  attribute?: AttributeCreateOneWithoutAttributesInput
  inputColumns?: InputColumnCreateManyWithoutAttributeInput
}

export interface ResourceCreateInput {
  name: String
  primaryKeyOwner?: String
  primaryKeyTable?: String
  primaryKeyColumn?: String
  attributes?: AttributeCreateManyWithoutResourceInput
  database: DatabaseCreateOneWithoutResourcesInput
}

export interface AttributeCreateInput {
  name: String
  mergingScript?: String
  isProfile?: Boolean
  type?: String
  comment?: String
  depth?: Int
  resource?: ResourceCreateOneWithoutAttributesInput
  attributes?: AttributeCreateManyWithoutAttributeInput
  attribute?: AttributeCreateOneWithoutAttributesInput
  inputColumns?: InputColumnCreateManyWithoutAttributeInput
}

export interface InputColumnCreateInput {
  owner?: String
  table?: String
  column?: String
  script?: String
  staticValue?: String
  joins?: JoinCreateManyWithoutInputColumnInput
  attribute: AttributeCreateOneWithoutInputColumnsInput
}

export interface AttributeCreateOneWithoutInputColumnsInput {
  create?: AttributeCreateWithoutInputColumnsInput
  connect?: AttributeWhereUniqueInput
}

export interface AttributeCreateWithoutInputColumnsInput {
  name: String
  mergingScript?: String
  isProfile?: Boolean
  type?: String
  comment?: String
  depth?: Int
  resource?: ResourceCreateOneWithoutAttributesInput
  attributes?: AttributeCreateManyWithoutAttributeInput
  attribute?: AttributeCreateOneWithoutAttributesInput
}

export interface JoinCreateInput {
  sourceOwner?: String
  sourceTable?: String
  sourceColumn?: String
  targetOwner?: String
  targetTable?: String
  targetColumn?: String
  inputColumn: InputColumnCreateOneWithoutJoinsInput
}

export interface InputColumnCreateOneWithoutJoinsInput {
  create?: InputColumnCreateWithoutJoinsInput
  connect?: InputColumnWhereUniqueInput
}

export interface InputColumnCreateWithoutJoinsInput {
  owner?: String
  table?: String
  column?: String
  script?: String
  staticValue?: String
  attribute: AttributeCreateOneWithoutInputColumnsInput
}

export interface DatabaseUpdateInput {
  name?: String
  resources?: ResourceUpdateManyWithoutDatabaseInput
}

export interface ResourceUpdateManyWithoutDatabaseInput {
  create?: ResourceCreateWithoutDatabaseInput[] | ResourceCreateWithoutDatabaseInput
  connect?: ResourceWhereUniqueInput[] | ResourceWhereUniqueInput
  disconnect?: ResourceWhereUniqueInput[] | ResourceWhereUniqueInput
  delete?: ResourceWhereUniqueInput[] | ResourceWhereUniqueInput
  update?: ResourceUpdateWithWhereUniqueWithoutDatabaseInput[] | ResourceUpdateWithWhereUniqueWithoutDatabaseInput
  updateMany?: ResourceUpdateManyWithWhereNestedInput[] | ResourceUpdateManyWithWhereNestedInput
  deleteMany?: ResourceScalarWhereInput[] | ResourceScalarWhereInput
  upsert?: ResourceUpsertWithWhereUniqueWithoutDatabaseInput[] | ResourceUpsertWithWhereUniqueWithoutDatabaseInput
}

export interface ResourceUpdateWithWhereUniqueWithoutDatabaseInput {
  where: ResourceWhereUniqueInput
  data: ResourceUpdateWithoutDatabaseDataInput
}

export interface ResourceUpdateWithoutDatabaseDataInput {
  name?: String
  primaryKeyOwner?: String
  primaryKeyTable?: String
  primaryKeyColumn?: String
  attributes?: AttributeUpdateManyWithoutResourceInput
}

export interface AttributeUpdateManyWithoutResourceInput {
  create?: AttributeCreateWithoutResourceInput[] | AttributeCreateWithoutResourceInput
  connect?: AttributeWhereUniqueInput[] | AttributeWhereUniqueInput
  disconnect?: AttributeWhereUniqueInput[] | AttributeWhereUniqueInput
  delete?: AttributeWhereUniqueInput[] | AttributeWhereUniqueInput
  update?: AttributeUpdateWithWhereUniqueWithoutResourceInput[] | AttributeUpdateWithWhereUniqueWithoutResourceInput
  updateMany?: AttributeUpdateManyWithWhereNestedInput[] | AttributeUpdateManyWithWhereNestedInput
  deleteMany?: AttributeScalarWhereInput[] | AttributeScalarWhereInput
  upsert?: AttributeUpsertWithWhereUniqueWithoutResourceInput[] | AttributeUpsertWithWhereUniqueWithoutResourceInput
}

export interface AttributeUpdateWithWhereUniqueWithoutResourceInput {
  where: AttributeWhereUniqueInput
  data: AttributeUpdateWithoutResourceDataInput
}

export interface AttributeUpdateWithoutResourceDataInput {
  name?: String
  mergingScript?: String
  isProfile?: Boolean
  type?: String
  comment?: String
  depth?: Int
  attributes?: AttributeUpdateManyWithoutAttributeInput
  attribute?: AttributeUpdateOneWithoutAttributesInput
  inputColumns?: InputColumnUpdateManyWithoutAttributeInput
}

export interface AttributeUpdateManyWithoutAttributeInput {
  create?: AttributeCreateWithoutAttributeInput[] | AttributeCreateWithoutAttributeInput
  connect?: AttributeWhereUniqueInput[] | AttributeWhereUniqueInput
  disconnect?: AttributeWhereUniqueInput[] | AttributeWhereUniqueInput
  delete?: AttributeWhereUniqueInput[] | AttributeWhereUniqueInput
  update?: AttributeUpdateWithWhereUniqueWithoutAttributeInput[] | AttributeUpdateWithWhereUniqueWithoutAttributeInput
  updateMany?: AttributeUpdateManyWithWhereNestedInput[] | AttributeUpdateManyWithWhereNestedInput
  deleteMany?: AttributeScalarWhereInput[] | AttributeScalarWhereInput
  upsert?: AttributeUpsertWithWhereUniqueWithoutAttributeInput[] | AttributeUpsertWithWhereUniqueWithoutAttributeInput
}

export interface AttributeUpdateWithWhereUniqueWithoutAttributeInput {
  where: AttributeWhereUniqueInput
  data: AttributeUpdateWithoutAttributeDataInput
}

export interface AttributeUpdateWithoutAttributeDataInput {
  name?: String
  mergingScript?: String
  isProfile?: Boolean
  type?: String
  comment?: String
  depth?: Int
  resource?: ResourceUpdateOneWithoutAttributesInput
  attributes?: AttributeUpdateManyWithoutAttributeInput
  inputColumns?: InputColumnUpdateManyWithoutAttributeInput
}

export interface ResourceUpdateOneWithoutAttributesInput {
  create?: ResourceCreateWithoutAttributesInput
  connect?: ResourceWhereUniqueInput
  disconnect?: Boolean
  delete?: Boolean
  update?: ResourceUpdateWithoutAttributesDataInput
  upsert?: ResourceUpsertWithoutAttributesInput
}

export interface ResourceUpdateWithoutAttributesDataInput {
  name?: String
  primaryKeyOwner?: String
  primaryKeyTable?: String
  primaryKeyColumn?: String
  database?: DatabaseUpdateOneRequiredWithoutResourcesInput
}

export interface DatabaseUpdateOneRequiredWithoutResourcesInput {
  create?: DatabaseCreateWithoutResourcesInput
  connect?: DatabaseWhereUniqueInput
  update?: DatabaseUpdateWithoutResourcesDataInput
  upsert?: DatabaseUpsertWithoutResourcesInput
}

export interface DatabaseUpdateWithoutResourcesDataInput {
  name?: String
}

export interface DatabaseUpsertWithoutResourcesInput {
  update: DatabaseUpdateWithoutResourcesDataInput
  create: DatabaseCreateWithoutResourcesInput
}

export interface ResourceUpsertWithoutAttributesInput {
  update: ResourceUpdateWithoutAttributesDataInput
  create: ResourceCreateWithoutAttributesInput
}

export interface InputColumnUpdateManyWithoutAttributeInput {
  create?: InputColumnCreateWithoutAttributeInput[] | InputColumnCreateWithoutAttributeInput
  connect?: InputColumnWhereUniqueInput[] | InputColumnWhereUniqueInput
  disconnect?: InputColumnWhereUniqueInput[] | InputColumnWhereUniqueInput
  delete?: InputColumnWhereUniqueInput[] | InputColumnWhereUniqueInput
  update?: InputColumnUpdateWithWhereUniqueWithoutAttributeInput[] | InputColumnUpdateWithWhereUniqueWithoutAttributeInput
  updateMany?: InputColumnUpdateManyWithWhereNestedInput[] | InputColumnUpdateManyWithWhereNestedInput
  deleteMany?: InputColumnScalarWhereInput[] | InputColumnScalarWhereInput
  upsert?: InputColumnUpsertWithWhereUniqueWithoutAttributeInput[] | InputColumnUpsertWithWhereUniqueWithoutAttributeInput
}

export interface InputColumnUpdateWithWhereUniqueWithoutAttributeInput {
  where: InputColumnWhereUniqueInput
  data: InputColumnUpdateWithoutAttributeDataInput
}

export interface InputColumnUpdateWithoutAttributeDataInput {
  owner?: String
  table?: String
  column?: String
  script?: String
  staticValue?: String
  joins?: JoinUpdateManyWithoutInputColumnInput
}

export interface JoinUpdateManyWithoutInputColumnInput {
  create?: JoinCreateWithoutInputColumnInput[] | JoinCreateWithoutInputColumnInput
  connect?: JoinWhereUniqueInput[] | JoinWhereUniqueInput
  disconnect?: JoinWhereUniqueInput[] | JoinWhereUniqueInput
  delete?: JoinWhereUniqueInput[] | JoinWhereUniqueInput
  update?: JoinUpdateWithWhereUniqueWithoutInputColumnInput[] | JoinUpdateWithWhereUniqueWithoutInputColumnInput
  updateMany?: JoinUpdateManyWithWhereNestedInput[] | JoinUpdateManyWithWhereNestedInput
  deleteMany?: JoinScalarWhereInput[] | JoinScalarWhereInput
  upsert?: JoinUpsertWithWhereUniqueWithoutInputColumnInput[] | JoinUpsertWithWhereUniqueWithoutInputColumnInput
}

export interface JoinUpdateWithWhereUniqueWithoutInputColumnInput {
  where: JoinWhereUniqueInput
  data: JoinUpdateWithoutInputColumnDataInput
}

export interface JoinUpdateWithoutInputColumnDataInput {
  sourceOwner?: String
  sourceTable?: String
  sourceColumn?: String
  targetOwner?: String
  targetTable?: String
  targetColumn?: String
}

export interface JoinUpdateManyWithWhereNestedInput {
  where: JoinScalarWhereInput
  data: JoinUpdateManyDataInput
}

export interface JoinScalarWhereInput {
  AND?: JoinScalarWhereInput[] | JoinScalarWhereInput
  OR?: JoinScalarWhereInput[] | JoinScalarWhereInput
  NOT?: JoinScalarWhereInput[] | JoinScalarWhereInput
  id?: ID_Input
  id_not?: ID_Input
  id_in?: ID_Input[] | ID_Input
  id_not_in?: ID_Input[] | ID_Input
  id_lt?: ID_Input
  id_lte?: ID_Input
  id_gt?: ID_Input
  id_gte?: ID_Input
  id_contains?: ID_Input
  id_not_contains?: ID_Input
  id_starts_with?: ID_Input
  id_not_starts_with?: ID_Input
  id_ends_with?: ID_Input
  id_not_ends_with?: ID_Input
  sourceOwner?: String
  sourceOwner_not?: String
  sourceOwner_in?: String[] | String
  sourceOwner_not_in?: String[] | String
  sourceOwner_lt?: String
  sourceOwner_lte?: String
  sourceOwner_gt?: String
  sourceOwner_gte?: String
  sourceOwner_contains?: String
  sourceOwner_not_contains?: String
  sourceOwner_starts_with?: String
  sourceOwner_not_starts_with?: String
  sourceOwner_ends_with?: String
  sourceOwner_not_ends_with?: String
  sourceTable?: String
  sourceTable_not?: String
  sourceTable_in?: String[] | String
  sourceTable_not_in?: String[] | String
  sourceTable_lt?: String
  sourceTable_lte?: String
  sourceTable_gt?: String
  sourceTable_gte?: String
  sourceTable_contains?: String
  sourceTable_not_contains?: String
  sourceTable_starts_with?: String
  sourceTable_not_starts_with?: String
  sourceTable_ends_with?: String
  sourceTable_not_ends_with?: String
  sourceColumn?: String
  sourceColumn_not?: String
  sourceColumn_in?: String[] | String
  sourceColumn_not_in?: String[] | String
  sourceColumn_lt?: String
  sourceColumn_lte?: String
  sourceColumn_gt?: String
  sourceColumn_gte?: String
  sourceColumn_contains?: String
  sourceColumn_not_contains?: String
  sourceColumn_starts_with?: String
  sourceColumn_not_starts_with?: String
  sourceColumn_ends_with?: String
  sourceColumn_not_ends_with?: String
  targetOwner?: String
  targetOwner_not?: String
  targetOwner_in?: String[] | String
  targetOwner_not_in?: String[] | String
  targetOwner_lt?: String
  targetOwner_lte?: String
  targetOwner_gt?: String
  targetOwner_gte?: String
  targetOwner_contains?: String
  targetOwner_not_contains?: String
  targetOwner_starts_with?: String
  targetOwner_not_starts_with?: String
  targetOwner_ends_with?: String
  targetOwner_not_ends_with?: String
  targetTable?: String
  targetTable_not?: String
  targetTable_in?: String[] | String
  targetTable_not_in?: String[] | String
  targetTable_lt?: String
  targetTable_lte?: String
  targetTable_gt?: String
  targetTable_gte?: String
  targetTable_contains?: String
  targetTable_not_contains?: String
  targetTable_starts_with?: String
  targetTable_not_starts_with?: String
  targetTable_ends_with?: String
  targetTable_not_ends_with?: String
  targetColumn?: String
  targetColumn_not?: String
  targetColumn_in?: String[] | String
  targetColumn_not_in?: String[] | String
  targetColumn_lt?: String
  targetColumn_lte?: String
  targetColumn_gt?: String
  targetColumn_gte?: String
  targetColumn_contains?: String
  targetColumn_not_contains?: String
  targetColumn_starts_with?: String
  targetColumn_not_starts_with?: String
  targetColumn_ends_with?: String
  targetColumn_not_ends_with?: String
}

export interface JoinUpdateManyDataInput {
  sourceOwner?: String
  sourceTable?: String
  sourceColumn?: String
  targetOwner?: String
  targetTable?: String
  targetColumn?: String
}

export interface JoinUpsertWithWhereUniqueWithoutInputColumnInput {
  where: JoinWhereUniqueInput
  update: JoinUpdateWithoutInputColumnDataInput
  create: JoinCreateWithoutInputColumnInput
}

export interface InputColumnUpdateManyWithWhereNestedInput {
  where: InputColumnScalarWhereInput
  data: InputColumnUpdateManyDataInput
}

export interface InputColumnScalarWhereInput {
  AND?: InputColumnScalarWhereInput[] | InputColumnScalarWhereInput
  OR?: InputColumnScalarWhereInput[] | InputColumnScalarWhereInput
  NOT?: InputColumnScalarWhereInput[] | InputColumnScalarWhereInput
  id?: ID_Input
  id_not?: ID_Input
  id_in?: ID_Input[] | ID_Input
  id_not_in?: ID_Input[] | ID_Input
  id_lt?: ID_Input
  id_lte?: ID_Input
  id_gt?: ID_Input
  id_gte?: ID_Input
  id_contains?: ID_Input
  id_not_contains?: ID_Input
  id_starts_with?: ID_Input
  id_not_starts_with?: ID_Input
  id_ends_with?: ID_Input
  id_not_ends_with?: ID_Input
  owner?: String
  owner_not?: String
  owner_in?: String[] | String
  owner_not_in?: String[] | String
  owner_lt?: String
  owner_lte?: String
  owner_gt?: String
  owner_gte?: String
  owner_contains?: String
  owner_not_contains?: String
  owner_starts_with?: String
  owner_not_starts_with?: String
  owner_ends_with?: String
  owner_not_ends_with?: String
  table?: String
  table_not?: String
  table_in?: String[] | String
  table_not_in?: String[] | String
  table_lt?: String
  table_lte?: String
  table_gt?: String
  table_gte?: String
  table_contains?: String
  table_not_contains?: String
  table_starts_with?: String
  table_not_starts_with?: String
  table_ends_with?: String
  table_not_ends_with?: String
  column?: String
  column_not?: String
  column_in?: String[] | String
  column_not_in?: String[] | String
  column_lt?: String
  column_lte?: String
  column_gt?: String
  column_gte?: String
  column_contains?: String
  column_not_contains?: String
  column_starts_with?: String
  column_not_starts_with?: String
  column_ends_with?: String
  column_not_ends_with?: String
  script?: String
  script_not?: String
  script_in?: String[] | String
  script_not_in?: String[] | String
  script_lt?: String
  script_lte?: String
  script_gt?: String
  script_gte?: String
  script_contains?: String
  script_not_contains?: String
  script_starts_with?: String
  script_not_starts_with?: String
  script_ends_with?: String
  script_not_ends_with?: String
  staticValue?: String
  staticValue_not?: String
  staticValue_in?: String[] | String
  staticValue_not_in?: String[] | String
  staticValue_lt?: String
  staticValue_lte?: String
  staticValue_gt?: String
  staticValue_gte?: String
  staticValue_contains?: String
  staticValue_not_contains?: String
  staticValue_starts_with?: String
  staticValue_not_starts_with?: String
  staticValue_ends_with?: String
  staticValue_not_ends_with?: String
}

export interface InputColumnUpdateManyDataInput {
  owner?: String
  table?: String
  column?: String
  script?: String
  staticValue?: String
}

export interface InputColumnUpsertWithWhereUniqueWithoutAttributeInput {
  where: InputColumnWhereUniqueInput
  update: InputColumnUpdateWithoutAttributeDataInput
  create: InputColumnCreateWithoutAttributeInput
}

export interface AttributeUpdateManyWithWhereNestedInput {
  where: AttributeScalarWhereInput
  data: AttributeUpdateManyDataInput
}

export interface AttributeScalarWhereInput {
  AND?: AttributeScalarWhereInput[] | AttributeScalarWhereInput
  OR?: AttributeScalarWhereInput[] | AttributeScalarWhereInput
  NOT?: AttributeScalarWhereInput[] | AttributeScalarWhereInput
  id?: ID_Input
  id_not?: ID_Input
  id_in?: ID_Input[] | ID_Input
  id_not_in?: ID_Input[] | ID_Input
  id_lt?: ID_Input
  id_lte?: ID_Input
  id_gt?: ID_Input
  id_gte?: ID_Input
  id_contains?: ID_Input
  id_not_contains?: ID_Input
  id_starts_with?: ID_Input
  id_not_starts_with?: ID_Input
  id_ends_with?: ID_Input
  id_not_ends_with?: ID_Input
  name?: String
  name_not?: String
  name_in?: String[] | String
  name_not_in?: String[] | String
  name_lt?: String
  name_lte?: String
  name_gt?: String
  name_gte?: String
  name_contains?: String
  name_not_contains?: String
  name_starts_with?: String
  name_not_starts_with?: String
  name_ends_with?: String
  name_not_ends_with?: String
  mergingScript?: String
  mergingScript_not?: String
  mergingScript_in?: String[] | String
  mergingScript_not_in?: String[] | String
  mergingScript_lt?: String
  mergingScript_lte?: String
  mergingScript_gt?: String
  mergingScript_gte?: String
  mergingScript_contains?: String
  mergingScript_not_contains?: String
  mergingScript_starts_with?: String
  mergingScript_not_starts_with?: String
  mergingScript_ends_with?: String
  mergingScript_not_ends_with?: String
  isProfile?: Boolean
  isProfile_not?: Boolean
  type?: String
  type_not?: String
  type_in?: String[] | String
  type_not_in?: String[] | String
  type_lt?: String
  type_lte?: String
  type_gt?: String
  type_gte?: String
  type_contains?: String
  type_not_contains?: String
  type_starts_with?: String
  type_not_starts_with?: String
  type_ends_with?: String
  type_not_ends_with?: String
  comment?: String
  comment_not?: String
  comment_in?: String[] | String
  comment_not_in?: String[] | String
  comment_lt?: String
  comment_lte?: String
  comment_gt?: String
  comment_gte?: String
  comment_contains?: String
  comment_not_contains?: String
  comment_starts_with?: String
  comment_not_starts_with?: String
  comment_ends_with?: String
  comment_not_ends_with?: String
  depth?: Int
  depth_not?: Int
  depth_in?: Int[] | Int
  depth_not_in?: Int[] | Int
  depth_lt?: Int
  depth_lte?: Int
  depth_gt?: Int
  depth_gte?: Int
}

export interface AttributeUpdateManyDataInput {
  name?: String
  mergingScript?: String
  isProfile?: Boolean
  type?: String
  comment?: String
  depth?: Int
}

export interface AttributeUpsertWithWhereUniqueWithoutAttributeInput {
  where: AttributeWhereUniqueInput
  update: AttributeUpdateWithoutAttributeDataInput
  create: AttributeCreateWithoutAttributeInput
}

export interface AttributeUpdateOneWithoutAttributesInput {
  create?: AttributeCreateWithoutAttributesInput
  connect?: AttributeWhereUniqueInput
  disconnect?: Boolean
  delete?: Boolean
  update?: AttributeUpdateWithoutAttributesDataInput
  upsert?: AttributeUpsertWithoutAttributesInput
}

export interface AttributeUpdateWithoutAttributesDataInput {
  name?: String
  mergingScript?: String
  isProfile?: Boolean
  type?: String
  comment?: String
  depth?: Int
  resource?: ResourceUpdateOneWithoutAttributesInput
  attribute?: AttributeUpdateOneWithoutAttributesInput
  inputColumns?: InputColumnUpdateManyWithoutAttributeInput
}

export interface AttributeUpsertWithoutAttributesInput {
  update: AttributeUpdateWithoutAttributesDataInput
  create: AttributeCreateWithoutAttributesInput
}

export interface AttributeUpsertWithWhereUniqueWithoutResourceInput {
  where: AttributeWhereUniqueInput
  update: AttributeUpdateWithoutResourceDataInput
  create: AttributeCreateWithoutResourceInput
}

export interface ResourceUpdateManyWithWhereNestedInput {
  where: ResourceScalarWhereInput
  data: ResourceUpdateManyDataInput
}

export interface ResourceScalarWhereInput {
  AND?: ResourceScalarWhereInput[] | ResourceScalarWhereInput
  OR?: ResourceScalarWhereInput[] | ResourceScalarWhereInput
  NOT?: ResourceScalarWhereInput[] | ResourceScalarWhereInput
  id?: ID_Input
  id_not?: ID_Input
  id_in?: ID_Input[] | ID_Input
  id_not_in?: ID_Input[] | ID_Input
  id_lt?: ID_Input
  id_lte?: ID_Input
  id_gt?: ID_Input
  id_gte?: ID_Input
  id_contains?: ID_Input
  id_not_contains?: ID_Input
  id_starts_with?: ID_Input
  id_not_starts_with?: ID_Input
  id_ends_with?: ID_Input
  id_not_ends_with?: ID_Input
  name?: String
  name_not?: String
  name_in?: String[] | String
  name_not_in?: String[] | String
  name_lt?: String
  name_lte?: String
  name_gt?: String
  name_gte?: String
  name_contains?: String
  name_not_contains?: String
  name_starts_with?: String
  name_not_starts_with?: String
  name_ends_with?: String
  name_not_ends_with?: String
  primaryKeyOwner?: String
  primaryKeyOwner_not?: String
  primaryKeyOwner_in?: String[] | String
  primaryKeyOwner_not_in?: String[] | String
  primaryKeyOwner_lt?: String
  primaryKeyOwner_lte?: String
  primaryKeyOwner_gt?: String
  primaryKeyOwner_gte?: String
  primaryKeyOwner_contains?: String
  primaryKeyOwner_not_contains?: String
  primaryKeyOwner_starts_with?: String
  primaryKeyOwner_not_starts_with?: String
  primaryKeyOwner_ends_with?: String
  primaryKeyOwner_not_ends_with?: String
  primaryKeyTable?: String
  primaryKeyTable_not?: String
  primaryKeyTable_in?: String[] | String
  primaryKeyTable_not_in?: String[] | String
  primaryKeyTable_lt?: String
  primaryKeyTable_lte?: String
  primaryKeyTable_gt?: String
  primaryKeyTable_gte?: String
  primaryKeyTable_contains?: String
  primaryKeyTable_not_contains?: String
  primaryKeyTable_starts_with?: String
  primaryKeyTable_not_starts_with?: String
  primaryKeyTable_ends_with?: String
  primaryKeyTable_not_ends_with?: String
  primaryKeyColumn?: String
  primaryKeyColumn_not?: String
  primaryKeyColumn_in?: String[] | String
  primaryKeyColumn_not_in?: String[] | String
  primaryKeyColumn_lt?: String
  primaryKeyColumn_lte?: String
  primaryKeyColumn_gt?: String
  primaryKeyColumn_gte?: String
  primaryKeyColumn_contains?: String
  primaryKeyColumn_not_contains?: String
  primaryKeyColumn_starts_with?: String
  primaryKeyColumn_not_starts_with?: String
  primaryKeyColumn_ends_with?: String
  primaryKeyColumn_not_ends_with?: String
}

export interface ResourceUpdateManyDataInput {
  name?: String
  primaryKeyOwner?: String
  primaryKeyTable?: String
  primaryKeyColumn?: String
}

export interface ResourceUpsertWithWhereUniqueWithoutDatabaseInput {
  where: ResourceWhereUniqueInput
  update: ResourceUpdateWithoutDatabaseDataInput
  create: ResourceCreateWithoutDatabaseInput
}

export interface ResourceUpdateInput {
  name?: String
  primaryKeyOwner?: String
  primaryKeyTable?: String
  primaryKeyColumn?: String
  attributes?: AttributeUpdateManyWithoutResourceInput
  database?: DatabaseUpdateOneRequiredWithoutResourcesInput
}

export interface AttributeUpdateInput {
  name?: String
  mergingScript?: String
  isProfile?: Boolean
  type?: String
  comment?: String
  depth?: Int
  resource?: ResourceUpdateOneWithoutAttributesInput
  attributes?: AttributeUpdateManyWithoutAttributeInput
  attribute?: AttributeUpdateOneWithoutAttributesInput
  inputColumns?: InputColumnUpdateManyWithoutAttributeInput
}

export interface InputColumnUpdateInput {
  owner?: String
  table?: String
  column?: String
  script?: String
  staticValue?: String
  joins?: JoinUpdateManyWithoutInputColumnInput
  attribute?: AttributeUpdateOneRequiredWithoutInputColumnsInput
}

export interface AttributeUpdateOneRequiredWithoutInputColumnsInput {
  create?: AttributeCreateWithoutInputColumnsInput
  connect?: AttributeWhereUniqueInput
  update?: AttributeUpdateWithoutInputColumnsDataInput
  upsert?: AttributeUpsertWithoutInputColumnsInput
}

export interface AttributeUpdateWithoutInputColumnsDataInput {
  name?: String
  mergingScript?: String
  isProfile?: Boolean
  type?: String
  comment?: String
  depth?: Int
  resource?: ResourceUpdateOneWithoutAttributesInput
  attributes?: AttributeUpdateManyWithoutAttributeInput
  attribute?: AttributeUpdateOneWithoutAttributesInput
}

export interface AttributeUpsertWithoutInputColumnsInput {
  update: AttributeUpdateWithoutInputColumnsDataInput
  create: AttributeCreateWithoutInputColumnsInput
}

export interface JoinUpdateInput {
  sourceOwner?: String
  sourceTable?: String
  sourceColumn?: String
  targetOwner?: String
  targetTable?: String
  targetColumn?: String
  inputColumn?: InputColumnUpdateOneRequiredWithoutJoinsInput
}

export interface InputColumnUpdateOneRequiredWithoutJoinsInput {
  create?: InputColumnCreateWithoutJoinsInput
  connect?: InputColumnWhereUniqueInput
  update?: InputColumnUpdateWithoutJoinsDataInput
  upsert?: InputColumnUpsertWithoutJoinsInput
}

export interface InputColumnUpdateWithoutJoinsDataInput {
  owner?: String
  table?: String
  column?: String
  script?: String
  staticValue?: String
  attribute?: AttributeUpdateOneRequiredWithoutInputColumnsInput
}

export interface InputColumnUpsertWithoutJoinsInput {
  update: InputColumnUpdateWithoutJoinsDataInput
  create: InputColumnCreateWithoutJoinsInput
}

export interface DatabaseUpdateManyMutationInput {
  name?: String
}

export interface ResourceUpdateManyMutationInput {
  name?: String
  primaryKeyOwner?: String
  primaryKeyTable?: String
  primaryKeyColumn?: String
}

export interface AttributeUpdateManyMutationInput {
  name?: String
  mergingScript?: String
  isProfile?: Boolean
  type?: String
  comment?: String
  depth?: Int
}

export interface InputColumnUpdateManyMutationInput {
  owner?: String
  table?: String
  column?: String
  script?: String
  staticValue?: String
}

export interface JoinUpdateManyMutationInput {
  sourceOwner?: String
  sourceTable?: String
  sourceColumn?: String
  targetOwner?: String
  targetTable?: String
  targetColumn?: String
}

export interface DatabaseSubscriptionWhereInput {
  AND?: DatabaseSubscriptionWhereInput[] | DatabaseSubscriptionWhereInput
  OR?: DatabaseSubscriptionWhereInput[] | DatabaseSubscriptionWhereInput
  NOT?: DatabaseSubscriptionWhereInput[] | DatabaseSubscriptionWhereInput
  mutation_in?: MutationType[] | MutationType
  updatedFields_contains?: String
  updatedFields_contains_every?: String[] | String
  updatedFields_contains_some?: String[] | String
  node?: DatabaseWhereInput
}

export interface ResourceSubscriptionWhereInput {
  AND?: ResourceSubscriptionWhereInput[] | ResourceSubscriptionWhereInput
  OR?: ResourceSubscriptionWhereInput[] | ResourceSubscriptionWhereInput
  NOT?: ResourceSubscriptionWhereInput[] | ResourceSubscriptionWhereInput
  mutation_in?: MutationType[] | MutationType
  updatedFields_contains?: String
  updatedFields_contains_every?: String[] | String
  updatedFields_contains_some?: String[] | String
  node?: ResourceWhereInput
}

export interface AttributeSubscriptionWhereInput {
  AND?: AttributeSubscriptionWhereInput[] | AttributeSubscriptionWhereInput
  OR?: AttributeSubscriptionWhereInput[] | AttributeSubscriptionWhereInput
  NOT?: AttributeSubscriptionWhereInput[] | AttributeSubscriptionWhereInput
  mutation_in?: MutationType[] | MutationType
  updatedFields_contains?: String
  updatedFields_contains_every?: String[] | String
  updatedFields_contains_some?: String[] | String
  node?: AttributeWhereInput
}

export interface InputColumnSubscriptionWhereInput {
  AND?: InputColumnSubscriptionWhereInput[] | InputColumnSubscriptionWhereInput
  OR?: InputColumnSubscriptionWhereInput[] | InputColumnSubscriptionWhereInput
  NOT?: InputColumnSubscriptionWhereInput[] | InputColumnSubscriptionWhereInput
  mutation_in?: MutationType[] | MutationType
  updatedFields_contains?: String
  updatedFields_contains_every?: String[] | String
  updatedFields_contains_some?: String[] | String
  node?: InputColumnWhereInput
}

export interface JoinSubscriptionWhereInput {
  AND?: JoinSubscriptionWhereInput[] | JoinSubscriptionWhereInput
  OR?: JoinSubscriptionWhereInput[] | JoinSubscriptionWhereInput
  NOT?: JoinSubscriptionWhereInput[] | JoinSubscriptionWhereInput
  mutation_in?: MutationType[] | MutationType
  updatedFields_contains?: String
  updatedFields_contains_every?: String[] | String
  updatedFields_contains_some?: String[] | String
  node?: JoinWhereInput
}

/*
 * An object with an ID

 */
export interface Node {
  id: ID_Output
}

export interface Database extends Node {
  id: ID_Output
  name: String
  resources?: Resource[]
}

export interface Resource extends Node {
  id: ID_Output
  name: String
  primaryKeyOwner?: String
  primaryKeyTable?: String
  primaryKeyColumn?: String
  attributes?: Attribute[]
  database: Database
}

export interface Attribute extends Node {
  id: ID_Output
  name: String
  mergingScript?: String
  isProfile?: Boolean
  type?: String
  comment?: String
  depth?: Int
  resource?: Resource
  attributes?: Attribute[]
  attribute?: Attribute
  inputColumns?: InputColumn[]
}

export interface InputColumn extends Node {
  id: ID_Output
  owner?: String
  table?: String
  column?: String
  script?: String
  staticValue?: String
  joins?: Join[]
  attribute: Attribute
}

export interface Join extends Node {
  id: ID_Output
  sourceOwner?: String
  sourceTable?: String
  sourceColumn?: String
  targetOwner?: String
  targetTable?: String
  targetColumn?: String
  inputColumn: InputColumn
}

/*
 * A connection to a list of items.

 */
export interface DatabaseConnection {
  pageInfo: PageInfo
  edges: DatabaseEdge[]
  aggregate: AggregateDatabase
}

/*
 * Information about pagination in a connection.

 */
export interface PageInfo {
  hasNextPage: Boolean
  hasPreviousPage: Boolean
  startCursor?: String
  endCursor?: String
}

/*
 * An edge in a connection.

 */
export interface DatabaseEdge {
  node: Database
  cursor: String
}

export interface AggregateDatabase {
  count: Int
}

/*
 * A connection to a list of items.

 */
export interface ResourceConnection {
  pageInfo: PageInfo
  edges: ResourceEdge[]
  aggregate: AggregateResource
}

/*
 * An edge in a connection.

 */
export interface ResourceEdge {
  node: Resource
  cursor: String
}

export interface AggregateResource {
  count: Int
}

/*
 * A connection to a list of items.

 */
export interface AttributeConnection {
  pageInfo: PageInfo
  edges: AttributeEdge[]
  aggregate: AggregateAttribute
}

/*
 * An edge in a connection.

 */
export interface AttributeEdge {
  node: Attribute
  cursor: String
}

export interface AggregateAttribute {
  count: Int
}

/*
 * A connection to a list of items.

 */
export interface InputColumnConnection {
  pageInfo: PageInfo
  edges: InputColumnEdge[]
  aggregate: AggregateInputColumn
}

/*
 * An edge in a connection.

 */
export interface InputColumnEdge {
  node: InputColumn
  cursor: String
}

export interface AggregateInputColumn {
  count: Int
}

/*
 * A connection to a list of items.

 */
export interface JoinConnection {
  pageInfo: PageInfo
  edges: JoinEdge[]
  aggregate: AggregateJoin
}

/*
 * An edge in a connection.

 */
export interface JoinEdge {
  node: Join
  cursor: String
}

export interface AggregateJoin {
  count: Int
}

export interface BatchPayload {
  count: Long
}

export interface DatabaseSubscriptionPayload {
  mutation: MutationType
  node?: Database
  updatedFields?: String[]
  previousValues?: DatabasePreviousValues
}

export interface DatabasePreviousValues {
  id: ID_Output
  name: String
}

export interface ResourceSubscriptionPayload {
  mutation: MutationType
  node?: Resource
  updatedFields?: String[]
  previousValues?: ResourcePreviousValues
}

export interface ResourcePreviousValues {
  id: ID_Output
  name: String
  primaryKeyOwner?: String
  primaryKeyTable?: String
  primaryKeyColumn?: String
}

export interface AttributeSubscriptionPayload {
  mutation: MutationType
  node?: Attribute
  updatedFields?: String[]
  previousValues?: AttributePreviousValues
}

export interface AttributePreviousValues {
  id: ID_Output
  name: String
  mergingScript?: String
  isProfile?: Boolean
  type?: String
  comment?: String
  depth?: Int
}

export interface InputColumnSubscriptionPayload {
  mutation: MutationType
  node?: InputColumn
  updatedFields?: String[]
  previousValues?: InputColumnPreviousValues
}

export interface InputColumnPreviousValues {
  id: ID_Output
  owner?: String
  table?: String
  column?: String
  script?: String
  staticValue?: String
}

export interface JoinSubscriptionPayload {
  mutation: MutationType
  node?: Join
  updatedFields?: String[]
  previousValues?: JoinPreviousValues
}

export interface JoinPreviousValues {
  id: ID_Output
  sourceOwner?: String
  sourceTable?: String
  sourceColumn?: String
  targetOwner?: String
  targetTable?: String
  targetColumn?: String
}

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number
export type ID_Output = string

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. 
*/
export type Int = number

/*
The `Long` scalar type represents non-fractional signed whole numeric values.
Long can represent values between -(2^63) and 2^63 - 1.
*/
export type Long = string
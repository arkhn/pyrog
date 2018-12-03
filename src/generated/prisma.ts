import { GraphQLResolveInfo, GraphQLSchema } from 'graphql'
import { IResolvers } from 'graphql-tools/dist/Interfaces'
import { Options } from 'graphql-binding'
import { makePrismaBindingClass, BasePrismaOptions } from 'prisma-binding'

export interface Query {
    mappings: <T = Mapping[]>(args: { where?: MappingWhereInput, orderBy?: MappingOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    resources: <T = Resource[]>(args: { where?: ResourceWhereInput, orderBy?: ResourceOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    attributes: <T = Attribute[]>(args: { where?: AttributeWhereInput, orderBy?: AttributeOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    inputColumns: <T = InputColumn[]>(args: { where?: InputColumnWhereInput, orderBy?: InputColumnOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    mapping: <T = Mapping | null>(args: { where: MappingWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    resource: <T = Resource | null>(args: { where: ResourceWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    attribute: <T = Attribute | null>(args: { where: AttributeWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    inputColumn: <T = InputColumn | null>(args: { where: InputColumnWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    mappingsConnection: <T = MappingConnection>(args: { where?: MappingWhereInput, orderBy?: MappingOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    resourcesConnection: <T = ResourceConnection>(args: { where?: ResourceWhereInput, orderBy?: ResourceOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    attributesConnection: <T = AttributeConnection>(args: { where?: AttributeWhereInput, orderBy?: AttributeOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    inputColumnsConnection: <T = InputColumnConnection>(args: { where?: InputColumnWhereInput, orderBy?: InputColumnOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    node: <T = Node | null>(args: { id: ID_Output }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Mutation {
    createMapping: <T = Mapping>(args: { data: MappingCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createResource: <T = Resource>(args: { data: ResourceCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createAttribute: <T = Attribute>(args: { data: AttributeCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createInputColumn: <T = InputColumn>(args: { data: InputColumnCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateMapping: <T = Mapping | null>(args: { data: MappingUpdateInput, where: MappingWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateResource: <T = Resource | null>(args: { data: ResourceUpdateInput, where: ResourceWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateAttribute: <T = Attribute | null>(args: { data: AttributeUpdateInput, where: AttributeWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateInputColumn: <T = InputColumn | null>(args: { data: InputColumnUpdateInput, where: InputColumnWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteMapping: <T = Mapping | null>(args: { where: MappingWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteResource: <T = Resource | null>(args: { where: ResourceWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteAttribute: <T = Attribute | null>(args: { where: AttributeWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteInputColumn: <T = InputColumn | null>(args: { where: InputColumnWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    upsertMapping: <T = Mapping>(args: { where: MappingWhereUniqueInput, create: MappingCreateInput, update: MappingUpdateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    upsertResource: <T = Resource>(args: { where: ResourceWhereUniqueInput, create: ResourceCreateInput, update: ResourceUpdateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    upsertAttribute: <T = Attribute>(args: { where: AttributeWhereUniqueInput, create: AttributeCreateInput, update: AttributeUpdateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    upsertInputColumn: <T = InputColumn>(args: { where: InputColumnWhereUniqueInput, create: InputColumnCreateInput, update: InputColumnUpdateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateManyMappings: <T = BatchPayload>(args: { data: MappingUpdateManyMutationInput, where?: MappingWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateManyResources: <T = BatchPayload>(args: { data: ResourceUpdateManyMutationInput, where?: ResourceWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateManyAttributes: <T = BatchPayload>(args: { data: AttributeUpdateManyMutationInput, where?: AttributeWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateManyInputColumns: <T = BatchPayload>(args: { data: InputColumnUpdateManyMutationInput, where?: InputColumnWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteManyMappings: <T = BatchPayload>(args: { where?: MappingWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteManyResources: <T = BatchPayload>(args: { where?: ResourceWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteManyAttributes: <T = BatchPayload>(args: { where?: AttributeWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteManyInputColumns: <T = BatchPayload>(args: { where?: InputColumnWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Subscription {
    mapping: <T = MappingSubscriptionPayload | null>(args: { where?: MappingSubscriptionWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> ,
    resource: <T = ResourceSubscriptionPayload | null>(args: { where?: ResourceSubscriptionWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> ,
    attribute: <T = AttributeSubscriptionPayload | null>(args: { where?: AttributeSubscriptionWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> ,
    inputColumn: <T = InputColumnSubscriptionPayload | null>(args: { where?: InputColumnSubscriptionWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> 
  }

export interface Exists {
  Mapping: (where?: MappingWhereInput) => Promise<boolean>
  Resource: (where?: ResourceWhereInput) => Promise<boolean>
  Attribute: (where?: AttributeWhereInput) => Promise<boolean>
  InputColumn: (where?: InputColumnWhereInput) => Promise<boolean>
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

type AggregateInputColumn {
  count: Int!
}

type AggregateMapping {
  count: Int!
}

type AggregateResource {
  count: Int!
}

type Attribute implements Node {
  id: ID!
  resource: Resource!
  name: String!
  inputColumns(where: InputColumnWhereInput, orderBy: InputColumnOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [InputColumn!]
  mergingScript: String
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
  resource: ResourceCreateOneWithoutAttributesInput!
  inputColumns: InputColumnCreateManyWithoutAttributeInput
}

input AttributeCreateManyWithoutResourceInput {
  create: [AttributeCreateWithoutResourceInput!]
  connect: [AttributeWhereUniqueInput!]
}

input AttributeCreateOneWithoutInputColumnsInput {
  create: AttributeCreateWithoutInputColumnsInput
  connect: AttributeWhereUniqueInput
}

input AttributeCreateWithoutInputColumnsInput {
  name: String!
  mergingScript: String
  resource: ResourceCreateOneWithoutAttributesInput!
}

input AttributeCreateWithoutResourceInput {
  name: String!
  mergingScript: String
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
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type AttributePreviousValues {
  id: ID!
  name: String!
  mergingScript: String
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
  resource: ResourceUpdateOneRequiredWithoutAttributesInput
  inputColumns: InputColumnUpdateManyWithoutAttributeInput
}

input AttributeUpdateManyDataInput {
  name: String
  mergingScript: String
}

input AttributeUpdateManyMutationInput {
  name: String
  mergingScript: String
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

input AttributeUpdateWithoutInputColumnsDataInput {
  name: String
  mergingScript: String
  resource: ResourceUpdateOneRequiredWithoutAttributesInput
}

input AttributeUpdateWithoutResourceDataInput {
  name: String
  mergingScript: String
  inputColumns: InputColumnUpdateManyWithoutAttributeInput
}

input AttributeUpdateWithWhereUniqueWithoutResourceInput {
  where: AttributeWhereUniqueInput!
  data: AttributeUpdateWithoutResourceDataInput!
}

input AttributeUpsertWithoutInputColumnsInput {
  update: AttributeUpdateWithoutInputColumnsDataInput!
  create: AttributeCreateWithoutInputColumnsInput!
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
  resource: ResourceWhereInput
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

type InputColumn implements Node {
  id: ID!
  attribute: Attribute!
  owner: String!
  table: String!
  column: String!
  script: String
  joinSourceColumn: String
  joinTargetOwner: String
  joinTargetTable: String
  joinTargetColumn: String
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
  owner: String!
  table: String!
  column: String!
  script: String
  joinSourceColumn: String
  joinTargetOwner: String
  joinTargetTable: String
  joinTargetColumn: String
  attribute: AttributeCreateOneWithoutInputColumnsInput!
}

input InputColumnCreateManyWithoutAttributeInput {
  create: [InputColumnCreateWithoutAttributeInput!]
  connect: [InputColumnWhereUniqueInput!]
}

input InputColumnCreateWithoutAttributeInput {
  owner: String!
  table: String!
  column: String!
  script: String
  joinSourceColumn: String
  joinTargetOwner: String
  joinTargetTable: String
  joinTargetColumn: String
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
  joinSourceColumn_ASC
  joinSourceColumn_DESC
  joinTargetOwner_ASC
  joinTargetOwner_DESC
  joinTargetTable_ASC
  joinTargetTable_DESC
  joinTargetColumn_ASC
  joinTargetColumn_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type InputColumnPreviousValues {
  id: ID!
  owner: String!
  table: String!
  column: String!
  script: String
  joinSourceColumn: String
  joinTargetOwner: String
  joinTargetTable: String
  joinTargetColumn: String
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
  joinSourceColumn: String

  """All values that are not equal to given value."""
  joinSourceColumn_not: String

  """All values that are contained in given list."""
  joinSourceColumn_in: [String!]

  """All values that are not contained in given list."""
  joinSourceColumn_not_in: [String!]

  """All values less than the given value."""
  joinSourceColumn_lt: String

  """All values less than or equal the given value."""
  joinSourceColumn_lte: String

  """All values greater than the given value."""
  joinSourceColumn_gt: String

  """All values greater than or equal the given value."""
  joinSourceColumn_gte: String

  """All values containing the given string."""
  joinSourceColumn_contains: String

  """All values not containing the given string."""
  joinSourceColumn_not_contains: String

  """All values starting with the given string."""
  joinSourceColumn_starts_with: String

  """All values not starting with the given string."""
  joinSourceColumn_not_starts_with: String

  """All values ending with the given string."""
  joinSourceColumn_ends_with: String

  """All values not ending with the given string."""
  joinSourceColumn_not_ends_with: String
  joinTargetOwner: String

  """All values that are not equal to given value."""
  joinTargetOwner_not: String

  """All values that are contained in given list."""
  joinTargetOwner_in: [String!]

  """All values that are not contained in given list."""
  joinTargetOwner_not_in: [String!]

  """All values less than the given value."""
  joinTargetOwner_lt: String

  """All values less than or equal the given value."""
  joinTargetOwner_lte: String

  """All values greater than the given value."""
  joinTargetOwner_gt: String

  """All values greater than or equal the given value."""
  joinTargetOwner_gte: String

  """All values containing the given string."""
  joinTargetOwner_contains: String

  """All values not containing the given string."""
  joinTargetOwner_not_contains: String

  """All values starting with the given string."""
  joinTargetOwner_starts_with: String

  """All values not starting with the given string."""
  joinTargetOwner_not_starts_with: String

  """All values ending with the given string."""
  joinTargetOwner_ends_with: String

  """All values not ending with the given string."""
  joinTargetOwner_not_ends_with: String
  joinTargetTable: String

  """All values that are not equal to given value."""
  joinTargetTable_not: String

  """All values that are contained in given list."""
  joinTargetTable_in: [String!]

  """All values that are not contained in given list."""
  joinTargetTable_not_in: [String!]

  """All values less than the given value."""
  joinTargetTable_lt: String

  """All values less than or equal the given value."""
  joinTargetTable_lte: String

  """All values greater than the given value."""
  joinTargetTable_gt: String

  """All values greater than or equal the given value."""
  joinTargetTable_gte: String

  """All values containing the given string."""
  joinTargetTable_contains: String

  """All values not containing the given string."""
  joinTargetTable_not_contains: String

  """All values starting with the given string."""
  joinTargetTable_starts_with: String

  """All values not starting with the given string."""
  joinTargetTable_not_starts_with: String

  """All values ending with the given string."""
  joinTargetTable_ends_with: String

  """All values not ending with the given string."""
  joinTargetTable_not_ends_with: String
  joinTargetColumn: String

  """All values that are not equal to given value."""
  joinTargetColumn_not: String

  """All values that are contained in given list."""
  joinTargetColumn_in: [String!]

  """All values that are not contained in given list."""
  joinTargetColumn_not_in: [String!]

  """All values less than the given value."""
  joinTargetColumn_lt: String

  """All values less than or equal the given value."""
  joinTargetColumn_lte: String

  """All values greater than the given value."""
  joinTargetColumn_gt: String

  """All values greater than or equal the given value."""
  joinTargetColumn_gte: String

  """All values containing the given string."""
  joinTargetColumn_contains: String

  """All values not containing the given string."""
  joinTargetColumn_not_contains: String

  """All values starting with the given string."""
  joinTargetColumn_starts_with: String

  """All values not starting with the given string."""
  joinTargetColumn_not_starts_with: String

  """All values ending with the given string."""
  joinTargetColumn_ends_with: String

  """All values not ending with the given string."""
  joinTargetColumn_not_ends_with: String
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
  joinSourceColumn: String
  joinTargetOwner: String
  joinTargetTable: String
  joinTargetColumn: String
  attribute: AttributeUpdateOneRequiredWithoutInputColumnsInput
}

input InputColumnUpdateManyDataInput {
  owner: String
  table: String
  column: String
  script: String
  joinSourceColumn: String
  joinTargetOwner: String
  joinTargetTable: String
  joinTargetColumn: String
}

input InputColumnUpdateManyMutationInput {
  owner: String
  table: String
  column: String
  script: String
  joinSourceColumn: String
  joinTargetOwner: String
  joinTargetTable: String
  joinTargetColumn: String
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

input InputColumnUpdateWithoutAttributeDataInput {
  owner: String
  table: String
  column: String
  script: String
  joinSourceColumn: String
  joinTargetOwner: String
  joinTargetTable: String
  joinTargetColumn: String
}

input InputColumnUpdateWithWhereUniqueWithoutAttributeInput {
  where: InputColumnWhereUniqueInput!
  data: InputColumnUpdateWithoutAttributeDataInput!
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
  joinSourceColumn: String

  """All values that are not equal to given value."""
  joinSourceColumn_not: String

  """All values that are contained in given list."""
  joinSourceColumn_in: [String!]

  """All values that are not contained in given list."""
  joinSourceColumn_not_in: [String!]

  """All values less than the given value."""
  joinSourceColumn_lt: String

  """All values less than or equal the given value."""
  joinSourceColumn_lte: String

  """All values greater than the given value."""
  joinSourceColumn_gt: String

  """All values greater than or equal the given value."""
  joinSourceColumn_gte: String

  """All values containing the given string."""
  joinSourceColumn_contains: String

  """All values not containing the given string."""
  joinSourceColumn_not_contains: String

  """All values starting with the given string."""
  joinSourceColumn_starts_with: String

  """All values not starting with the given string."""
  joinSourceColumn_not_starts_with: String

  """All values ending with the given string."""
  joinSourceColumn_ends_with: String

  """All values not ending with the given string."""
  joinSourceColumn_not_ends_with: String
  joinTargetOwner: String

  """All values that are not equal to given value."""
  joinTargetOwner_not: String

  """All values that are contained in given list."""
  joinTargetOwner_in: [String!]

  """All values that are not contained in given list."""
  joinTargetOwner_not_in: [String!]

  """All values less than the given value."""
  joinTargetOwner_lt: String

  """All values less than or equal the given value."""
  joinTargetOwner_lte: String

  """All values greater than the given value."""
  joinTargetOwner_gt: String

  """All values greater than or equal the given value."""
  joinTargetOwner_gte: String

  """All values containing the given string."""
  joinTargetOwner_contains: String

  """All values not containing the given string."""
  joinTargetOwner_not_contains: String

  """All values starting with the given string."""
  joinTargetOwner_starts_with: String

  """All values not starting with the given string."""
  joinTargetOwner_not_starts_with: String

  """All values ending with the given string."""
  joinTargetOwner_ends_with: String

  """All values not ending with the given string."""
  joinTargetOwner_not_ends_with: String
  joinTargetTable: String

  """All values that are not equal to given value."""
  joinTargetTable_not: String

  """All values that are contained in given list."""
  joinTargetTable_in: [String!]

  """All values that are not contained in given list."""
  joinTargetTable_not_in: [String!]

  """All values less than the given value."""
  joinTargetTable_lt: String

  """All values less than or equal the given value."""
  joinTargetTable_lte: String

  """All values greater than the given value."""
  joinTargetTable_gt: String

  """All values greater than or equal the given value."""
  joinTargetTable_gte: String

  """All values containing the given string."""
  joinTargetTable_contains: String

  """All values not containing the given string."""
  joinTargetTable_not_contains: String

  """All values starting with the given string."""
  joinTargetTable_starts_with: String

  """All values not starting with the given string."""
  joinTargetTable_not_starts_with: String

  """All values ending with the given string."""
  joinTargetTable_ends_with: String

  """All values not ending with the given string."""
  joinTargetTable_not_ends_with: String
  joinTargetColumn: String

  """All values that are not equal to given value."""
  joinTargetColumn_not: String

  """All values that are contained in given list."""
  joinTargetColumn_in: [String!]

  """All values that are not contained in given list."""
  joinTargetColumn_not_in: [String!]

  """All values less than the given value."""
  joinTargetColumn_lt: String

  """All values less than or equal the given value."""
  joinTargetColumn_lte: String

  """All values greater than the given value."""
  joinTargetColumn_gt: String

  """All values greater than or equal the given value."""
  joinTargetColumn_gte: String

  """All values containing the given string."""
  joinTargetColumn_contains: String

  """All values not containing the given string."""
  joinTargetColumn_not_contains: String

  """All values starting with the given string."""
  joinTargetColumn_starts_with: String

  """All values not starting with the given string."""
  joinTargetColumn_not_starts_with: String

  """All values ending with the given string."""
  joinTargetColumn_ends_with: String

  """All values not ending with the given string."""
  joinTargetColumn_not_ends_with: String
  attribute: AttributeWhereInput
}

input InputColumnWhereUniqueInput {
  id: ID
}

"""
The \`Long\` scalar type represents non-fractional signed whole numeric values.
Long can represent values between -(2^63) and 2^63 - 1.
"""
scalar Long

type Mapping implements Node {
  id: ID!
  database: String!
  resources(where: ResourceWhereInput, orderBy: ResourceOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Resource!]
}

"""A connection to a list of items."""
type MappingConnection {
  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """A list of edges."""
  edges: [MappingEdge]!
  aggregate: AggregateMapping!
}

input MappingCreateInput {
  database: String!
  resources: ResourceCreateManyWithoutDatabaseInput
}

input MappingCreateOneWithoutResourcesInput {
  create: MappingCreateWithoutResourcesInput
  connect: MappingWhereUniqueInput
}

input MappingCreateWithoutResourcesInput {
  database: String!
}

"""An edge in a connection."""
type MappingEdge {
  """The item at the end of the edge."""
  node: Mapping!

  """A cursor for use in pagination."""
  cursor: String!
}

enum MappingOrderByInput {
  id_ASC
  id_DESC
  database_ASC
  database_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type MappingPreviousValues {
  id: ID!
  database: String!
}

type MappingSubscriptionPayload {
  mutation: MutationType!
  node: Mapping
  updatedFields: [String!]
  previousValues: MappingPreviousValues
}

input MappingSubscriptionWhereInput {
  """Logical AND on all given filters."""
  AND: [MappingSubscriptionWhereInput!]

  """Logical OR on all given filters."""
  OR: [MappingSubscriptionWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [MappingSubscriptionWhereInput!]

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
  node: MappingWhereInput
}

input MappingUpdateInput {
  database: String
  resources: ResourceUpdateManyWithoutDatabaseInput
}

input MappingUpdateManyMutationInput {
  database: String
}

input MappingUpdateOneRequiredWithoutResourcesInput {
  create: MappingCreateWithoutResourcesInput
  connect: MappingWhereUniqueInput
  update: MappingUpdateWithoutResourcesDataInput
  upsert: MappingUpsertWithoutResourcesInput
}

input MappingUpdateWithoutResourcesDataInput {
  database: String
}

input MappingUpsertWithoutResourcesInput {
  update: MappingUpdateWithoutResourcesDataInput!
  create: MappingCreateWithoutResourcesInput!
}

input MappingWhereInput {
  """Logical AND on all given filters."""
  AND: [MappingWhereInput!]

  """Logical OR on all given filters."""
  OR: [MappingWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [MappingWhereInput!]
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
  database: String

  """All values that are not equal to given value."""
  database_not: String

  """All values that are contained in given list."""
  database_in: [String!]

  """All values that are not contained in given list."""
  database_not_in: [String!]

  """All values less than the given value."""
  database_lt: String

  """All values less than or equal the given value."""
  database_lte: String

  """All values greater than the given value."""
  database_gt: String

  """All values greater than or equal the given value."""
  database_gte: String

  """All values containing the given string."""
  database_contains: String

  """All values not containing the given string."""
  database_not_contains: String

  """All values starting with the given string."""
  database_starts_with: String

  """All values not starting with the given string."""
  database_not_starts_with: String

  """All values ending with the given string."""
  database_ends_with: String

  """All values not ending with the given string."""
  database_not_ends_with: String
  resources_every: ResourceWhereInput
  resources_some: ResourceWhereInput
  resources_none: ResourceWhereInput
}

input MappingWhereUniqueInput {
  id: ID
  database: String
}

type Mutation {
  createMapping(data: MappingCreateInput!): Mapping!
  createResource(data: ResourceCreateInput!): Resource!
  createAttribute(data: AttributeCreateInput!): Attribute!
  createInputColumn(data: InputColumnCreateInput!): InputColumn!
  updateMapping(data: MappingUpdateInput!, where: MappingWhereUniqueInput!): Mapping
  updateResource(data: ResourceUpdateInput!, where: ResourceWhereUniqueInput!): Resource
  updateAttribute(data: AttributeUpdateInput!, where: AttributeWhereUniqueInput!): Attribute
  updateInputColumn(data: InputColumnUpdateInput!, where: InputColumnWhereUniqueInput!): InputColumn
  deleteMapping(where: MappingWhereUniqueInput!): Mapping
  deleteResource(where: ResourceWhereUniqueInput!): Resource
  deleteAttribute(where: AttributeWhereUniqueInput!): Attribute
  deleteInputColumn(where: InputColumnWhereUniqueInput!): InputColumn
  upsertMapping(where: MappingWhereUniqueInput!, create: MappingCreateInput!, update: MappingUpdateInput!): Mapping!
  upsertResource(where: ResourceWhereUniqueInput!, create: ResourceCreateInput!, update: ResourceUpdateInput!): Resource!
  upsertAttribute(where: AttributeWhereUniqueInput!, create: AttributeCreateInput!, update: AttributeUpdateInput!): Attribute!
  upsertInputColumn(where: InputColumnWhereUniqueInput!, create: InputColumnCreateInput!, update: InputColumnUpdateInput!): InputColumn!
  updateManyMappings(data: MappingUpdateManyMutationInput!, where: MappingWhereInput): BatchPayload!
  updateManyResources(data: ResourceUpdateManyMutationInput!, where: ResourceWhereInput): BatchPayload!
  updateManyAttributes(data: AttributeUpdateManyMutationInput!, where: AttributeWhereInput): BatchPayload!
  updateManyInputColumns(data: InputColumnUpdateManyMutationInput!, where: InputColumnWhereInput): BatchPayload!
  deleteManyMappings(where: MappingWhereInput): BatchPayload!
  deleteManyResources(where: ResourceWhereInput): BatchPayload!
  deleteManyAttributes(where: AttributeWhereInput): BatchPayload!
  deleteManyInputColumns(where: InputColumnWhereInput): BatchPayload!
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
  mappings(where: MappingWhereInput, orderBy: MappingOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Mapping]!
  resources(where: ResourceWhereInput, orderBy: ResourceOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Resource]!
  attributes(where: AttributeWhereInput, orderBy: AttributeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Attribute]!
  inputColumns(where: InputColumnWhereInput, orderBy: InputColumnOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [InputColumn]!
  mapping(where: MappingWhereUniqueInput!): Mapping
  resource(where: ResourceWhereUniqueInput!): Resource
  attribute(where: AttributeWhereUniqueInput!): Attribute
  inputColumn(where: InputColumnWhereUniqueInput!): InputColumn
  mappingsConnection(where: MappingWhereInput, orderBy: MappingOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): MappingConnection!
  resourcesConnection(where: ResourceWhereInput, orderBy: ResourceOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ResourceConnection!
  attributesConnection(where: AttributeWhereInput, orderBy: AttributeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): AttributeConnection!
  inputColumnsConnection(where: InputColumnWhereInput, orderBy: InputColumnOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): InputColumnConnection!

  """Fetches an object given its ID"""
  node(
    """The ID of an object"""
    id: ID!
  ): Node
}

type Resource implements Node {
  id: ID!
  database: Mapping!
  name: String!
  primaryKey: String!
  attributes(where: AttributeWhereInput, orderBy: AttributeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Attribute!]
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
  primaryKey: String!
  database: MappingCreateOneWithoutResourcesInput!
  attributes: AttributeCreateManyWithoutResourceInput
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
  primaryKey: String!
  database: MappingCreateOneWithoutResourcesInput!
}

input ResourceCreateWithoutDatabaseInput {
  name: String!
  primaryKey: String!
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
  primaryKey_ASC
  primaryKey_DESC
  updatedAt_ASC
  updatedAt_DESC
  createdAt_ASC
  createdAt_DESC
}

type ResourcePreviousValues {
  id: ID!
  name: String!
  primaryKey: String!
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
  primaryKey: String

  """All values that are not equal to given value."""
  primaryKey_not: String

  """All values that are contained in given list."""
  primaryKey_in: [String!]

  """All values that are not contained in given list."""
  primaryKey_not_in: [String!]

  """All values less than the given value."""
  primaryKey_lt: String

  """All values less than or equal the given value."""
  primaryKey_lte: String

  """All values greater than the given value."""
  primaryKey_gt: String

  """All values greater than or equal the given value."""
  primaryKey_gte: String

  """All values containing the given string."""
  primaryKey_contains: String

  """All values not containing the given string."""
  primaryKey_not_contains: String

  """All values starting with the given string."""
  primaryKey_starts_with: String

  """All values not starting with the given string."""
  primaryKey_not_starts_with: String

  """All values ending with the given string."""
  primaryKey_ends_with: String

  """All values not ending with the given string."""
  primaryKey_not_ends_with: String
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
  primaryKey: String
  database: MappingUpdateOneRequiredWithoutResourcesInput
  attributes: AttributeUpdateManyWithoutResourceInput
}

input ResourceUpdateManyDataInput {
  name: String
  primaryKey: String
}

input ResourceUpdateManyMutationInput {
  name: String
  primaryKey: String
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

input ResourceUpdateOneRequiredWithoutAttributesInput {
  create: ResourceCreateWithoutAttributesInput
  connect: ResourceWhereUniqueInput
  update: ResourceUpdateWithoutAttributesDataInput
  upsert: ResourceUpsertWithoutAttributesInput
}

input ResourceUpdateWithoutAttributesDataInput {
  name: String
  primaryKey: String
  database: MappingUpdateOneRequiredWithoutResourcesInput
}

input ResourceUpdateWithoutDatabaseDataInput {
  name: String
  primaryKey: String
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
  primaryKey: String

  """All values that are not equal to given value."""
  primaryKey_not: String

  """All values that are contained in given list."""
  primaryKey_in: [String!]

  """All values that are not contained in given list."""
  primaryKey_not_in: [String!]

  """All values less than the given value."""
  primaryKey_lt: String

  """All values less than or equal the given value."""
  primaryKey_lte: String

  """All values greater than the given value."""
  primaryKey_gt: String

  """All values greater than or equal the given value."""
  primaryKey_gte: String

  """All values containing the given string."""
  primaryKey_contains: String

  """All values not containing the given string."""
  primaryKey_not_contains: String

  """All values starting with the given string."""
  primaryKey_starts_with: String

  """All values not starting with the given string."""
  primaryKey_not_starts_with: String

  """All values ending with the given string."""
  primaryKey_ends_with: String

  """All values not ending with the given string."""
  primaryKey_not_ends_with: String
  database: MappingWhereInput
  attributes_every: AttributeWhereInput
  attributes_some: AttributeWhereInput
  attributes_none: AttributeWhereInput
}

input ResourceWhereUniqueInput {
  id: ID
}

type Subscription {
  mapping(where: MappingSubscriptionWhereInput): MappingSubscriptionPayload
  resource(where: ResourceSubscriptionWhereInput): ResourceSubscriptionPayload
  attribute(where: AttributeSubscriptionWhereInput): AttributeSubscriptionPayload
  inputColumn(where: InputColumnSubscriptionWhereInput): InputColumnSubscriptionPayload
}
`

export const Prisma = makePrismaBindingClass<BindingConstructor<Prisma>>({typeDefs})

/**
 * Types
*/

export type MappingOrderByInput =   'id_ASC' |
  'id_DESC' |
  'database_ASC' |
  'database_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'createdAt_ASC' |
  'createdAt_DESC'

export type ResourceOrderByInput =   'id_ASC' |
  'id_DESC' |
  'name_ASC' |
  'name_DESC' |
  'primaryKey_ASC' |
  'primaryKey_DESC' |
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
  'joinSourceColumn_ASC' |
  'joinSourceColumn_DESC' |
  'joinTargetOwner_ASC' |
  'joinTargetOwner_DESC' |
  'joinTargetTable_ASC' |
  'joinTargetTable_DESC' |
  'joinTargetColumn_ASC' |
  'joinTargetColumn_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'createdAt_ASC' |
  'createdAt_DESC'

export type MutationType =   'CREATED' |
  'UPDATED' |
  'DELETED'

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

export interface MappingWhereInput {
  AND?: MappingWhereInput[] | MappingWhereInput
  OR?: MappingWhereInput[] | MappingWhereInput
  NOT?: MappingWhereInput[] | MappingWhereInput
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
  database?: String
  database_not?: String
  database_in?: String[] | String
  database_not_in?: String[] | String
  database_lt?: String
  database_lte?: String
  database_gt?: String
  database_gte?: String
  database_contains?: String
  database_not_contains?: String
  database_starts_with?: String
  database_not_starts_with?: String
  database_ends_with?: String
  database_not_ends_with?: String
  resources_every?: ResourceWhereInput
  resources_some?: ResourceWhereInput
  resources_none?: ResourceWhereInput
}

export interface InputColumnCreateWithoutAttributeInput {
  owner: String
  table: String
  column: String
  script?: String
  joinSourceColumn?: String
  joinTargetOwner?: String
  joinTargetTable?: String
  joinTargetColumn?: String
}

export interface ResourceUpdateInput {
  name?: String
  primaryKey?: String
  database?: MappingUpdateOneRequiredWithoutResourcesInput
  attributes?: AttributeUpdateManyWithoutResourceInput
}

export interface ResourceCreateInput {
  name: String
  primaryKey: String
  database: MappingCreateOneWithoutResourcesInput
  attributes?: AttributeCreateManyWithoutResourceInput
}

export interface AttributeUpdateWithWhereUniqueWithoutResourceInput {
  where: AttributeWhereUniqueInput
  data: AttributeUpdateWithoutResourceDataInput
}

export interface MappingCreateOneWithoutResourcesInput {
  create?: MappingCreateWithoutResourcesInput
  connect?: MappingWhereUniqueInput
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
  joinSourceColumn?: String
  joinSourceColumn_not?: String
  joinSourceColumn_in?: String[] | String
  joinSourceColumn_not_in?: String[] | String
  joinSourceColumn_lt?: String
  joinSourceColumn_lte?: String
  joinSourceColumn_gt?: String
  joinSourceColumn_gte?: String
  joinSourceColumn_contains?: String
  joinSourceColumn_not_contains?: String
  joinSourceColumn_starts_with?: String
  joinSourceColumn_not_starts_with?: String
  joinSourceColumn_ends_with?: String
  joinSourceColumn_not_ends_with?: String
  joinTargetOwner?: String
  joinTargetOwner_not?: String
  joinTargetOwner_in?: String[] | String
  joinTargetOwner_not_in?: String[] | String
  joinTargetOwner_lt?: String
  joinTargetOwner_lte?: String
  joinTargetOwner_gt?: String
  joinTargetOwner_gte?: String
  joinTargetOwner_contains?: String
  joinTargetOwner_not_contains?: String
  joinTargetOwner_starts_with?: String
  joinTargetOwner_not_starts_with?: String
  joinTargetOwner_ends_with?: String
  joinTargetOwner_not_ends_with?: String
  joinTargetTable?: String
  joinTargetTable_not?: String
  joinTargetTable_in?: String[] | String
  joinTargetTable_not_in?: String[] | String
  joinTargetTable_lt?: String
  joinTargetTable_lte?: String
  joinTargetTable_gt?: String
  joinTargetTable_gte?: String
  joinTargetTable_contains?: String
  joinTargetTable_not_contains?: String
  joinTargetTable_starts_with?: String
  joinTargetTable_not_starts_with?: String
  joinTargetTable_ends_with?: String
  joinTargetTable_not_ends_with?: String
  joinTargetColumn?: String
  joinTargetColumn_not?: String
  joinTargetColumn_in?: String[] | String
  joinTargetColumn_not_in?: String[] | String
  joinTargetColumn_lt?: String
  joinTargetColumn_lte?: String
  joinTargetColumn_gt?: String
  joinTargetColumn_gte?: String
  joinTargetColumn_contains?: String
  joinTargetColumn_not_contains?: String
  joinTargetColumn_starts_with?: String
  joinTargetColumn_not_starts_with?: String
  joinTargetColumn_ends_with?: String
  joinTargetColumn_not_ends_with?: String
  attribute?: AttributeWhereInput
}

export interface MappingCreateWithoutResourcesInput {
  database: String
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
  resource?: ResourceWhereInput
  inputColumns_every?: InputColumnWhereInput
  inputColumns_some?: InputColumnWhereInput
  inputColumns_none?: InputColumnWhereInput
}

export interface AttributeCreateInput {
  name: String
  mergingScript?: String
  resource: ResourceCreateOneWithoutAttributesInput
  inputColumns?: InputColumnCreateManyWithoutAttributeInput
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
  primaryKey?: String
  primaryKey_not?: String
  primaryKey_in?: String[] | String
  primaryKey_not_in?: String[] | String
  primaryKey_lt?: String
  primaryKey_lte?: String
  primaryKey_gt?: String
  primaryKey_gte?: String
  primaryKey_contains?: String
  primaryKey_not_contains?: String
  primaryKey_starts_with?: String
  primaryKey_not_starts_with?: String
  primaryKey_ends_with?: String
  primaryKey_not_ends_with?: String
  database?: MappingWhereInput
  attributes_every?: AttributeWhereInput
  attributes_some?: AttributeWhereInput
  attributes_none?: AttributeWhereInput
}

export interface ResourceCreateOneWithoutAttributesInput {
  create?: ResourceCreateWithoutAttributesInput
  connect?: ResourceWhereUniqueInput
}

export interface MappingWhereUniqueInput {
  id?: ID_Input
  database?: String
}

export interface ResourceCreateWithoutAttributesInput {
  name: String
  primaryKey: String
  database: MappingCreateOneWithoutResourcesInput
}

export interface AttributeWhereUniqueInput {
  id?: ID_Input
}

export interface InputColumnCreateInput {
  owner: String
  table: String
  column: String
  script?: String
  joinSourceColumn?: String
  joinTargetOwner?: String
  joinTargetTable?: String
  joinTargetColumn?: String
  attribute: AttributeCreateOneWithoutInputColumnsInput
}

export interface MappingSubscriptionWhereInput {
  AND?: MappingSubscriptionWhereInput[] | MappingSubscriptionWhereInput
  OR?: MappingSubscriptionWhereInput[] | MappingSubscriptionWhereInput
  NOT?: MappingSubscriptionWhereInput[] | MappingSubscriptionWhereInput
  mutation_in?: MutationType[] | MutationType
  updatedFields_contains?: String
  updatedFields_contains_every?: String[] | String
  updatedFields_contains_some?: String[] | String
  node?: MappingWhereInput
}

export interface AttributeCreateOneWithoutInputColumnsInput {
  create?: AttributeCreateWithoutInputColumnsInput
  connect?: AttributeWhereUniqueInput
}

export interface AttributeUpdateManyMutationInput {
  name?: String
  mergingScript?: String
}

export interface AttributeCreateWithoutInputColumnsInput {
  name: String
  mergingScript?: String
  resource: ResourceCreateOneWithoutAttributesInput
}

export interface MappingUpdateManyMutationInput {
  database?: String
}

export interface MappingUpdateInput {
  database?: String
  resources?: ResourceUpdateManyWithoutDatabaseInput
}

export interface AttributeUpdateWithoutInputColumnsDataInput {
  name?: String
  mergingScript?: String
  resource?: ResourceUpdateOneRequiredWithoutAttributesInput
}

export interface MappingUpdateWithoutResourcesDataInput {
  database?: String
}

export interface InputColumnUpdateInput {
  owner?: String
  table?: String
  column?: String
  script?: String
  joinSourceColumn?: String
  joinTargetOwner?: String
  joinTargetTable?: String
  joinTargetColumn?: String
  attribute?: AttributeUpdateOneRequiredWithoutInputColumnsInput
}

export interface ResourceUpdateWithWhereUniqueWithoutDatabaseInput {
  where: ResourceWhereUniqueInput
  data: ResourceUpdateWithoutDatabaseDataInput
}

export interface ResourceUpdateWithoutAttributesDataInput {
  name?: String
  primaryKey?: String
  database?: MappingUpdateOneRequiredWithoutResourcesInput
}

export interface ResourceUpdateWithoutDatabaseDataInput {
  name?: String
  primaryKey?: String
  attributes?: AttributeUpdateManyWithoutResourceInput
}

export interface AttributeUpdateInput {
  name?: String
  mergingScript?: String
  resource?: ResourceUpdateOneRequiredWithoutAttributesInput
  inputColumns?: InputColumnUpdateManyWithoutAttributeInput
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

export interface MappingCreateInput {
  database: String
  resources?: ResourceCreateManyWithoutDatabaseInput
}

export interface MappingUpdateOneRequiredWithoutResourcesInput {
  create?: MappingCreateWithoutResourcesInput
  connect?: MappingWhereUniqueInput
  update?: MappingUpdateWithoutResourcesDataInput
  upsert?: MappingUpsertWithoutResourcesInput
}

export interface ResourceCreateWithoutDatabaseInput {
  name: String
  primaryKey: String
  attributes?: AttributeCreateManyWithoutResourceInput
}

export interface AttributeUpdateWithoutResourceDataInput {
  name?: String
  mergingScript?: String
  inputColumns?: InputColumnUpdateManyWithoutAttributeInput
}

export interface AttributeCreateWithoutResourceInput {
  name: String
  mergingScript?: String
  inputColumns?: InputColumnCreateManyWithoutAttributeInput
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

export interface InputColumnUpdateWithWhereUniqueWithoutAttributeInput {
  where: InputColumnWhereUniqueInput
  data: InputColumnUpdateWithoutAttributeDataInput
}

export interface ResourceWhereUniqueInput {
  id?: ID_Input
}

export interface InputColumnUpdateWithoutAttributeDataInput {
  owner?: String
  table?: String
  column?: String
  script?: String
  joinSourceColumn?: String
  joinTargetOwner?: String
  joinTargetTable?: String
  joinTargetColumn?: String
}

export interface InputColumnUpdateManyMutationInput {
  owner?: String
  table?: String
  column?: String
  script?: String
  joinSourceColumn?: String
  joinTargetOwner?: String
  joinTargetTable?: String
  joinTargetColumn?: String
}

export interface InputColumnUpdateManyWithWhereNestedInput {
  where: InputColumnScalarWhereInput
  data: InputColumnUpdateManyDataInput
}

export interface AttributeUpsertWithoutInputColumnsInput {
  update: AttributeUpdateWithoutInputColumnsDataInput
  create: AttributeCreateWithoutInputColumnsInput
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
  joinSourceColumn?: String
  joinSourceColumn_not?: String
  joinSourceColumn_in?: String[] | String
  joinSourceColumn_not_in?: String[] | String
  joinSourceColumn_lt?: String
  joinSourceColumn_lte?: String
  joinSourceColumn_gt?: String
  joinSourceColumn_gte?: String
  joinSourceColumn_contains?: String
  joinSourceColumn_not_contains?: String
  joinSourceColumn_starts_with?: String
  joinSourceColumn_not_starts_with?: String
  joinSourceColumn_ends_with?: String
  joinSourceColumn_not_ends_with?: String
  joinTargetOwner?: String
  joinTargetOwner_not?: String
  joinTargetOwner_in?: String[] | String
  joinTargetOwner_not_in?: String[] | String
  joinTargetOwner_lt?: String
  joinTargetOwner_lte?: String
  joinTargetOwner_gt?: String
  joinTargetOwner_gte?: String
  joinTargetOwner_contains?: String
  joinTargetOwner_not_contains?: String
  joinTargetOwner_starts_with?: String
  joinTargetOwner_not_starts_with?: String
  joinTargetOwner_ends_with?: String
  joinTargetOwner_not_ends_with?: String
  joinTargetTable?: String
  joinTargetTable_not?: String
  joinTargetTable_in?: String[] | String
  joinTargetTable_not_in?: String[] | String
  joinTargetTable_lt?: String
  joinTargetTable_lte?: String
  joinTargetTable_gt?: String
  joinTargetTable_gte?: String
  joinTargetTable_contains?: String
  joinTargetTable_not_contains?: String
  joinTargetTable_starts_with?: String
  joinTargetTable_not_starts_with?: String
  joinTargetTable_ends_with?: String
  joinTargetTable_not_ends_with?: String
  joinTargetColumn?: String
  joinTargetColumn_not?: String
  joinTargetColumn_in?: String[] | String
  joinTargetColumn_not_in?: String[] | String
  joinTargetColumn_lt?: String
  joinTargetColumn_lte?: String
  joinTargetColumn_gt?: String
  joinTargetColumn_gte?: String
  joinTargetColumn_contains?: String
  joinTargetColumn_not_contains?: String
  joinTargetColumn_starts_with?: String
  joinTargetColumn_not_starts_with?: String
  joinTargetColumn_ends_with?: String
  joinTargetColumn_not_ends_with?: String
}

export interface ResourceUpsertWithoutAttributesInput {
  update: ResourceUpdateWithoutAttributesDataInput
  create: ResourceCreateWithoutAttributesInput
}

export interface InputColumnUpdateManyDataInput {
  owner?: String
  table?: String
  column?: String
  script?: String
  joinSourceColumn?: String
  joinTargetOwner?: String
  joinTargetTable?: String
  joinTargetColumn?: String
}

export interface MappingUpsertWithoutResourcesInput {
  update: MappingUpdateWithoutResourcesDataInput
  create: MappingCreateWithoutResourcesInput
}

export interface InputColumnUpsertWithWhereUniqueWithoutAttributeInput {
  where: InputColumnWhereUniqueInput
  update: InputColumnUpdateWithoutAttributeDataInput
  create: InputColumnCreateWithoutAttributeInput
}

export interface AttributeCreateManyWithoutResourceInput {
  create?: AttributeCreateWithoutResourceInput[] | AttributeCreateWithoutResourceInput
  connect?: AttributeWhereUniqueInput[] | AttributeWhereUniqueInput
}

export interface AttributeUpdateManyWithWhereNestedInput {
  where: AttributeScalarWhereInput
  data: AttributeUpdateManyDataInput
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
}

export interface InputColumnWhereUniqueInput {
  id?: ID_Input
}

export interface AttributeUpdateManyDataInput {
  name?: String
  mergingScript?: String
}

export interface AttributeUpdateOneRequiredWithoutInputColumnsInput {
  create?: AttributeCreateWithoutInputColumnsInput
  connect?: AttributeWhereUniqueInput
  update?: AttributeUpdateWithoutInputColumnsDataInput
  upsert?: AttributeUpsertWithoutInputColumnsInput
}

export interface AttributeUpsertWithWhereUniqueWithoutResourceInput {
  where: AttributeWhereUniqueInput
  update: AttributeUpdateWithoutResourceDataInput
  create: AttributeCreateWithoutResourceInput
}

export interface ResourceCreateManyWithoutDatabaseInput {
  create?: ResourceCreateWithoutDatabaseInput[] | ResourceCreateWithoutDatabaseInput
  connect?: ResourceWhereUniqueInput[] | ResourceWhereUniqueInput
}

export interface ResourceUpsertWithWhereUniqueWithoutDatabaseInput {
  where: ResourceWhereUniqueInput
  update: ResourceUpdateWithoutDatabaseDataInput
  create: ResourceCreateWithoutDatabaseInput
}

export interface ResourceUpdateManyDataInput {
  name?: String
  primaryKey?: String
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
  primaryKey?: String
  primaryKey_not?: String
  primaryKey_in?: String[] | String
  primaryKey_not_in?: String[] | String
  primaryKey_lt?: String
  primaryKey_lte?: String
  primaryKey_gt?: String
  primaryKey_gte?: String
  primaryKey_contains?: String
  primaryKey_not_contains?: String
  primaryKey_starts_with?: String
  primaryKey_not_starts_with?: String
  primaryKey_ends_with?: String
  primaryKey_not_ends_with?: String
}

export interface ResourceUpdateManyWithWhereNestedInput {
  where: ResourceScalarWhereInput
  data: ResourceUpdateManyDataInput
}

export interface InputColumnCreateManyWithoutAttributeInput {
  create?: InputColumnCreateWithoutAttributeInput[] | InputColumnCreateWithoutAttributeInput
  connect?: InputColumnWhereUniqueInput[] | InputColumnWhereUniqueInput
}

export interface ResourceUpdateOneRequiredWithoutAttributesInput {
  create?: ResourceCreateWithoutAttributesInput
  connect?: ResourceWhereUniqueInput
  update?: ResourceUpdateWithoutAttributesDataInput
  upsert?: ResourceUpsertWithoutAttributesInput
}

export interface ResourceUpdateManyMutationInput {
  name?: String
  primaryKey?: String
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

/*
 * An object with an ID

 */
export interface Node {
  id: ID_Output
}

export interface InputColumnPreviousValues {
  id: ID_Output
  owner: String
  table: String
  column: String
  script?: String
  joinSourceColumn?: String
  joinTargetOwner?: String
  joinTargetTable?: String
  joinTargetColumn?: String
}

export interface InputColumnSubscriptionPayload {
  mutation: MutationType
  node?: InputColumn
  updatedFields?: String[]
  previousValues?: InputColumnPreviousValues
}

export interface AttributeSubscriptionPayload {
  mutation: MutationType
  node?: Attribute
  updatedFields?: String[]
  previousValues?: AttributePreviousValues
}

/*
 * An edge in a connection.

 */
export interface MappingEdge {
  node: Mapping
  cursor: String
}

export interface Mapping extends Node {
  id: ID_Output
  database: String
  resources?: Resource[]
}

export interface Resource extends Node {
  id: ID_Output
  database: Mapping
  name: String
  primaryKey: String
  attributes?: Attribute[]
}

/*
 * An edge in a connection.

 */
export interface InputColumnEdge {
  node: InputColumn
  cursor: String
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

export interface AggregateAttribute {
  count: Int
}

/*
 * A connection to a list of items.

 */
export interface MappingConnection {
  pageInfo: PageInfo
  edges: MappingEdge[]
  aggregate: AggregateMapping
}

/*
 * A connection to a list of items.

 */
export interface AttributeConnection {
  pageInfo: PageInfo
  edges: AttributeEdge[]
  aggregate: AggregateAttribute
}

export interface AttributePreviousValues {
  id: ID_Output
  name: String
  mergingScript?: String
}

/*
 * An edge in a connection.

 */
export interface ResourceEdge {
  node: Resource
  cursor: String
}

export interface MappingSubscriptionPayload {
  mutation: MutationType
  node?: Mapping
  updatedFields?: String[]
  previousValues?: MappingPreviousValues
}

export interface AggregateMapping {
  count: Int
}

export interface MappingPreviousValues {
  id: ID_Output
  database: String
}

export interface AggregateInputColumn {
  count: Int
}

/*
 * An edge in a connection.

 */
export interface AttributeEdge {
  node: Attribute
  cursor: String
}

export interface Attribute extends Node {
  id: ID_Output
  resource: Resource
  name: String
  inputColumns?: InputColumn[]
  mergingScript?: String
}

export interface ResourcePreviousValues {
  id: ID_Output
  name: String
  primaryKey: String
}

export interface ResourceSubscriptionPayload {
  mutation: MutationType
  node?: Resource
  updatedFields?: String[]
  previousValues?: ResourcePreviousValues
}

export interface InputColumn extends Node {
  id: ID_Output
  attribute: Attribute
  owner: String
  table: String
  column: String
  script?: String
  joinSourceColumn?: String
  joinTargetOwner?: String
  joinTargetTable?: String
  joinTargetColumn?: String
}

export interface AggregateResource {
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

export interface BatchPayload {
  count: Long
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

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number
export type ID_Output = string

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string
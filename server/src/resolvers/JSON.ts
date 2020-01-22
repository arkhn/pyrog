import { asNexusMethod } from 'nexus'
import GraphQLJSON from 'graphql-type-json'

export const JSON = asNexusMethod(GraphQLJSON, 'JSON')

import { asNexusMethod } from '@nexus/schema'
import GraphQLJSON from 'graphql-type-json'

export const JSON = asNexusMethod(GraphQLJSON, 'JSON')

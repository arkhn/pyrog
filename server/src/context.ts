import { PrismaClient } from '@prisma/client'
import { ContextParameters } from 'graphql-yoga/dist/types'
const prismaClient = new PrismaClient()

export interface Context {
  prismaClient: PrismaClient
  request: any
}

export function createContext(request: ContextParameters) {
  return {
    ...request,
    prismaClient,
  }
}

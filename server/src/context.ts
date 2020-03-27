import { PrismaClient, User } from '@prisma/client'
import { ContextParameters } from 'graphql-yoga/dist/types'
import { getUser } from 'utils'

const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient
  request: any
  user?: User
}

export const createContext = async (context: ContextParameters) => ({
  ...context,
  prisma,
  user: await getUser(context.request),
})

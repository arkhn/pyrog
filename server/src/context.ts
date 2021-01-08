import { PrismaClient, User } from '@prisma/client'
import { getUser } from 'utils'

const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient
  request: any
  user?: User
}

export const createContext = async (context: any) => ({
  ...context,
  prisma,
  user: await getUser(context.req, prisma),
})

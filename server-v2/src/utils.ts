import { verify } from 'jsonwebtoken'
import { Context } from './context'
import {
  Resource,
  AttributeCreateWithoutParentInput,
  AttributeCreateWithoutResourceInput,
} from '@prisma/photon'

export const APP_SECRET = 'appsecret321'

interface Token {
  userId: string
}

export function getUserId(context: Context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, APP_SECRET) as Token
    return verifiedToken && verifiedToken.userId
  }
}

export const fetchResourceSchema = (resourceName: String) => {
  try {
    return require(`generated/fhir/${resourceName}.json`)
  } catch (e) {
    throw new Error(`Resource ${resourceName} does not exist.`)
  }
}

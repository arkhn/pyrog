import axios from 'axios'
import qs from 'querystring'
import * as crypto from 'crypto'
import cache from 'cache'
import { Request } from 'express'
import jwt_decode from 'jwt-decode'
import { User, PrismaClient } from '@prisma/client'

import { APP_SECRET, TOKEN_INTROSPECTION_URL, USER_INFO_URL } from './constants'

export const getUser = async (
  request: Request,
  prisma: PrismaClient,
): Promise<User | null> => {
  const authorization = request.get('Authorization')
  const idToken = request.get('IdToken')

  if (!authorization) {
    return null
  }

  if (idToken) {
    const decodedIdToken = jwt_decode(idToken)
    const user = await getUserFromCache(decodedIdToken)
    if (user) return user
  }

  let userData
  let tokenTTL

  // Introspect the access token
  try {
    const introspectionResp = await axios.post(
      TOKEN_INTROSPECTION_URL!,
      qs.stringify({
        token: authorization.replace('Bearer ', ''),
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
    if (!introspectionResp.data.active) {
      return null
    }
    tokenTTL = introspectionResp.data.exp
  } catch (error) {
    return null
  }

  // Get info about the user
  try {
    if (idToken) {
      // Whether via the id token
      userData = jwt_decode(idToken)
    } else {
      // Or we use the /userinfo endpoint
      const userInfoResp = await axios.get(USER_INFO_URL!, {
        headers: {
          authorization,
        },
      })
      userData = userInfoResp.data
    }
  } catch (error) {
    return null
  }

  // We'll insert a new user at its first query to pyrog-server only
  const user = await prisma.user.upsert({
    where: { email: userData.email },
    create: {
      email: userData.email,
      name: userData.name,
    },
    update: {
      name: userData.name,
    },
  })
  await cacheUser(user, tokenTTL)
  return user
}

const getUserFromCache = async (decodedIdToken: any) => {
  const { get } = cache()
  const cached = await get(`user:${decodedIdToken.email}`)
  if (cached) {
    const user: User = JSON.parse(cached)
    return user
  }
  return null
}

const cacheUser = async (user: User, tokenTTL: number) => {
  const { set } = cache()
  // We cache a user for 10 minutes max before rechecking its identity
  const expiresIn = tokenTTL || 10 * 60
  await set(
    `user:${user.email}`,
    JSON.stringify(user),
    'EX',
    Math.min(10 * 60, expiresIn),
  )
}

export const encrypt = (text: string) => {
  const iv = crypto.randomBytes(16)

  let cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(APP_SECRET!),
    iv,
  )
  let encrypted = cipher.update(text)

  encrypted = Buffer.concat([encrypted, cipher.final()])

  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export const decrypt = (text: string) => {
  let textParts = text.split(':')
  let encryptedText = Buffer.from(textParts[1], 'hex')
  let iv = Buffer.from(textParts[0], 'hex')
  let decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(APP_SECRET!),
    iv,
  )
  let decrypted = decipher.update(encryptedText)

  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString()
}

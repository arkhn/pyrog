import axios from 'axios'
import qs from 'querystring'
import * as crypto from 'crypto'
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
    // Pyrog server needs both access and id tokens
    return null
  }
  let userData
  try {
    if (idToken) {
      userData = jwt_decode(idToken)
      // const cached = await getUserFromCache(decodedIdToken)
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
        // Token is not active
        return null
      }
    } else {
      // We use the /userinfo endpoint to fetch user informations
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
  // We cache a user for 10 minutes max before rechecking its identity with Hydra
  // await cacheUser(user)
  return user
}

// const { get, set } = cache()

// const getUserFromCache = async (decodedIdToken: any) => {
//   const cached = await get(`user:${decodedIdToken.email}`)
//   if (cached) {
//     const user: User = JSON.parse(cached)
//     return user
//   }
//   return null
// }

// const cacheUser = async (user: User) => {
//   const expiresIn = introspectionResp.data.exp || 10 * 60
//   await set(
//     `user:${user.email}`,
//     JSON.stringify(user),
//     'EX',
//     Math.min(5, expiresIn),
//   )
// }

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

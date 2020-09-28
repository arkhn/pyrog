import axios from 'axios'
import qs from 'querystring'
import * as crypto from 'crypto'
import cache from 'cache'
import { Request } from 'express'
import jwt_decode from 'jwt-decode'
import { User, PrismaClient } from '@prisma/client'

import { APP_SECRET, TOKEN_INTROSPECTION_URL } from './constants'

export const getUser = async (
  request: Request,
  prisma: PrismaClient,
): Promise<User | null> => {
  const authorization = request.get('Authorization')
  const idToken = request.get('IdToken')

  const { get, set } = cache()

  if (!idToken || !authorization) {
    // Pyrog server needs both access and id tokens
    return null
  } else {
    const decodedIdToken: any = jwt_decode(idToken)
    const cached = await get(`user:${decodedIdToken.email}`)
    if (cached) {
      const user: User = JSON.parse(cached)
      return user
    }
    try {
      // TODO we don't check that info in idToken and user corresponding to the
      // access token are the same. This could be a problem if the id token has
      // rights the access token doesn't have
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
      const user = await prisma.user.upsert({
        where: { email: decodedIdToken.email },
        create: {
          email: decodedIdToken.email,
          name: decodedIdToken.name,
        },
        update: {
          name: decodedIdToken.name,
        },
      })
      const expiresIn = introspectionResp.data.exp || 10 * 60
      // We cache a user for 10 minutes max before rechecking its identity with Hydra
      await set(
        `user:${decodedIdToken.email}`,
        JSON.stringify(user),
        'EX',
        Math.min(5, expiresIn),
      )
      return user
    } catch (error) {
      return null
    }
  }
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

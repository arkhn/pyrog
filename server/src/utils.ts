import axios from 'axios'
import * as crypto from 'crypto'
import cache from 'cache'
import { Request } from 'express'
import jwt_decode from 'jwt-decode'
import { User, PrismaClient } from '@prisma/client'
import { AuthenticationError } from 'apollo-server'

import { APP_SECRET, USER_INFO_URL } from './constants'

export const getUser = async (
  request: Request,
  prisma: PrismaClient,
): Promise<User | null> => {
  console.log("in getuser")
  
  const authorization = request.get('Authorization')
  const idToken = request.get('IdToken')
  
  const { get, set } = cache()

  if (idToken) {
    const decodedIdToken: any = jwt_decode(`${idToken}`)
    const cached = await get(`user:${decodedIdToken.email}`)
    if (cached) {
      const user: User = JSON.parse(cached)
      return user
    }
  }
  if (authorization) {
    try {
      // Get user info from access token
      const userInfoResp = await axios.get(USER_INFO_URL!, {
        headers: {
          authorization,
        },
      })
      console.log(userInfoResp.data)
      const user = await prisma.user.findOne({
        where: { email: userInfoResp.data.email },
      })
      console.log(user)
      // We cache a user for 10 minutes before rechecking its identity with Hydra
      // await set(`user:${userInfoResp.data.email}`, JSON.stringify(user), 'EX', 60 * 10)
      await set(
        `user:${userInfoResp.data.email}`,
        JSON.stringify(user),
        'EX',
        5,
      )
      return user
    } catch (error) {
      console.log('Token expired')
      return null
    }
  }
  return null
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

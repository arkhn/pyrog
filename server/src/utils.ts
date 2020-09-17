import axios from 'axios'
import * as crypto from 'crypto'
import { User } from '@prisma/client'

import { APP_SECRET, USER_INFO_URL } from './constants'
import cache from 'cache'
import { Request } from 'express'

export const getUser = async (request: Request): Promise<User | null> => {
  const Authorization = request.get('Authorization')
  if (Authorization) {
    const userInfoResp = await axios.get(USER_INFO_URL!, {
      headers: {
        Authorization,
      },
    })
    const { get } = cache()

    const cached = await get(`user:${userInfoResp.data.email}`)
    const user: User = JSON.parse(cached)
    return user
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

import * as fs from 'fs'
import * as crypto from 'crypto'

import { verify } from 'jsonwebtoken'

import { Context } from './context'
import { APP_SECRET, IV } from './constants'

interface Token {
  userId: string
}

export function getUserId(context: Context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, APP_SECRET!) as Token
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

export const availableResources = async () => {
  const dir = await fs.promises.opendir('src/generated/fhir')
  let ret = []
  for await (const dirent of dir) {
    ret.push(dirent.name.replace('.json', ''))
  }
  return ret
}

export const encrypt = (text: string) => {
  let cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(APP_SECRET!),
    IV,
  )
  let encrypted = cipher.update(text)

  encrypted = Buffer.concat([encrypted, cipher.final()])

  return IV.toString('hex') + ':' + encrypted.toString('hex')
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

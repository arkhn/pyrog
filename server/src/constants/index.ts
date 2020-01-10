import { randomBytes } from 'crypto'

export const { APP_SECRET, SCHEMAS_DIR } = process.env

const IV_LENGTH = 16 // For AES, this is always 16
export const IV = randomBytes(IV_LENGTH)

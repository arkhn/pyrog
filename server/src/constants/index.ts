import { randomBytes } from 'crypto'

export const {
  APP_SECRET,
  JWT_TOKEN,
  JWT_PRIVATE_KEY: priv,
  SCHEMAS_DIR,
  FHIR_API_URL,
  PAGAI_URL,
  REDIS_URL,
} = process.env
if (!priv) {
  throw new Error('MISSING "JWT_PRIVATE_KEY" in environment variables')
}
export const JWT_SIGNING_KEY = priv.replace(/\\n/g, '\n')

const IV_LENGTH = 16 // For AES, this is always 16
export const IV = randomBytes(IV_LENGTH)

export const MAPPING_VERSION_1 = 1
export const MAPPING_VERSION_2 = 2
export const MAPPING_VERSION_3 = 3
export const MAPPING_VERSION_4 = 4
export const MAPPING_VERSION_5 = 5
export const MAPPING_VERSION_6 = 6
export const MAPPING_VERSION_7 = 7
export const MAPPING_VERSION_8 = 8
export const CURRENT_MAPPING_VERSION = MAPPING_VERSION_8

export const HL7_AUTHOR = 'HL7'

import { User } from '@prisma/client'

export const {
  APP_SECRET,
  ENV,
  FHIR_API_URL,
  OAUTH2_CLIENT_ID,
  OAUTH2_TOKEN_URL,
  PAGAI_URL,
  REDIS_URL,
  TOKEN_INTROSPECTION_URL,
  USER_INFO_URL,
  DEFINITIONS_DIR,
} = process.env

const TEST_ENV = 'test'
export const IN_PROD = ENV !== TEST_ENV

export const MAPPING_VERSION_1 = 1
export const MAPPING_VERSION_2 = 2
export const MAPPING_VERSION_3 = 3
export const MAPPING_VERSION_4 = 4
export const MAPPING_VERSION_5 = 5
export const MAPPING_VERSION_6 = 6
export const MAPPING_VERSION_7 = 7
export const MAPPING_VERSION_8 = 8
export const MAPPING_VERSION_9 = 9
export const MAPPING_VERSION_10 = 10
export const CURRENT_MAPPING_VERSION = MAPPING_VERSION_10

export const HL7_AUTHOR = 'HL7'

export const TEST_ADMIN_USER = {
  id: 'admin',
  name: 'admin',
  email: 'test@arkhn.com',
  role: 'ADMIN',
} as User

import { randomBytes } from 'crypto'

export const { APP_SECRET, SCHEMAS_DIR, FHIR_API_URL, REDIS_URL } = process.env

const IV_LENGTH = 16 // For AES, this is always 16
export const IV = randomBytes(IV_LENGTH)

export const MAPPING_VERSION_1 = 1
export const MAPPING_VERSION_2 = 2
export const MAPPING_VERSION_3 = 3
export const MAPPING_VERSION_4 = 4
export const MAPPING_VERSION_5 = 5
export const MAPPING_VERSION_6 = 6
export const MAPPING_VERSION_7 = 7
export const CURRENT_MAPPING_VERSION = MAPPING_VERSION_7

export const HL7_AUTHOR = 'HL7'

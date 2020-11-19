import fs from 'fs'
import { join } from 'path'
import { promisify } from 'util'

import axios from 'axios'
import { structurize, Definition } from '@arkhn/fhir.ts'

import { FHIR_API_URL, DEFINITIONS_DIR } from '../constants'
import cache from 'cache'

const readDir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

// Gets a definition from the cache.
export const getDefinition = async (
  id: string,
): Promise<Definition | undefined> => {
  const { get } = cache()
  const res = await get(id)
  if (!res) {
    // if the definition was not found in the cache, fetch it from fhir-api
    try {
      const { data } = await axios.get(
        `${FHIR_API_URL}/StructureDefinition/${id}`,
      )
      return cacheDefinition(data)
    } catch (err) {
      throw new Error(err.response ? err.response.data : err.message)
    }
  }
  return res ? JSON.parse(res) : undefined
}

// Gets profiles of a resource.
export const resourceProfiles = async (
  resourceType: string,
): Promise<Definition[]> => {
  const { mget, smembers } = cache()
  const keys = await smembers(`type:${resourceType}`)
  if (!keys.length) return []

  const res = await mget(keys)
  return res.map(r => JSON.parse(r))
}

// Gets extensions of a type.
export const typeExtensions = async (
  fhirType: string,
): Promise<Definition[]> => {
  const { mget, smembers } = cache()
  const keys = await smembers(`extension:${fhirType}`)
  if (!keys.length) return []

  const res = await mget(keys)
  return res.map(r => JSON.parse(r))
}

// Gets all definitions from the cache.
export const resourcesPerKind = async (
  derivation: string,
  kind: string,
): Promise<Definition[]> => {
  const { mget, smembers } = cache()
  const keys = await smembers(`${derivation}:${kind}`)
  if (!keys.length) return []

  const res = await mget(keys)
  return res.map(r => JSON.parse(r))
}

export const cacheDefinition = async (definition: any): Promise<Definition> => {
  const structured = structurize(definition)

  // Use id as key. If it isn't present, use url
  const { id, url } = definition
  const { derivation, kind, type, context } = structured.meta

  if (!id && !url) {
    throw new Error('Structure definition has no id nor url field.')
  }

  // Cache definition in redis
  const { set, sadd } = cache()
  const cachedId = id || url
  await set(cachedId, JSON.stringify(structured))
  // Cache resource kinds (base resource, profiles, extension) using key <derivation>:<kind>
  await sadd(`${derivation}:${kind}`, cachedId)
  // Cache profiles using key type:<type>
  await sadd(`type:${type}`, cachedId)

  if (type === 'Extension' && derivation === 'constraint')
    await Promise.all(
      context!.map(c => sadd(`extension:${c.expression}`, cachedId)),
    )

  return structured
}

// Loads definitions from bundle files and cache a structured
// version of the definition in redis.
export const bootstrapDefinitions = async () => {
  console.log('Bootstrapping standard FHIR definitions...')
  const bundleFiles = await readDir(DEFINITIONS_DIR!)
  return Promise.all(
    bundleFiles.map(async file => {
      console.log(`Boostraping definitions from ${file}...`)
      const content = await readFile(join(DEFINITIONS_DIR!, file), 'utf-8')
      const bundle = JSON.parse(content)
      return Promise.all(
        bundle.entry
          .filter(
            ({ resource: { resourceType } }: any) =>
              resourceType === 'StructureDefinition',
          )
          .map(({ resource }: any) => cacheDefinition(resource)),
      )
    }),
  )
}

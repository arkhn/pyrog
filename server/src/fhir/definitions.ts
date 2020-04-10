import axios from 'axios'
import { structurize, Definition } from '@arkhn/fhir.ts'

import { FHIR_API_URL } from '../constants'
import cache from 'cache'

// Gets a definition from the cache.
export const getDefinition = async (
  key: string,
): Promise<Definition | undefined> => {
  const { get } = cache()
  const res = await get(key)
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

// Loads definitions from the database and cache a structured
// version of the definition in an in-memory cache.
export const bootstrapDefinitions = async () => {
  console.log('Bootstrapping standard FHIR definitions...')
  const { data: standardDefinitions } = await axios.get(
    `${FHIR_API_URL}/StructureDefinition`,
    {
      params: {
        _count: 1000, // TODO: use pagination
      },
    },
  )
  await Promise.all(standardDefinitions.items.map(cacheDefinition))
  console.log('Done.')
}

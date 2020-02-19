import set from 'lodash.set'
import axios from 'axios'

import { CachedDefinition } from 'types'
import { FHIR_API_URL } from '../constants'
import cache from 'cache'

const metaPrefix = '$meta'

// Gets a definition from the cache.
export const getDefinition = async (
  key: string,
): Promise<CachedDefinition | undefined> => {
  const { get } = cache()
  const res = await get(key)
  return res ? JSON.parse(res) : undefined
}

// Gets profiles of a resource.
export const resourceProfiles = async (
  resourceType: string,
): Promise<CachedDefinition[]> => {
  const { mget, smembers } = cache()
  const keys = await smembers(`type:${resourceType}`)
  const res = await mget(keys)
  return res.map(r => JSON.parse(r))
}

// Gets all definitions from the cache.
export const resourcesPerKind = async (
  derivation: string,
  kind: string,
): Promise<CachedDefinition[]> => {
  const { mget, smembers } = cache()
  const keys = await smembers(`${derivation}:${kind}`)
  const res = await mget(keys)
  return res.map(r => JSON.parse(r))
}

export const cacheDefinition = async (definition: any) => {
  const structured = structurize(definition)

  // Use id as key. If it isn't present, use url
  const { id, url } = definition
  const { derivation, kind, type } = structured.$meta

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

const structurize = (fhirDefinition: any): CachedDefinition => {
  if (!fhirDefinition.snapshot) {
    throw new Error('Snapshot is needed in the structure definition.')
  }

  const buildMetadata = () => {
    const res = {} as CachedDefinition

    // Build the metadata structure on the definition object
    Object.keys(fhirDefinition)
      .filter(el => metaProperties.includes(el))
      .forEach(key => set(res, `${metaPrefix}.${key}`, fhirDefinition[key]))

    // Extract the cardinality and constraints from the first element of the snapshot
    for (const property of rootProperties) {
      set(
        res,
        `${metaPrefix}.${property}`,
        fhirDefinition.snapshot.element[0][property],
      )
    }
    return res
  }
  const buildProperties = () => {
    const res = {} as CachedDefinition

    // Iterate on the rest of the snapshot elements and add the properties on the definition object
    // Note that we filter out the properties which are inherited from different resources (Resource, DomainResource...)
    const [, ...elements] = fhirDefinition.snapshot.element.filter(
      (e: any) => e.base.path.split('.')[0] === fhirDefinition.type,
    )
    for (const element of elements) {
      // We want to remove the root path (for instance Patient.address becomes address) and add
      // intermediary .$children between levels (for instance, Patient.contact.name becomes
      // contact.$children.name)
      const name = element.id.split('.').pop()
      const path: string = element.id
        .split('.')
        .slice(1)
        .join('.$children.')
        .replace('[x]', '') // if the element has mutliple types, prevent loadash from setting an 'x' element in the object.

      // Set element properties
      set(res, `${path}.name`, name)
      for (const property of elementProperties) {
        set(res, `${path}.${property}`, element[property])
      }
    }
    return res
  }

  // If the structure defines a primitive type (one which we don't need to unroll in UI)
  // we don't need additional properties, we only need the definition metadata.
  if (fhirDefinition.kind === 'primitive-type') return buildMetadata()

  return {
    ...buildMetadata(),
    ...buildProperties(),
  }
}

// keys to filter out
const rootProperties = ['min', 'max', 'constraint']
const metaProperties = [
  'id',
  'url',
  'name',
  'type',
  'description',
  'kind',
  'baseDefinition',
  'derivation',
  'publisher',
]
const elementProperties = ['definition', 'min', 'max', 'type', 'constraint']

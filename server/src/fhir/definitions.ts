import redis, { OverloadedKeyCommand } from 'redis'
import set from 'lodash.set'
import axios from 'axios'
import { promisify } from 'util'

import { StructureDefinition } from 'types'
import { FHIR_API_URL, REDIS_URL } from '../constants'

const rcache = redis.createClient({ url: REDIS_URL })
const cacheGet = promisify(rcache.get).bind(rcache)
const cacheMget = promisify(rcache.mget).bind(rcache) as OverloadedKeyCommand<
  string[],
  string[],
  Promise<string[]>
>
const cacheSet = promisify(rcache.set).bind(rcache)
const cacheSadd = promisify(rcache.sadd).bind(rcache) as OverloadedKeyCommand<
  string,
  number,
  Promise<number>
>
const cacheSmembers = promisify(rcache.smembers).bind(rcache)

const metaPrefix = '$meta'

// Gets a definition from the cache.
export const getDefinition = async (
  key: string,
): Promise<StructureDefinition | undefined> => {
  const res = await cacheGet(key)
  return res ? JSON.parse(res) : undefined
}

// Gets profiles of a resource.
export const resourceProfiles = async (
  resourceType: string,
): Promise<StructureDefinition[]> => {
  const keys = await cacheSmembers(`type:${resourceType}`)
  const res = await cacheMget(keys)
  return res.map(r => JSON.parse(r))
}

// Gets all definitions from the cache.
export const resourcesPerKind = async (
  derivation: string,
  kind: string,
): Promise<StructureDefinition[]> => {
  const keys = await cacheSmembers(`${derivation}:${kind}`)
  const res = await cacheMget(keys)
  return res.map(r => JSON.parse(r))
}

// Loads definitions from the database and cache a structured
// version of the definition in an in-memory cache.
export const bootstrapDefinitions = async () => {
  const cacheDefinition = async (definition: any) => {
    const structured = structurize(definition)

    // Use id as key. If it isn't present, use url
    const { id, url } = definition
    const { derivation, kind, type } = structured.$meta

    if (!id && !url) {
      throw new Error('Structure definition has no id nor url field.')
    }

    // Cache definition in redis
    const cachedId = id || url
    await cacheSet(cachedId, JSON.stringify(structured))
    // Cache resource kinds (base resource, profiles, extension) using key <derivation>:<kind>
    await cacheSadd(`${derivation}:${kind}`, cachedId)
    // Cache profiles using key type:<type>
    await cacheSadd(`type:${type}`, cachedId)
  }

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

  //TODO: fix the ':not' modifier in fhir-api
  // console.log('Bootstrapping custom FHIR definitions...')
  // const { data: customDefinitions } = await axios.get(
  //   `${FHIR_API_URL}/StructureDefinition`,
  //   {
  //     params: { 'publisher:not': HL7_AUTHOR },
  //   },
  // )
  // for (const def of customDefinitions.items.map(
  //   ({ _source }: any) => _source,
  // )) {
  //   cacheDefinition(def)
  // }
}

const structurize = (definition: any): StructureDefinition => {
  if (!definition.snapshot) {
    throw new Error('Snapshot is needed in the structure definition.')
  }

  // Create the new custom structure
  var customStruct = {} as StructureDefinition

  Object.keys(definition)
    .filter(el => structureFieldsWhiteList.includes(el))
    .forEach(key => set(customStruct, `${metaPrefix}.${key}`, definition[key]))

  definition.snapshot.element.forEach((element: any, index: number) => {
    // From the root, we only need the cardinality and constraints
    if (index === 0) {
      Object.keys(element)
        .filter(el => rootProperties.includes(el))
        .forEach(key => set(customStruct, `${metaPrefix}.${key}`, element[key]))
    } else if (definition.kind !== 'primitive-type') {
      // If the structure defines a primitive type (one which we don't need to unroll in UI)
      // we don't need the properties field, we only need the cardinality and constraints from the root

      // We want to remove the root path (for instance Patient.address becomes address) and add
      // intermediary .$children between levels (for instance, Patient.contact.name becomes
      // contact.$children.name)
      const elementName = element.id
        .split('.')
        .slice(1)
        .join('.$children.')

      // We skip some elements we don't need as id, extension
      if (!elementBlackList.some(el => elementName.endsWith(el))) {
        // Add element fields
        Object.keys(element)
          .filter(el => elementFieldsWhiteList.includes(el))
          .forEach(key =>
            set(customStruct, `${elementName}.${key}`, element[key]),
          )
      }
    }
  })

  return customStruct
}

// keys to filter out
const rootProperties = ['min', 'max', 'constraint']
const structureFieldsWhiteList = [
  'id',
  'url',
  'name',
  'type',
  'description',
  'kind',
  'baseDefinition',
  'derivation',
]
const elementFieldsWhiteList = [
  'definition',
  'min',
  'max',
  'type',
  'constraint',
]
const elementBlackList = ['id', 'extension']

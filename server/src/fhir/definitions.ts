import { Photon } from '@prisma/photon'
import NodeCache from 'node-cache'
import set from 'lodash.set'
import axios from 'axios'

import { StructureDefinition } from 'types'
import { FHIR_API_URL } from '../constants'

const photon = new Photon()
const cache = new NodeCache()

const metaPrefix = '$meta'

// Gets a definition from the cache.
export const getDefinition = (key: string): StructureDefinition | undefined =>
  cache.get(key)

// Loads definitions from the database and cache a structured
// version of the definition in an in-memory cache.
export const bootstrapDefinitions = async () => {
  const cacheDefinition = (definition: any) => {
    const structured = structurize(definition)

    // Use id as key. If it isn't present, use url
    const { id, url } = definition

    if (!id && !url) {
      throw new Error('Structure definition has no id nor url field.')
    }

    // Put obj in key value store
    console.log('loaded', id)
    cache.set(id || url, structured)
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
  for (const def of standardDefinitions.items.map(
    ({ _source }: any) => _source,
  )) {
    cacheDefinition(def)
  }

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

      const elementName = element.id.split('.').pop()

      // We skip some elements we don't need as id, extension
      if (!elementBlackList.includes(elementName)) {
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

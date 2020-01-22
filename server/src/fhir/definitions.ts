import { Photon } from '@prisma/photon'
import NodeCache from 'node-cache'
import set from 'lodash.set'

import { StructureDefinition } from 'types'
import { HL7_AUTHOR } from '../constants'

const photon = new Photon()
const cache = new NodeCache()

const metaPrefix = '$meta'

// Gets a definition from the cache.
export const getDefinition = (key: string) => cache.get(key)

// Loads definitions from the database and cache a structured
// version of the definition in an in-memory cache.
export const bootstrapDefinitions = async () => {
  const cacheDefinition = (fhirStructureDefinition: any) => {
    const struct = structurize(fhirStructureDefinition.resource)

    // Use id as key. If it isn't present, use url
    const { id, url } = fhirStructureDefinition.resource

    if (!id && !url) {
      throw new Error('Structure definition has no id nor url field.')
    }

    // Put obj in key value store
    cache.set(id || url, struct)
  }

  console.log('Bootstrapping standard FHIR definitions...')
  const standardDefinitions = await photon.structureDefinitions.findMany({
    where: { author: HL7_AUTHOR },
  })
  for (const def of standardDefinitions) {
    cacheDefinition(def)
  }

  console.log('Bootstrapping custom FHIR definitions...')
  const customDefinitions = await photon.structureDefinitions.findMany({
    where: { author: { not: HL7_AUTHOR } },
  })
  for (const def of customDefinitions) {
    cacheDefinition(def)
  }
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

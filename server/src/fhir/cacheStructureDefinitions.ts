import NodeCache from 'node-cache'
import set from 'lodash.set'

import { StructureDefinition } from '../types'

const cache = new NodeCache()

const metaPrefix = '$meta.'

export const cacheDefinition = (fhirStructureDefinition: any) => {
  const struct = structurize(fhirStructureDefinition.resource)

  // Use id as key. If it isn't present, use url
  const key = struct['$meta'].id || struct['$meta'].url

  if (!key) {
    throw new Error('Structure definition has no id nor url field.')
  }

  // Put obj in key value store
  cache.set(key, struct)
}

export const getDefinition = (key: string) => cache.get(key)

const structurize = (definition: any): StructureDefinition => {
  if (!definition.snapshot) {
    throw new Error('Snapshot is needed in the structure definition.')
  }

  // Create the new custom structure
  var customStruct = {} as StructureDefinition

  Object.keys(definition)
    .filter(el => structureFieldsWhiteList.includes(el))
    .forEach(key => {
      set(customStruct, metaPrefix + key, definition[key])
    })

  definition.snapshot.element.forEach((element: any, index: number) => {
    // From the root, we only need the cardinality and constraints
    if (index == 0) {
      Object.keys(element)
        .filter(el => rootProperties.includes(el))
        .forEach(key => {
          set(customStruct, metaPrefix + key, element[key])
        })
    } else if (definition.kind !== 'primitive-type') {
      // If the structure defines a primitive type (one which we don't need to unroll in UI)
      // we don't need the properties field, we only need the cardinality and constraints from the root

      const elementName = element.id.substring(element.id.indexOf('.') + 1)

      // We skip some elements we don't need as id, extension
      if (elementBlackList.includes(elementName)) return

      // Add element fields
      Object.keys(element)
        .filter(el => elementFieldsWhiteList.includes(el))
        .forEach(key => {
          set(customStruct, `${elementName}.${key}`, element[key])
        })
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

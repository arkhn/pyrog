import * as nodeCache from 'node-cache'
import * as _ from 'lodash'

const cache = new nodeCache()

export const setStructureDefinition = (fhirStructureDefinition: any) => {
  const struct = structurize(fhirStructureDefinition.resource)

  // Use id as key. If it isn't present, use url
  const key = struct.id || struct.url

  if (!key) {
    throw new Error('Structure definition has no id nor url field.')
  }

  // Put obj in key value store
  cache.set(key, struct)
}

export const getStructureDefinition = (key: string) => cache.get(key)

const structurize = (definition: any): any => {
  if (!definition.snapshot) {
    throw new Error('Snapshot is needed in the structure definition.')
  }

  // Create the new custom structure
  var customStruct = {}

  Object.keys(definition)
    .filter(el => structureFieldsWhiteList.includes(el))
    .forEach(key => {
      _.set(customStruct, key, definition[key])
    })

  // If the structure defines a primitive type (one which we don't need to unroll in UI)
  // we don't need the properties field
  if (definition.kind !== 'primitive-type') {
    definition.snapshot.element.forEach((element: any, index: number) => {
      // Don't process first element in snapshot, it's the root
      if (index == 0) return

      const elementName = element.id.substring(element.id.indexOf('.') + 1)

      // We skip some elements we don't need as id, extension
      if (elementBlackList.includes(elementName)) return

      // Create custom element
      var customElement = {}

      Object.keys(element)
        .filter(el => elementFieldsWhiteList.includes(el))
        .forEach(key => {
          _.set(customElement, key, element[key])
        })
      _.set(customStruct, `properties.${elementName}`, customElement)
    })
  }

  return customStruct
}

// keys to filter out
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

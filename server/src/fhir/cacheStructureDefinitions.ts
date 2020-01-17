const nodeCache = require('node-cache')
const _ = require('lodash')

const cache = new nodeCache()

export const setStructureDefinition = (fhirStructureDefinition: any) => {
  const struct = buildCustomStructure(fhirStructureDefinition.resource)

  // Use id as key. If it isn't present, use url
  const key = struct.id || struct.url

  if (key === undefined) {
    throw new Error('Structure definition has no id nor url field.')
  }

  // Put obj in key value store
  cache.set(key, struct)
}

export const getStructureDefinition = (key: string) => cache.get(key)

const buildCustomStructure = (structResource: any): any => {
  if (!('snapshot' in structResource)) {
    throw new Error('Snapshot is needed in the structure definition.')
  }

  // Create the new custom structure
  var customStruct = {}

  Object.keys(structResource).forEach(key => {
    if (structureFieldsWhiteList.indexOf(key) === -1) return
    _.set(customStruct, key, structResource[key])
  })

  // If the structure defines a primitive type (one which we don't need to unroll in UI)
  // we don't need the properties field
  if (structResource.kind !== 'primitive-type') {
    structResource.snapshot.element.forEach((element: any, index: number) => {
      // Don't process first element in snapshot, it's the root
      if (index == 0) return

      const elementName = element.id.substring(element.id.indexOf('.') + 1)

      // We skip some elements we don't need as id, extension
      if (elementBlackList.indexOf(elementName) > -1) return

      // Create custom element
      var customElement = {}

      Object.keys(element).forEach(key => {
        if (elementFieldsWhiteList.indexOf(key) === -1) return
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
const elementFieldsWhiteList = ['definition', 'min', 'max']
const elementBlackList = ['id', 'extension']

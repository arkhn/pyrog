import { readFileSync, writeFileSync } from 'fs'
import { v4 } from 'uuid'

const updateSystem = (a: any, logicalReferenceMapping: any) => {
  const hasInput = a.inputs && a.inputs.length && a.inputs[0].staticValue
  if (!hasInput) {
    console.warn(`[${a.resource!.definitionId}.${a.path}] missing input`)
    return a
  }

  let prevSystemValue = a.inputs[0].staticValue!
  if (!prevSystemValue.includes('terminology.arkhn.org')) {
    console.error(
      `previous identifier system ${prevSystemValue} is not custom, passing...`,
    )
    return a
  }
  // system used to look like http://terminology.arkhn.com/<sourceId>/<resourceId>[/<optionalCustomKey>]
  const parts = prevSystemValue.split(/\//)
  if (parts.length < 5 || parts.length > 6) {
    console.error(
      `[${a.resource!.definitionId}.${
        a.path
      }] bad reference system: ${prevSystemValue}`,
    )
    return a
  }
  const targetResourceId = parts[4]

  // extract the trailing custom identifier key if present
  const optionalIdentifierKey = parts.length === 6 ? parts[5] : null

  if (!targetResourceId) {
    console.error(
      `[${a.resource!.definitionId}.${
        a.path
      }] bad reference system: ${prevSystemValue}`,
    )
    return a
  } else if (!logicalReferenceMapping[targetResourceId]) {
    console.error(
      `[${a.resource!.definitionId}.${
        a.path
      }] could not update identifier system: resource id ${targetResourceId} does not exist`,
    )
    return a
  }

  const identifierSystem = `http://terminology.arkhn.org/${
    logicalReferenceMapping[targetResourceId]
  }${optionalIdentifierKey ? '/' + optionalIdentifierKey : ''}`

  // identifier.system now looks like http://terminology.arkhn.com/<resourceLogicalReference>[/<optionalCustomKey>]
  a.inputs[0].staticValue = identifierSystem
  return a
}

const main = async (mappingFile: string, destFile: string) => {
  let content: string
  let mapping: any
  try {
    content = readFileSync(mappingFile).toString()
    mapping = JSON.parse(content)
  } catch (err) {
    throw new Error(`file must be a JSON file: ${err}`)
  }

  // init logicalReference with new UUID V4
  const migrated = JSON.parse(content)
  migrated.resources = mapping.resources.map((r: any) => ({
    ...r,
    logicalReference: v4(),
  }))
  // console.log(migrated)

  const logicalReferenceMapping: {
    [id: string]: string
  } = migrated.resources.reduce(
    (acc: any, r: any) => ({ ...acc, [r.id]: r.logicalReference }),
    {},
  )

  migrated.resources = migrated.resources.reduce((acc: any, r: any) => {
    // find all identifier attributes of this resource
    const identifierAttributes = r.attributes
      .filter((a: any) => a.definitionId === 'Identifier')
      .map((a: any) => a.path)

    // update all identifier.system attributes of this resource
    r.attributes = r.attributes.map((a: any) => {
      const isSystem = !!identifierAttributes.find(
        (idAttr: any) => `${idAttr}.system` === a.path,
      )
      return isSystem ? updateSystem(a, logicalReferenceMapping) : a
    })

    return [...acc, r]
  }, [])

  writeFileSync(destFile, JSON.stringify(migrated))
  // console.log(JSON.stringify(migrated))
}

if (process.argv.length !== 4) {
  console.log(
    'USAGE:\n> yarn run-ts scripts/migrateLogicalReferencesV8.ts <mapping.json> DEST',
  )
  process.exit(1)
}

main(process.argv[2], process.argv[3]).catch(err => {
  console.error(err)
})

import * as fs from 'fs'
import { isAbsolute, join } from 'path'
import { O_CREAT, S_IRUSR, S_IWUSR } from 'constants'

const PROFILES_DIR = 'profiles'
const TYPES_DIR = 'types'
const EXTENSIONS_DIR = 'extensions'

const HL7_DEFINED_TYPED_DIR = 'hl7'
const CUSTOM_DEFINED_TYPED_DIR = 'custom'

const DEFINITIONS_DIR = process.env.DEFINITIONS_DIR
if (!DEFINITIONS_DIR) {
  throw new Error('missing DEFINITIONS_DIR env variable')
}

const writeStructureDefinition = async (
  destination: string,
  definition: any,
) => {
  const filename = `${definition.id}.json`
  const path = isAbsolute(destination)
    ? destination
    : join(process.cwd(), destination)
  fs.promises.writeFile(join(path, filename), JSON.stringify(definition), {
    encoding: 'utf-8',
    mode: 0o644,
  })
}

const createFolders = async () => {
  for (const scope of [HL7_DEFINED_TYPED_DIR, CUSTOM_DEFINED_TYPED_DIR]) {
    for (const directory of [PROFILES_DIR, TYPES_DIR, EXTENSIONS_DIR]) {
      await fs.promises.mkdir(join(DEFINITIONS_DIR, scope, directory), {
        recursive: true,
      })
    }
  }
}

const parsefhirDefinitionss = async (directory: string) => {
  let extensionCount = 0
  let profileCount = 0
  let typeCount = 0
  const dir = await fs.promises.opendir(directory)
  for await (const dirent of dir) {
    const rawBundle = await fs.promises.readFile(join(dir.path, dirent.name), {
      encoding: 'utf-8',
    })
    const bundle = JSON.parse(rawBundle)
    if (!bundle.resourceType || bundle.resourceType !== 'Bundle') {
      throw new Error(`${dirent.name} must be a FHIR Bundle resource`)
    }
    for (const { resource } of bundle.entry) {
      if (!resource) throw new Error('Bundle entry is missing a resource')
      if (resource.resourceType !== 'StructureDefinition') continue

      let destination = join(DEFINITIONS_DIR, HL7_DEFINED_TYPED_DIR)
      if (resource.abstract) {
        // FHIR asbtract resource (Element, BackboneElement)
        destination = join(destination, TYPES_DIR)
        typeCount++
      } else {
        switch (resource.derivation) {
          case 'specialization':
            // FHIR defined type (string, code, Address, Patient...)
            destination = join(destination, TYPES_DIR)
            typeCount++
            break
          case 'constraint':
            switch (resource.type) {
              case 'Extension':
                // FHIR extension
                destination = join(destination, EXTENSIONS_DIR)
                extensionCount++
                break
              default:
                // FHIR profile
                destination = join(destination, PROFILES_DIR)
                profileCount++
            }
            break
          default:
            throw new Error(
              `invalid StructureDefinition derivation ${resource.derivation}`,
            )
        }
      }
      await writeStructureDefinition(destination, resource)
    }
  }
  console.log(
    `Wrote ${typeCount} types, ${profileCount} profiles and ${extensionCount} extensions`,
  )
}

if (process.argv.length !== 3) {
  console.error('USAGE: ts-node scripts/fhirDefinitions.ts <bundle_directory>')
  process.exit(1)
}

createFolders()
  .then(() =>
    parsefhirDefinitionss(process.argv[2]).then(() => process.exit(0)),
  )
  .catch((err: Error) => {
    console.error(err)
    process.exit(1)
  })

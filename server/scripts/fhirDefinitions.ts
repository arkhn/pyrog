import * as fs from 'fs'
import { join } from 'path'

import { Photon, StructureDefinitionCreateInput } from '@prisma/photon'

import { HL7_AUTHOR } from '../src/constants'

const photon = new Photon()

const parseBundles = async (directory: string) => {
  const dir = await fs.promises.opendir(directory)
  for await (const dirent of dir) {
    const rawBundle = await fs.promises.readFile(join(dir.path, dirent.name), {
      encoding: 'utf-8',
    })
    const bundle = JSON.parse(rawBundle)
    if (!bundle.resourceType || bundle.resourceType !== 'Bundle') {
      throw new Error(`${dirent.name} must be a FHIR Bundle resource`)
    }
    await Promise.all(
      bundle.entry.map(async ({ resource }: any) => {
        if (!resource) throw new Error('Bundle entry is missing a resource')
        if (resource.resourceType !== 'StructureDefinition') return

        const definition: StructureDefinitionCreateInput = {
          id: resource.id,
          name: resource.name,
          type: resource.type,
          description: resource.description,
          kind: resource.kind,
          derivation: resource.derivation,
          author: HL7_AUTHOR,
          content: JSON.stringify(resource),
        }
        await photon.structureDefinitions.create({ data: definition })
      }),
    )
  }
}

const countDefinitions = async () => {
  // resources
  const resources = await photon.structureDefinitions.findMany({
    where: { derivation: 'specialization', kind: 'resource' },
    select: { id: true },
  })
  // profiles
  const profiles = await photon.structureDefinitions.findMany({
    where: { derivation: 'constraint', kind: 'resource' },
    select: { id: true },
  })
  // extensions
  const extensions = await photon.structureDefinitions.findMany({
    where: { derivation: 'constraint', type: 'Extension' },
    select: { id: true },
  })
  console.log(
    `Wrote ${resources.length} resources, ${profiles.length} profiles and ${extensions.length} extensions.`,
  )
}

if (process.argv.length !== 3) {
  console.error('USAGE: ts-node scripts/fhirDefinitions.ts <bundle_directory>')
  process.exit(1)
}

photon
  .connect()
  .then(() =>
    parseBundles(process.argv[2]).then(() =>
      countDefinitions().then(() => process.exit(0)),
    ),
  )
  .catch((err: Error) => {
    console.error(err)
    process.exit(1)
  })

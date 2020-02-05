import * as fs from 'fs'
import { join, isAbsolute } from 'path'

import { Photon, StructureDefinitionCreateInput } from '@prisma/photon'

import { HL7_AUTHOR } from '../src/constants'

const photon = new Photon()

const parseBundles = async (bundleFiles: string[]) => {
  for (const bundleFile of bundleFiles) {
    const filePath = isAbsolute(bundleFile)
      ? bundleFile
      : join(process.cwd(), bundleFile)
    const rawBundle = await fs.promises.readFile(filePath, {
      encoding: 'utf-8',
    })
    const bundle = JSON.parse(rawBundle)
    if (!bundle.resourceType || bundle.resourceType !== 'Bundle') {
      throw new Error(`${bundleFile} must be a FHIR Bundle resource`)
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

if (process.argv.length < 3) {
  console.error(
    'USAGE: ts-node scripts/fhirDefinitions.ts <bundleFile.json> [<bundle2.json>...]',
  )
  process.exit(1)
}

photon
  .connect()
  .then(() =>
    parseBundles(process.argv.slice(2)).then(() =>
      countDefinitions().then(() =>
        photon.disconnect().then(() => process.exit(0)),
      ),
    ),
  )
  .catch((err: Error) => {
    console.error(err)
    photon.disconnect().then(() => process.exit(1))
  })

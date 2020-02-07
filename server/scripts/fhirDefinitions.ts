import * as fs from 'fs'
import { join, isAbsolute } from 'path'

import axios from 'axios'

import { FHIR_API_URL } from '../src/constants'

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

        try {
          await axios.post(`${FHIR_API_URL}/StructureDefinition`, resource)
        } catch (err) {
          console.error(
            `Could not create StructureDefinition ${resource.id}: ${err.response.data}`,
          )
        }
      }),
    )
  }
}

if (process.argv.length < 3) {
  console.error(
    'USAGE: ts-node scripts/fhirDefinitions.ts <bundleFile.json> [<bundle2.json>...]',
  )
  process.exit(1)
}

parseBundles(process.argv.slice(2))
  .then(() => {
    console.log('Successfully wrote structure definitions to FHIR API')
    process.exit(0)
  })
  .catch(() => process.exit(1))

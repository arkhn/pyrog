import { Photon } from '@prisma/photon'
import { HL7_AUTHOR } from '../constants'

const photon = new Photon()

const structurize = (def: any): any => {}

const set = (key: string, value: any): void => {}

const cacheDefinitions = (definitions: any[]): void => {
  for (const def of definitions) {
    const struct = structurize(def)
    set('key', struct)
  }
}

// compares StructureDefinitions from the database with those from the filesystem.
//      - loads definitions from the database
//      - cache a structured version of the definition in an in-memory cache
export const bootstrapDefinitions = async () => {
  console.log('Bootstrapping standard FHIR definitions...')
  const standardDefinitions = await photon.structureDefinitions.findMany({
    where: { author: HL7_AUTHOR },
  })
  await cacheDefinitions(standardDefinitions)

  console.log('Bootstrapping custom FHIR definitions...')
  const customDefinitions = await photon.structureDefinitions.findMany({
    where: { author: { not: HL7_AUTHOR } },
  })
  await cacheDefinitions(customDefinitions)
}

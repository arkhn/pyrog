import { readFileSync } from 'fs'
import { Photon } from '@prisma/photon'
import { importMapping } from '../src/resolvers/mapping'

const photon = new Photon()

const main = async (path: string) => {
  let content: string
  let mapping: any
  try {
    content = readFileSync(path).toString()
    mapping = JSON.parse(content)
  } catch (err) {
    throw new Error(`file must be a JSON file: ${err}`)
  }

  // create template if it does not exist
  if (!mapping.template || !mapping.template.name) {
    throw new Error('missing template in mapping')
  }
  let template = await photon.templates.findOne({
    where: { name: mapping.template.name },
  })
  if (!template) {
    console.log(`Creating template ${mapping.template.name}...`)
    template = await photon.templates.create({
      data: { name: mapping.template.name },
    })
  }

  // create source if it does not exist
  if (!mapping.source || !mapping.source.name) {
    throw new Error('missing source name in mapping')
  }
  let [source] = await photon.sources.findMany({
    where: { template: { name: template.name }, name: mapping.source.name },
  })
  if (!source) {
    console.log(`Creating source ${mapping.source.name}...`)
    source = await photon.sources.create({
      data: {
        name: mapping.source.name,
        hasOwner: mapping.source.hasOwner,
        template: { connect: { name: template.name } },
      },
    })
  } else {
    throw new Error(
      `source ${template.name} - ${source.name} already exists, aborting...`,
    )
  }

  console.log(
    `Creating resources ${mapping.resources
      .map((r: any) => r.fhirType)
      .join(', ')}...`,
  )
  return importMapping(photon, source.id, content)
}

if (process.argv.length != 3) {
  console.log('USAGE:\n> yarn seed <mapping.json>')
  process.exit(1)
}

photon
  .connect()
  .then(() =>
    main(process.argv[2]).then(() =>
      photon.disconnect().then(() => process.exit(0)),
    ),
  )
  .catch(err => {
    console.error(err)
    photon.disconnect().then(() => process.exit(1))
  })

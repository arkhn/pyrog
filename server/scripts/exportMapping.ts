import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { Photon } from '@prisma/photon'
import { exportMapping } from '../src/resolvers/mapping'

const photon = new Photon()

const main = async (outputDirectory: string) => {
  if (!existsSync(outputDirectory)) {
    mkdirSync(outputDirectory)
  }

  let sources = await photon.sources.findMany()
  for (const source of sources) {
    console.log('source:', source)
    const content = await exportMapping(photon, source.id)
    writeFileSync(`${outputDirectory}/${source.id}.json`, content)
  }
}

if (process.argv.length != 3) {
  console.log('USAGE:\n> yarn export:mapping <DIRECTORY_TO_STORE_EXPORTS>')
  process.exit(1)
}

photon
  .connect()
  .then(() => main(process.argv[2]))
  .then(() => photon.disconnect())
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    photon.disconnect().then(() => process.exit(1))
  })

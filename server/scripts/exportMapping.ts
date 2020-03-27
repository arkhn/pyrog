import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { PrismaClient } from '@prisma/client'
import { exportMapping } from '../src/resolvers/mapping'

const prismaClient = new PrismaClient()

const main = async (outputDirectory: string) => {
  if (!existsSync(outputDirectory)) {
    mkdirSync(outputDirectory)
  }

  const sources = await prismaClient.source.findMany()
  console.log(`-> Exporting ${sources.length} source(s)...`)
  for (const source of sources) {
    const content = await exportMapping(prismaClient, source.id)
    writeFileSync(`${outputDirectory}/${source.id}.json`, content)
  }
}

if (process.argv.length != 3) {
  console.log('USAGE:\n> yarn export:mappings <DIRECTORY_TO_STORE_EXPORTS>')
  process.exit(1)
}

prismaClient
  .connect()
  .then(() => main(process.argv[2]))
  .then(() => prismaClient.disconnect())
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    prismaClient.disconnect().then(() => process.exit(1))
  })

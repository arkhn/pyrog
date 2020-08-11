import { readFileSync } from 'fs'
import { encrypt } from 'utils'
import { PrismaClient } from '@prisma/client'
import { importMapping } from '../src/resolvers/mapping'

const prismaClient = new PrismaClient()

const importCredentials = (path: string, sourceId: string) => {
  let content: string
  let credentials: any
  try {
    content = readFileSync(path).toString()
    credentials = JSON.parse(content)
  } catch (err) {
    throw new Error(`file must be a JSON file: ${err}`)
  }

  const encryptedPassword = encrypt(credentials.password)

  return prismaClient.credential.create({
    data: {
      host: credentials.host,
      port: credentials.port,
      database: credentials.database,
      login: credentials.login,
      password: encryptedPassword,
      owner: credentials.owner,
      schema: credentials.schema,
      model: credentials.model,
      source: {
        connect: { id: sourceId },
      },
    },
  })
}

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
  let template = await prismaClient.template.findOne({
    where: { name: mapping.template.name },
  })
  if (!template) {
    console.log(`Creating template ${mapping.template.name}...`)
    template = await prismaClient.template.create({
      data: { name: mapping.template.name },
    })
  }

  // create source if it does not exist
  if (!mapping.source || !mapping.source.name) {
    throw new Error('missing source name in mapping')
  }
  let [source] = await prismaClient.source.findMany({
    where: { template: { name: template.name }, name: mapping.source.name },
  })
  if (!source) {
    console.log(`Creating source ${mapping.source.name}...`)
    source = await prismaClient.source.create({
      data: {
        name: mapping.source.name,
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
      .map((r: any) => r.definitionId)
      .join(', ')}...`,
  )

  let ret: Promise<any> = importMapping(prismaClient, source.id, mapping)

  if (process.argv.length === 4) {
    console.log(`Seeding credentials from ${process.argv[3]}...`)
    ret = Promise.all([ret, importCredentials(process.argv[3], source.id)])
  }

  return ret
}

if (process.argv.length < 3 || process.argv.length > 4) {
  console.log('USAGE:\n> yarn seed:mapping <mapping.json> <credientials.json>')
  process.exit(1)
}

prismaClient
  .$connect()
  .then(() =>
    main(process.argv[2]).then(() =>
      prismaClient.$disconnect().then(() => process.exit(0)),
    ),
  )
  .catch(err => {
    console.error(err)
    prismaClient.$disconnect().then(() => process.exit(1))
  })

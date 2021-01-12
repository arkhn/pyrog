import { readFileSync } from 'fs'
import { encrypt } from 'utils'
import { Owner, PrismaClient } from '@prisma/client'
import { importMapping } from '../src/resolvers/mapping'

const prismaClient = new PrismaClient()

const main = async (path: string) => {
  let content: string
  let mapping: any
  let credential: any
  try {
    content = readFileSync(path).toString()
    mapping = JSON.parse(content)
    if (process.argv.length === 4) {
      // if a second file is provided, use it to add credentials to the source
      console.log(`Seeding credentials from ${process.argv[3]}...`)
      content = readFileSync(process.argv[3]).toString()
      credential = JSON.parse(content)
    }
  } catch (err) {
    throw new Error(`file must be a JSON file: ${err}`)
  }

  // create template if it does not exist
  if (!mapping.template || !mapping.template.name) {
    throw new Error('missing template in mapping')
  }
  let template = await prismaClient.template.findUnique({
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
    include: { credential: { include: { owners: true } } },
  })
  if (!source) {
    console.log(credential.password, encrypt(credential.password))
    console.log(`Creating source ${mapping.source.name}...`)
    source = await prismaClient.source.create({
      data: {
        name: mapping.source.name,
        template: { connect: { name: template.name } },
        credential: mapping.source.credential
          ? {
              create: {
                ...(credential
                  ? {
                      ...credential,
                      password: encrypt(credential.password),
                    }
                  : {
                      host: '',
                      port: '',
                      database: '',
                      password: '',
                      login: '',
                    }),
                model: mapping.source.credential.model,
                owners: {
                  create: mapping.source.credential.owners.map((o: any) => ({
                    name: o.name,
                    schema: o.schema,
                  })) as Owner[],
                },
              },
            }
          : undefined,
      },
      include: { credential: { include: { owners: true } } },
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

  let operations: any[] = await importMapping(prismaClient, source, mapping)

  return prismaClient.$transaction(operations)
}

if (process.argv.length < 3 || process.argv.length > 4) {
  console.log(
    'USAGE:\n> yarn seed:mapping <mapping.json> (<credientials.json>)',
  )
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

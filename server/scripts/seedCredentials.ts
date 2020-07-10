import { readFileSync } from 'fs'
import { encrypt } from 'utils'
import { PrismaClient } from '@prisma/client'

const prismaClient = new PrismaClient()

const main = async (path: string) => {
  let content: string
  let credentials: any
  try {
    content = readFileSync(path).toString()
    credentials = JSON.parse(content)
  } catch (err) {
    throw new Error(`file must be a JSON file: ${err}`)
  }

  const encryptedPassword = encrypt(credentials.password)

  const creds = await prismaClient.credential.create({
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
        connect: { id: credentials.sourceId },
      },
    },
  })
}

if (process.argv.length != 3) {
  console.log('USAGE:\n> yarn seed:credentials <credentials.json>')
  process.exit(1)
}

prismaClient
  .connect()
  .then(() =>
    main(process.argv[2]).then(() =>
      prismaClient.disconnect().then(() => process.exit(0)),
    ),
  )
  .catch(err => {
    console.error(err)
    prismaClient.disconnect().then(() => process.exit(1))
  })

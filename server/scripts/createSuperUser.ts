import { PrismaClient } from '@prisma/client'

const prismaClient = new PrismaClient()

const { SUPERUSER_EMAIL, SUPERUSER_PASSWORD } = process.env

const main = async () => {
  if (!SUPERUSER_PASSWORD) throw Error('superuser password is required')
  await prismaClient.user.create({
    data: {
      name: 'admin',
      password: SUPERUSER_PASSWORD as string,
      email: SUPERUSER_EMAIL || 'admin@arkhn.com',
      role: 'ADMIN',
    },
  })
}

prismaClient
  .$connect()
  .then(() => main())
  .then(() => prismaClient.$disconnect())
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    prismaClient.$disconnect().then(() => process.exit(+!SUPERUSER_PASSWORD))
  })

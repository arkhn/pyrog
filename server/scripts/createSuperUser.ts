import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import FormData from 'form-data'

const prismaClient = new PrismaClient()

const {
  SUPERUSER_EMAIL,
  SUPERUSER_PASSWORD,
  IDENTITY_PROVIDER_URL,
} = process.env

const main = async () => {
  if (!SUPERUSER_PASSWORD)
    throw Error('SUPERUSER_PASSWORD is required in environment')
  if (!SUPERUSER_EMAIL)
    throw Error('SUPERUSER_EMAIL is required in environment')

  const user = {
    name: 'admin',
    password: SUPERUSER_PASSWORD as string,
    email: SUPERUSER_EMAIL,
  }

  // if IDENTITY_PROVIDER_URL is provided, send a request to create the user
  if (IDENTITY_PROVIDER_URL) {
    let form = new FormData()
    form.append('name', user.name)
    form.append('password', user.password)
    form.append('email', user.email)
    await axios.post(`${IDENTITY_PROVIDER_URL}/signup`, form, {
      headers: form.getHeaders(),
    })
  }

  // upsert the user in pyrog database
  await prismaClient.user.upsert({
    where: {
      email: user.email,
    },
    update: {
      role: 'ADMIN',
    },
    create: {
      name: user.name,
      email: user.email,
      role: 'ADMIN',
    },
  })
}

prismaClient
  .$connect()
  .then(() => main())
  .then(() => prismaClient.$disconnect())
  .catch(err => {
    console.error(err)
    prismaClient.$disconnect()
  })

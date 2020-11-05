import { PrismaClient } from '@prisma/client'
import axios from 'axios'

const prismaClient = new PrismaClient()

const {
  SUPERUSER_EMAIL,
  SUPERUSER_PASSWORD,
  IDENTITY_PROVIDER_URL,
} = process.env

const main = async () => {
  if (!SUPERUSER_PASSWORD) throw Error('superuser password is required')
  const user = {
    name: 'admin',
    password: SUPERUSER_PASSWORD as string,
    email: SUPERUSER_EMAIL || 'admin@arkhn.com',
  }
  let form = new FormData()
  form.append('name', user.name)
  form.append('password', user.password)
  form.append('email', user.email)
  const res = await axios.post(`${IDENTITY_PROVIDER_URL}/signup`, form)
  if (res.status === 500)
    throw Error('identity provider failed to create superuser')
  await prismaClient.user.create({
    data: {
      ...user,
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
    prismaClient.$disconnect().then(() => process.exit(1))
  })

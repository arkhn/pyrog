import { hash } from 'bcryptjs'
import { Photon } from '@prisma/photon'

const photon = new Photon()

const { SUPERUSER_PASSWORD } = process.env
if (!SUPERUSER_PASSWORD) {
  console.error('SUPERUSER_PASSWORD env variable is required')
  process.exit(1)
}

async function main() {
  const hashedPassword = await hash(SUPERUSER_PASSWORD!, 10)
  const user = await photon.users.create({
    data: {
      name: 'admin',
      email: 'admin@arkhn.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
}

main().finally(async () => {
  await photon.disconnect()
})

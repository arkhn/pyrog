import { createCipher } from 'crypto'
import { objectType, FieldResolver } from 'nexus'
import { DatabaseType } from '@prisma/photon'

export const Credential = objectType({
  name: 'Credential',
  definition(t) {
    t.model.id()

    t.model.host()
    t.model.port()
    t.model.database()
    t.model.model()
    t.model.login()
    t.model.password()

    t.model.source()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

export const upsertCredential: FieldResolver<
  'Mutation',
  'upsertCredential'
> = async (
  _parent,
  { sourceId, host, port, database, login, password, model },
  ctx,
) => {
  const cipher = createCipher(
    'aes-256-gcm',
    Buffer.from(process.env.APP_SECRET!),
  )
  const encryptedPassword =
    cipher.update(password, 'utf8', 'hex') + cipher.final('hex')

  const source = await ctx.photon.sources.findOne({
    where: { id: sourceId },
    include: { credential: true },
  })
  if (!source) {
    throw new Error(`Source ${sourceId} does not exist`)
  }

  if (source.credential) {
    return ctx.photon.credentials.update({
      where: { id: source.credential.id },
      data: {
        host,
        port,
        model: model as DatabaseType,
        database,
        password: encryptedPassword,
        login,
      },
    })
  } else {
    return ctx.photon.credentials.create({
      data: {
        source: { connect: { id: sourceId } },
        login,
        password: encryptedPassword,
        host,
        port,
        model: model as DatabaseType,
        database,
      },
    })
  }
}

export const deleteCredential: FieldResolver<
  'Mutation',
  'deleteCredential'
> = async (_parent, { id }, ctx) =>
  ctx.photon.credentials.delete({ where: { id } })

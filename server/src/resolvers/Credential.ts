import { objectType, FieldResolver } from '@nexus/schema'
import {
  DatabaseType,
  Credential as Credz,
  CredentialCreateInput,
  CredentialCreateArgs,
} from '@prisma/client'
import { PAGAI_URL } from '../constants'

import { encrypt, decrypt } from 'utils'
import axios from 'axios'
import { Context } from 'nexus-prisma/dist/utils'

export const Credential = objectType({
  name: 'Credential',
  definition(t) {
    t.model.id()

    t.model.host()
    t.model.port()
    t.model.database()
    t.model.model()
    t.model.login()
    t.model.owner()
    t.model.schema()
    t.model.password()
    t.field('decryptedPassword', {
      type: 'String',
      resolve: parent => decrypt(parent.password),
    })

    t.model.source()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

const loadDatabaseSchema = async (
  ctx: Context,
  credentials: Partial<Credz>,
): Promise<string> => {
  const { model, owner, host, port, database, login, password } = credentials
  try {
    const { data } = await axios.post(`${PAGAI_URL}/get_db_schema`, {
      model,
      owner,
      host,
      port,
      database,
      login,
      password: decrypt(password!),
    })
    return JSON.stringify(data)
  } catch (err) {
    throw new Error(
      `Could not fetch database schema using pagai: ${
        err.response ? err.response.data.error : err.message
      }`,
    )
  }
}

export const upsertCredential: FieldResolver<
  'Mutation',
  'upsertCredential'
> = async (
  _parent,
  { sourceId, host, port, database, login, password, owner, model },
  ctx,
) => {
  const encryptedPassword = encrypt(password)

  const source = await ctx.prisma.source.findOne({
    where: { id: sourceId },
    include: { credential: true },
  })
  if (!source) {
    throw new Error(`Source ${sourceId} does not exist`)
  }

  const input: Partial<Credz> = {
    host,
    port,
    model: model as DatabaseType,
    database,
    password: encryptedPassword,
    login,
    owner,
  }
  input.schema = await loadDatabaseSchema(ctx, input)

  let credz: Credz
  if (source.credential) {
    credz = await ctx.prisma.credential.update({
      where: { id: source.credential.id },
      data: input,
    })
  } else {
    credz = await ctx.prisma.credential.create({
      data: {
        ...(input as Credz),
        source: { connect: { id: sourceId } },
      },
    })
  }

  return credz
}

export const deleteCredential: FieldResolver<
  'Mutation',
  'deleteCredential'
> = async (_parent, { credentialId }, ctx) =>
  ctx.prisma.credential.delete({ where: { id: credentialId } })

import axios from 'axios'
import { objectType, FieldResolver } from 'nexus'
import { DatabaseType, Credential as Credz } from '@prisma/client'

import { RIVER_URL } from '../constants'
import { encrypt, decrypt } from 'utils'
import { Context } from 'context'

export const Credential = objectType({
  name: 'Credential',
  definition(t) {
    t.model.id()

    t.model.host()
    t.model.port()
    t.model.database()
    t.model.model()
    t.model.login()
    t.model.owners()
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
  owner: string,
): Promise<{
  schema: string
  name?: string | null
  id?: string | null
}> => {
  const { model, host, port, database, login, password } = credentials
  try {
    const { data } = await axios.post(
      `${RIVER_URL}/pagai/owner-schema/${owner}/`,
      {
        model,
        host,
        port,
        database,
        login,
        password: decrypt(password!),
      },
    )
    return {
      name: owner,
      schema: JSON.stringify(data),
    }
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
  { sourceId, host, port, database, owners, login, password, model },
  ctx,
) => {
  const encryptedPassword = encrypt(password)

  const source = await ctx.prisma.source.findUnique({
    where: { id: sourceId },
    include: { credential: { include: { owners: true } } },
  })
  if (!source) {
    throw new Error(`Source ${sourceId} does not exist`)
  }
  const input: Partial<Credz> = {
    host,
    port,
    model: model as DatabaseType,
    database,
    password: encryptedPassword,
    login,
  }

  const _owners = owners
    ? await Promise.all(
        owners.map(owner => loadDatabaseSchema(ctx, input, owner)),
      )
    : []

  let credz: Credz
  if (source.credential) {
    // remove owners if needed
    const ownersIDToRemove = source.credential.owners
      .filter(o => !owners?.find(newOwner => o.name === newOwner))
      .map(o => o.id)
    await ctx.prisma.owner.deleteMany({
      where: { id: { in: ownersIDToRemove } },
    })
    await Promise.all(
      _owners.map(_o =>
        ctx.prisma.owner.upsert({
          where: {
            Owner_name_credential_unique_constraint: {
              credentialId: source.credential?.id as string,
              name: _o.name as string,
            },
          },
          update: {
            schema: _o.schema,
          },
          create: {
            credential: {
              connect: {
                id: source.credential?.id,
              },
            },
            name: _o.name as string,
            schema: _o.schema,
          },
        }),
      ),
    )
    credz = await ctx.prisma.credential.update({
      where: { id: source.credential.id },
      data: {
        ...input,
      },
    })
  } else {
    credz = await ctx.prisma.credential.create({
      data: {
        ...(input as Credz),
        source: { connect: { id: sourceId } },
      },
    })
    await Promise.all(
      _owners.map(_o =>
        ctx.prisma.owner.create({
          data: {
            name: _o.name as string,
            schema: _o.schema,
            credential: {
              connect: {
                id: credz.id,
              },
            },
          },
        }),
      ),
    )
  }
  return credz
}

export const deleteCredential: FieldResolver<
  'Mutation',
  'deleteCredential'
> = async (_parent, { credentialId }, ctx) =>
  ctx.prisma.credential.delete({ where: { id: credentialId } })

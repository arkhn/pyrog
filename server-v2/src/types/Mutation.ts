import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { idArg, mutationType, stringArg, booleanArg } from 'nexus'

import { APP_SECRET } from 'utils'

export const Mutation = mutationType({
  /*
   * AUTH
   */

  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: stringArg({ nullable: false }),
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { name, email, password }, ctx) => {
        const hashedPassword = await hash(password, 10)
        const user = await ctx.photon.users.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        })
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { email, password }, context) => {
        const user = await context.photon.users.findOne({
          where: {
            email,
          },
        })
        if (!user) {
          throw new Error(`No user found for email: ${email}`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error('Invalid password')
        }
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    /*
     * SOURCE
     */

    t.field('createSource', {
      type: 'Source',
      args: {
        name: stringArg({ nullable: false }),
        hasOwner: booleanArg({ nullable: false }),
      },
      resolve: async (_parent, { name, hasOwner }, ctx) =>
        ctx.photon.sources.create({ data: { name, hasOwner } }),
    })

    t.field('deleteSource', {
      type: 'Source',
      args: {
        name: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { name }, ctx) =>
        ctx.photon.sources.delete({ where: { name } }),
    })

    /*
     * RESOURCE
     */

    t.field('createResource', {
      type: 'Resource',
      args: {
        sourceId: idArg({ nullable: false }),
        resourceName: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { sourceId, resourceName }, ctx) => {
        let resourceSchema: any
        try {
          resourceSchema = require(`generated/fhir/${resourceName}.json`)
        } catch (e) {
          throw new Error(`Resource ${resourceName} does not exist.`)
        }

        const existing = await ctx.photon.resources.findMany({
          where: { source: { id: sourceId }, fhirType: resourceName },
          include: { source: true },
        })
        if (existing.length) {
          throw new Error(
            `Resource ${resourceName} already exists for source ${
              existing[0].source.name
            }`,
          )
        }

        const attributes = Object.keys(resourceSchema.properties).map(attr => ({
          name: attr,
          comment: resourceSchema.properties[attr].description,
        }))

        return ctx.photon.resources.create({
          data: {
            fhirType: resourceName,
            attributes: {
              create: attributes,
            },
            source: {
              connect: {
                id: sourceId,
              },
            },
          },
        })
      },
    })

    t.field('deleteResource', {
      type: 'Resource',
      args: {
        resourceId: idArg({ nullable: false }),
      },
      resolve: async (_parent, { resourceId }, ctx) =>
        ctx.photon.resources.delete({ where: { id: resourceId } }),
    })
  },
})

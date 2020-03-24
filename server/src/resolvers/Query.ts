import { arg, idArg, queryType } from 'nexus'

import { getDefinition } from 'fhir'
import { getUserId } from 'utils'
import { sourcesForUser } from './Source'
import { resourcesForUser } from './Resource'
import { searchDefinitions } from './StructureDefinition'

export const Query = queryType({
  definition(t) {
    t.field('me', {
      type: 'User',
      nullable: true,
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        return ctx.photon.users.findOne({
          where: {
            id: userId,
          },
        })
      },
    })

    t.field('credential', {
      type: 'Credential',
      args: {
        credentialId: idArg({ nullable: false }),
      },
      nullable: true,
      resolve: (parent, { credentialId }, ctx) =>
        ctx.photon.credentials.findOne({ where: { id: credentialId } }),
    })

    t.list.field('templates', {
      type: 'Template',
      nullable: true,
      resolve: (parent, args, ctx) => ctx.photon.templates(),
    })

    t.field('template', {
      type: 'Template',
      args: {
        templateId: idArg({ nullable: false }),
      },
      nullable: true,
      resolve: (parent, { templateId }, ctx) =>
        ctx.photon.templates.findOne({ where: { id: templateId } }),
    })

    t.list.field('sources', {
      type: 'Source',
      nullable: true,
      resolve: (parent, args, ctx) => ctx.photon.sources(),
    })

    t.list.field('sourcesForUser', {
      type: 'Source',
      args: {
        userId: idArg({ nullable: false }),
      },
      nullable: true,
      resolve: sourcesForUser,
    })

    t.field('source', {
      type: 'Source',
      args: {
        sourceId: idArg({ nullable: false }),
      },
      nullable: true,
      resolve: (parent, { sourceId }, ctx) =>
        ctx.photon.sources.findOne({ where: { id: sourceId } }),
    })

    t.field('resource', {
      type: 'Resource',
      args: {
        resourceId: idArg({ nullable: false }),
      },
      nullable: true,
      resolve: (parent, { resourceId }, ctx) =>
        ctx.photon.resources.findOne({
          where: { id: resourceId },
          include: { attributes: true },
        }),
    })

    t.list.field('resourcesForUser', {
      type: 'Resource',
      nullable: true,
      args: {
        userId: idArg({ nullable: false }),
        filter: arg({
          type: 'ResourceWhereInput',
        }),
      },
      resolve: resourcesForUser,
    })

    t.field('attribute', {
      type: 'Attribute',
      args: {
        attributeId: idArg({ nullable: false }),
      },
      nullable: true,
      resolve: (parent, { attributeId }, ctx) =>
        ctx.photon.attributes.findOne({ where: { id: attributeId } }),
    })

    t.field('structureDefinition', {
      type: 'StructureDefinition',
      args: {
        definitionId: idArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (_, { definitionId }) => getDefinition(definitionId),
    })

    t.list.field('structureDefinitions', {
      type: 'StructureDefinition',
      args: {
        filter: arg({ type: 'StructureDefinitionWhereFilter', required: true }),
      },
      nullable: true,
      resolve: searchDefinitions,
    })
  },
})

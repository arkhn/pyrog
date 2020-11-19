import { idArg, queryType } from '@nexus/schema'

import { getDefinition } from 'fhir'
import { sources } from './Source'

export const Query = queryType({
  definition(t) {
    t.field('me', {
      type: 'User',
      nullable: true,
      resolve: async (_, __, ctx) => ctx.user || null,
    })

    t.field('credential', {
      type: 'Credential',
      args: {
        credentialId: idArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (parent, { credentialId }, ctx) =>
        ctx.prisma.credential.findOne({ where: { id: credentialId } }),
    })

    t.list.field('templates', {
      type: 'Template',
      nullable: true,
      resolve: (parent, args, ctx) => ctx.prisma.template?.findMany(),
    })

    t.field('template', {
      type: 'Template',
      args: {
        templateId: idArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (parent, { templateId }, ctx) =>
        ctx.prisma.template.findOne({ where: { id: templateId } }),
    })

    t.list.field('allSources', {
      type: 'Source',
      nullable: true,
      resolve: (parent, args, ctx) => ctx.prisma.source.findMany(),
    })

    t.list.field('sources', {
      type: 'Source',
      nullable: true,
      resolve: sources,
    })

    t.field('source', {
      type: 'Source',
      args: {
        sourceId: idArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (parent, { sourceId }, ctx) =>
        ctx.prisma.source.findOne({ where: { id: sourceId } }),
    })

    t.field('resource', {
      type: 'Resource',
      args: {
        resourceId: idArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (parent, { resourceId }, ctx) =>
        ctx.prisma.resource.findOne({
          where: { id: resourceId },
          include: { attributes: true },
        }),
    })

    t.field('attribute', {
      type: 'Attribute',
      args: {
        attributeId: idArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (parent, { attributeId }, ctx) =>
        ctx.prisma.attribute.findOne({ where: { id: attributeId } }),
    })

    t.field('structureDefinition', {
      type: 'StructureDefinition',
      args: {
        definitionId: idArg({ nullable: false }),
      },
      nullable: true,
      resolve: async (_, { definitionId }) => getDefinition(definitionId),
    })
  },
})

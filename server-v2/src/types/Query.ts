import { idArg, queryType, stringArg } from 'nexus'

import { getUserId } from 'utils'

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
        ctx.photon.resources.findOne({ where: { id: resourceId } }),
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
  },
})

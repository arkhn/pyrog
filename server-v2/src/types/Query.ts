import { idArg, queryType, stringArg } from 'nexus'
import { getUserId } from '../utils'
import { Photon } from '@prisma/photon'

const photon = new Photon()

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

    t.list.field('sources', {
      type: 'Source',
      nullable: true,
      resolve: (parent, args, ctx) => ctx.photon.sources(),
    })
  },
})

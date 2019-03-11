import { forwardTo } from 'prisma-binding'

import {
    checkAuth,
    Context,
    getUserId,
    getRecAttribute,
} from '../utils'

export const Query = {
    // BINDING QUERIES
    inputColumns: checkAuth(forwardTo('binding')),
    resource: checkAuth(forwardTo('binding')),

    // CLIENT QUERIES
    allDatabases(parent, args, context: Context) {
        getUserId(context)

        return context.client.databases()
    },
    availableResources(parent, { database }, context: Context) {
        getUserId(context)

        return context.client.database({
            name: database,
        })
        .resources()
    },
    async recAvailableAttributes(parent, { resourceId }, context: Context) {
        getUserId(context)

        const directAttributes = await context.client
            .resource({
                id: resourceId,
            })
            .attributes()

        return directAttributes.map(async (attribute) => {
            return {
                ...attribute,
                attributes: await getRecAttribute(attribute, context),
            }
        })
    },
    me (parent, args, context: Context) {
        const id = getUserId(context)

        return context.client.user({ id })
    },
}

import {
    Context,
    getUserId,
    getRecAttribute,
} from '../utils'
import { forwardTo } from 'prisma-binding'

export const Query = {
    // BINDING END POINTS
    attribute: forwardTo('binding'),
    databases: forwardTo('binding'),
    // CLIENT END POINTS
    allDatabases(parent, args, context: Context) {
        return context.client.databases()
    },
    availableResources(parent, { database }, context: Context) {
        return context.client.database({
            name: database,
        })
        .resources()
    },
    async availableAttributes(parent, { resourceId }, context: Context) {
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
    inputColumns(parent, { attributeId }, context: Context) {
        return context.client
            .attribute({
                id: attributeId,
            })
            .inputColumns()
    },
    me (parent, args, context: Context) {
        const id = getUserId(context)

        return context.client.user({ id })
    },
}

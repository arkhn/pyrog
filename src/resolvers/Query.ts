import {
    Context,
    getUserId,
    getRecAttribute,
} from '../utils'
import { forwardTo } from 'prisma-binding'

export const Query = {
    allDatabases(parent, args, context: Context) {
        return context.client.databases()
    },
    availableResources(parent, { database }, context: Context) {
        return context.client.database({
            name: database,
        })
        .resources()
    },
    async availableAttributes(parent, { id }, context: Context) {
        const directAttributes = await context.client.resource({ id }).attributes()

        return directAttributes.map(async (attribute) => {
            return {
                ...attribute,
                attributes: await getRecAttribute(attribute, context),
            }
        })
    },
    databases: forwardTo('binding'),
    me (parent, args, context: Context) {
        const id = getUserId(context)
        return context.client.user({ id })
    },
}

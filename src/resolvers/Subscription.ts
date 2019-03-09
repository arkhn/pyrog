import { Context } from '../utils'

export const Subscription = {
    resource: {
        subscribe: (parent, { id }, context: Context) => {
            return context.client.$subscribe.resource({ node: { id } })
        },
    },
    attribute: {
        subscribe: (parent, { id }, context: Context) => {
            return context.client.$subscribe.attribute({ node: { id } })
        },
    },
    inputColumn: {
        subscribe: (parent, { id }, context: Context) => {
            return context.client.$subscribe.inputColumn({ node: { id } })
        },
    },
    join: {
        subscribe: (parent, { id }, context: Context) => {
            return context.client.$subscribe.join({ node: { id } })
        },
    },
}

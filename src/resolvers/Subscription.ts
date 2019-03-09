import { Context } from '../utils'

export const Subscription = {
    resource: {
        subscribe: async (parent, { id }, context: Context) => {
            return context.client.$subscribe
                .resource({
                    mutation_in: ['CREATED', 'UPDATED'],
                    node: { id },
                })
                .node()
        },
        resolve: payload => {
            return payload
        },
    },
    attribute: {
        subscribe: async (parent, { id }, context: Context) => {
            return context.client.$subscribe
                .attribute({
                    mutation_in: ['CREATED', 'UPDATED'],
                    node: { id }
                })
                .node()
                .inputColumns()
        },
        resolve: payload => {
            return payload
        },
    },
    inputColumn: {
        subscribe: async (parent, { id }, context: Context) => {
            return context.client.$subscribe.inputColumn({
                mutation_in: ['CREATED', 'UPDATED'],
                node: { id }
            }).node()
        },
        resolve: payload => {
            return payload
        },
    },
    join: {
        subscribe: async (parent, { id }, context: Context) => {
            return context.client.$subscribe.join({
                mutation_in: ['CREATED', 'UPDATED'],
                node: { id }
            }).node()
        },
        resolve: payload => {
            return payload
        },
    },
}

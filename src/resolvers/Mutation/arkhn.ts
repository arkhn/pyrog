import {
    Context,
    getAttribute,
} from '../../utils'

export const arkhn = {
    createResourceTreeInDatabase(parent, args, context: Context, info) {
        try {
            // TODO : most horrible code line ever, change it
            let json_query = require('../../../../fhir-store/graphql/' + args.resource + '.json')

            return context.client.createResource({
                database: {
                    connect: {
                        name: args.database
                    }
                },
                name: (<any>json_query).name,
                attributes: (<any>json_query).attributes,
            })
        } catch (error) {
            // TODO: return something consistent
            console.log('Problem boy')
        }
    },
    createAttributeProfileInAttribute(parent, args, context: Context, info) {
        try {
            // TODO : most horrible code line ever, change it
            let json_query = require('../../../../fhir-store/graphql/' + args.child_attribute_type + '.json')

            return context.client.createAttribute({
                attribute: {
                        connect: {
                            id: args.parent_attribute_id
                        }
                    },
                    name: args.child_attribute_name,
                    attributes: (<any>json_query).attributes,
            })
        } catch (error) {
            // TODO: return something consistent
            console.log('Problem boy')
        }
    },
    deleteAttribute(parent, args, context: Context, info) {
        return context.client.deleteAttribute({
            id: args.id,
        })
    },
    // async updateAttributeNoId(parent, args, context: Context, info) {
    //     let attribute = await getAttribute(parent, {
    //         database: args.database,
    //         resource: args.resource,
    //         attributePath: args.attributePath,
    //     }, context, info)
    //
    //     return context.client.updateAttribute({
    //         data: args.data,
    //         where: {
    //             id: attribute.id,
    //         }
    //     })
    // },
    // updateAttribute(parent, args, context: Context, info) {
    //     return context.client.updateAttribute({
    //         data: {
    //             ...args.data,
    //         },
    //         where: {
    //             id: args.id,
    //         }
    //     })
    // },
    // updateInputColumn(parent, args, context: Context, info) {
    //     return context.client.updateInputColumn({
    //         data: {
    //             ...args.data,
    //         },
    //         where: {
    //             id: args.id,
    //         }
    //     })
    // },
    // updateResource(parent, args, context: Context, info) {
    //     return context.client.updateResource({
    //         data: {
    //             ...args.data,
    //         },
    //         where: {
    //             id: args.id,
    //         }
    //     })
    // },
    // updateJoin(parent, args, context: Context, info) {
    //     return context.client.updateJoin({
    //         data: {
    //             ...args.data,
    //         },
    //         where: {
    //             id: args.id,
    //         }
    //     })
    // },
}

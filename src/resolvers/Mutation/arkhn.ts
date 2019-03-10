import {
    Context,
    getAttribute,
    getUserId,
} from '../../utils'

export const arkhn = {
    // createInputColumnViaAttribute et deleteInputColumnViaAttribute
    // sont construite de sorte à créer ou supprimer une inputColumn
    // à travers son attribut parent directement.
    // Cela permet que ce genre d'évènement (création, suppression)
    // soit pris en compte lors d'une subscription à l'attribut parent.
    // Une issue parle de ça ici : https://github.com/prisma/prisma/issues/146
    async createInputColumnViaAttribute(parent, { attributeId, data }, context: Context) {
        getUserId(context)

        // On crée une InputColumn et on récupère la dernière en date
        const inputColumns = await context.client.updateAttribute({
            data: {
                inputColumns: {
                    create: [{
                        ...data,
                    }]
                }
            },
            where: { id: attributeId }
        }).inputColumns({
            last: 1
        })

        // On ne renvoie qu'une InputColumn
        return inputColumns[0]
    },
    deleteInputColumnViaAttribute(parent, { attributeId, inputColumnId }, context: Context) {
        getUserId(context)

        return context.client.updateAttribute({
            data: {
                inputColumns: {
                    delete: {
                        id: inputColumnId,
                    }
                }
            },
            where: {
                id: attributeId,
            }
        })
    },
    updateInputColumn(parent, { id, data }, context: Context) {
        getUserId(context)

        return context.client.updateInputColumn({
            data,
            where: { id }
        })
    },
    // createResourceTreeInDatabase(parent, args, context: Context, info) {
    //     try {
    //         // TODO : most horrible code line ever, change it
    //         let json_query = require('../../fhir-store/graphql/' + args.resource + '.json')
    //
    //         return context.client.createResource({
    //             database: {
    //                 connect: {
    //                     name: args.database
    //                 }
    //             },
    //             name: (<any>json_query).name,
    //             attributes: (<any>json_query).attributes,
    //         })
    //     } catch (error) {
    //         // TODO: return something consistent
    //         console.log('Problem boy')
    //     }
    // },
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

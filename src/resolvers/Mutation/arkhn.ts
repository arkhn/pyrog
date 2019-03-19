import { forwardTo } from 'prisma-binding'

import {
    checkAuth,
    Context,
    getAttribute,
    getUserId,
    getUserType
} from '../../utils'

export const arkhn = {
    // createInputColumnViaAttribute et deleteInputColumnViaAttribute
    // sont construite de sorte à créer ou supprimer une inputColumn
    // à travers son attribut parent directement.
    // Cela permet que ce genre d'évènement (création, suppression)
    // soit pris en compte lors d'une subscription à l'attribut parent.
    // Une issue parle de ça ici : https://github.com/prisma/prisma/issues/146
    async createInputColumnAndUpdateAttribute(parent, { attributeId, data }, context: Context) {
        getUserId(context)

        // Création de la nouvelle inputColumn
        const inputColumn = await context.client.createInputColumn({
            ...data,
            attribute: {
                connect: {
                    id: attributeId,
                }
            }
        })

        // On update manuellement l'Attribut, sans rien modifier
        // ce qui permet de déclencher un évènement
        // pour les souscripteurs.
        const attribute = await context.client.updateAttribute({
            data: {},
            where: { id: attributeId }
        })

        return inputColumn
    },
    async deleteInputColumnAndUpdateAttribute(parent, { attributeId, inputColumnId }, context: Context) {
        getUserId(context)

        // Suppression d'une inputColumn
        const inputColumn = await context.client.deleteInputColumn({
            id: inputColumnId,
        })

        const attribute = await context.client.updateAttribute({
            data: {},
            where: { id: attributeId }
        })

        return inputColumn
    },
    async createJoinAndUpdateInputColumn(parent, { inputColumnId, data }, context: Context) {
        getUserId(context)

        const join = await context.client.createJoin({
            ...data,
            inputColumn: {
                connect: {
                    id: inputColumnId,
                }
            }
        })

        const inputColumn = await context.client.updateInputColumn({
            data: {},
            where: { id: inputColumnId }
        })

        return join
    },
    async deleteJoinAndUpdateInputColumn(parent, { inputColumnId, joinId }, context: Context) {
        getUserId(context)

        // Suppression d'une inputColumn
        const join = await context.client.deleteJoin({
            id: joinId,
        })

        const inputColumn = await context.client.updateInputColumn({
            data: {},
            where: { id: inputColumnId }
        })

        return join
    },
    updateAttribute: checkAuth(forwardTo('binding')),
    updateInputColumn(parent, { id, data }, context: Context) {
        getUserId(context)

        return context.client.updateInputColumn({
            data,
            where: { id }
        })
    },
    updateJoin(parent, { id, data }, context: Context) {
        getUserId(context)

        return context.client.updateJoin({
            data,
            where: { id }
        })
    },
    createResourceTreeInDatabase(parent, args, context: Context, info) {
        getUserId(context)

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
    async createAttributeProfileInAttribute(parent, args, context: Context, info) {
        getUserId(context)

        try {
            // TODO : most horrible code line ever, change it
            let json_query = require('../../../../fhir-store/graphql/' + args.child_attribute_type + '.json')

            const createdAttribute = await context.client.createAttribute({
                attribute: {
                        connect: {
                            id: args.parent_attribute_id
                        }
                    },
                    name: args.child_attribute_name,
                    attributes: (<any>json_query).attributes,
            })

            const turnToProfile = await context.client.updateAttribute({
                    data: {isProfile: true},
                    where: { id: createdAttribute.id }
                })

            return createdAttribute
        } catch (error) {
            // TODO: return something consistent
            console.log('Problem boy')
        }
    },
    async deleteAttributeProfile(parent, args, context: Context, info) {
        getUserId(context)

        const attribute = await context.client.attribute({id: args.id})

        if (attribute['isProfile']) {
            return context.client.deleteAttribute({
                id: args.id,
            })
        } else{
            console.log("This attribute is not a profile. It cannot be deleted via 'deleteAttributeProfile'")
        }
        // TODO : Reimplement Authorization for devs with new datamodel
        // if (getUserType(context) == "dev") {
        //     return context.client.deleteAttribute({
        //         id: args.id,
        //     })}
        // else {
        //     console.log('u wish u were a dev boy')
        // }
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

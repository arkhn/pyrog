import { forwardTo } from 'prisma-binding'

import {
    checkAuth,
    Context,
    getAttribute,
    getUserId,
    getUserType
} from '../../utils'

export const arkhn = {
    async createDatabase(parent, {databaseName }, context: Context) {
        getUserId(context)

        return await context.client.createDatabase({
            name: databaseName,
        })
    },
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
    async updateInputColumn(parent, { id, data }, context: Context) {
        getUserId(context)

        return await context.client.updateInputColumn({
            data,
            where: { id }
        })
    },
    async updateJoin(parent, { id, data }, context: Context) {
        getUserId(context)

        return await context.client.updateJoin({
            data,
            where: { id }
        })
    },
    createResourceTreeInDatabase(parent, { databaseId, resourceName }, context: Context) {
        getUserId(context)

        try {
            // TODO : most horrible code line ever, change it
            let json_query = require(`../../../../fhir-store/graphql/${resourceName}.json`)

            return context.client.createResource({
                database: { connect: { id: databaseId, } },
                name: resourceName,
                attributes: (<any>json_query).attributes,
            })
        } catch (error) {
            // TODO: return something consistent
            console.log(error)
            console.log('Problem boy')
        }
    },
    createAttributeProfileInAttribute(parent, args, context: Context, info) {
        getUserId(context)

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
        getUserId(context)

        if (getUserType(context) == "dev") {
            return context.client.deleteAttribute({
                id: args.id,
            })}
        else {
            console.log('u wish u were a dev boy')
        }
    },
}

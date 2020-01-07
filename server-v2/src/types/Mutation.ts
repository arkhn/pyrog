import { arg, idArg, mutationType, stringArg, booleanArg } from 'nexus'

import { createResource, updateResource, deleteResource } from './Resource'
import { deleteSource, createSource } from './Source'
import { createAttribute, updateAttribute, deleteAttribute } from './Attribute'
import { signup, login } from './User'
import { createInput, deleteInput } from './Input'
import { deleteCredential, upsertCredential } from './Credential'
import { createTemplate, deleteTemplate } from './Template'
import { addJoinToColumn } from './Column'
import { updateJoin, deleteJoin } from './Join'

export const Mutation = mutationType({
  /*
   * AUTH
   */

  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: stringArg({ required: true }),
        email: stringArg({ required: true }),
        password: stringArg({ required: true }),
      },
      resolve: signup,
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: stringArg({ required: true }),
        password: stringArg({ required: true }),
      },
      resolve: login,
    })

    /*
     * TEMPLATE
     */

    t.field('createTemplate', {
      type: 'Template',
      args: {
        name: stringArg({ required: true }),
      },
      resolve: createTemplate,
    })

    t.field('deleteTemplate', {
      type: 'Template',
      args: {
        id: idArg({ required: true }),
      },
      resolve: deleteTemplate,
    })

    /*
     * SOURCE
     */

    t.field('createSource', {
      type: 'Source',
      args: {
        templateName: stringArg({ required: true }),
        name: stringArg({ required: true }),
        hasOwner: booleanArg({ required: true }),
      },
      resolve: createSource,
    })

    t.field('deleteSource', {
      type: 'Source',
      args: {
        id: idArg({ required: true }),
      },
      resolve: deleteSource,
    })

    /*
     * CREDENTIAL
     */

    t.field('upsertCredential', {
      type: 'Credential',
      args: {
        sourceId: idArg({ required: true }),
        host: stringArg({ required: true }),
        port: stringArg({ required: true }),
        database: stringArg({ required: true }),
        login: stringArg({ required: true }),
        password: stringArg({ required: true }),
        model: stringArg({ required: true }),
      },
      resolve: upsertCredential,
    })

    t.field('deleteCredential', {
      type: 'Credential',
      args: {
        id: idArg({ required: true }),
      },
      resolve: deleteCredential,
    })

    /*
     * RESOURCE
     */

    t.field('createResource', {
      type: 'Resource',
      args: {
        sourceId: idArg({ required: true }),
        resourceName: stringArg({ required: true }),
      },
      resolve: createResource,
    })

    t.field('deleteResource', {
      type: 'Resource',
      args: {
        id: idArg({ required: true }),
      },
      resolve: deleteResource,
    })

    t.field('updateResource', {
      type: 'Resource',
      args: {
        resourceId: idArg({ required: true }),
        data: arg({ type: 'UpdateResourceInput', required: true }),
      },
      resolve: updateResource,
    })

    /*
     * ATTRIBUTE
     */

    t.field('createAttribute', {
      type: 'Attribute',
      args: {
        parentId: idArg({ required: true }),
      },
      resolve: createAttribute,
    })

    t.field('updateAttribute', {
      type: 'Attribute',
      args: {
        attributeId: idArg({ required: true }),
        data: arg({ type: 'UpdateAttributeInput', required: true }),
      },
      resolve: updateAttribute,
    })

    t.field('deleteAttribute', {
      type: 'Attribute',
      args: {
        id: idArg({ required: true }),
      },
      resolve: deleteAttribute,
    })

    /*
     * INPUT
     */

    t.field('createInput', {
      type: 'Input',
      args: {
        attributeId: idArg({ required: true }),
        script: stringArg(),
        static: stringArg(),
        sql: arg({
          type: 'ColumnInput',
        }),
      },
      resolve: createInput,
    })

    t.field('deleteInput', {
      type: 'Input',
      args: {
        id: idArg({ required: true }),
      },
      resolve: deleteInput,
    })

    /*
     * COLUMN
     */

    t.field('addJoinToColumn', {
      type: 'Column',
      args: {
        columnId: idArg({ required: true }),
        join: arg({ type: 'JoinInput' }),
      },
      resolve: addJoinToColumn,
    })

    /*
     * JOIN
     */

    t.field('updateJoin', {
      type: 'Join',
      args: {
        joinId: idArg({ required: true }),
        data: arg({ type: 'JoinInput', required: true }),
      },
      resolve: updateJoin,
    })

    t.field('deleteJoin', {
      type: 'Join',
      args: {
        id: idArg({ required: true }),
      },
      resolve: deleteJoin,
    })
  },
})

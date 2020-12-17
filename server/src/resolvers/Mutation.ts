import { arg, idArg, mutationType, stringArg, booleanArg } from '@nexus/schema'

import { createAttribute, deleteAttribute, deleteAttributes } from './Attribute'
import { createAccessControl, deleteAccessControl } from './AccessControl'
import { addJoinToColumn, updateColumn } from './Column'
import { createComment } from './Comment'
import { deleteCondition, updateCondition } from './Condition'
import { deleteCredential, upsertCredential } from './Credential'
import { createStaticInput, createSqlInput, deleteInput, updateInput } from './Input'
import {
  addConditionToInputGroup,
  createInputGroup,
  updateInputGroup,
} from './InputGroup'
import { updateJoin, deleteJoin } from './Join'
import { createResource, updateResource, deleteResource } from './Resource'
import { deleteSource, createSource } from './Source'
import { createTemplate, deleteTemplate } from './Template'
import { updateRole } from './User'
import cache from 'cache'

export const Mutation = mutationType({
  definition(t) {
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
        mapping: stringArg({ required: false }),
      },
      resolve: createSource,
    })

    t.field('deleteSource', {
      type: 'Source',
      args: {
        sourceId: idArg({ required: true }),
      },
      resolve: deleteSource,
    })

    /*
     * DATABASE
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
        owner: stringArg({ required: true }),
        model: stringArg({ required: true }),
      },
      resolve: upsertCredential,
    })

    t.field('deleteCredential', {
      type: 'Credential',
      args: {
        credentialId: idArg({ required: true }),
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
        definitionId: stringArg({ required: true }),
      },
      resolve: createResource,
    })

    t.field('deleteResource', {
      type: 'Resource',
      args: {
        resourceId: idArg({ required: true }),
      },
      resolve: deleteResource,
    })

    t.field('updateResource', {
      type: 'Resource',
      args: {
        resourceId: idArg({ required: true }),
        data: arg({ type: 'UpdateResourceInput', required: true }),
        filters: arg({ type: 'FilterInput', list: true }),
      },
      resolve: updateResource,
    })

    /*
     * ATTRIBUTE
     */

    t.field('createAttribute', {
      type: 'Attribute',
      args: {
        resourceId: idArg({ required: true }),
        definitionId: idArg({ required: true }),
        path: stringArg({ required: true }),
        sliceName: stringArg({ required: false }),
        data: arg({ type: 'AttributeInput' }),
      },
      resolve: createAttribute,
    })

    t.field('createComment', {
      type: 'Comment',
      args: {
        attributeId: idArg({ required: true }),
        content: stringArg({ required: true }),
        validation: booleanArg({ required: true }),
      },
      resolve: createComment,
    })

    t.field('deleteAttribute', {
      type: 'Attribute',
      args: {
        attributeId: idArg({ required: true }),
      },
      resolve: deleteAttribute,
    })

    t.list.field('deleteAttributes', {
      type: 'Attribute',
      nullable: true,
      args: {
        filter: arg({
          type: 'AttributeWhereInput',
        }),
      },
      resolve: deleteAttributes,
    })

    /*
     * INPUT GROUP
     */

    t.field('createInputGroup', {
      type: 'InputGroup',
      args: {
        attributeId: idArg({ required: true }),
      },
      resolve: createInputGroup,
    })

    t.field('updateInputGroup', {
      type: 'InputGroup',
      args: {
        inputGroupId: idArg({ required: true }),
        mergingScript: stringArg(),
      },
      resolve: updateInputGroup,
    })

    t.field('addConditionToInputGroup', {
      type: 'InputGroup',
      args: {
        inputGroupId: idArg({ required: true }),
        action: arg({ type: 'ConditionAction' }),
        columnInput: arg({
          type: 'ColumnInput',
        }),
        relation: arg({ type: 'ConditionRelation' }),
        value: stringArg(),
      },
      resolve: addConditionToInputGroup,
    })

    /*
     * CONDITION
     */

    t.field('updateCondition', {
      type: 'Condition',
      args: {
        conditionId: idArg({ required: true }),
        action: stringArg(),
        table: stringArg(),
        column: stringArg(),
        relation: arg({ type: 'ConditionRelation' }),
        value: stringArg(),
      },
      resolve: updateCondition,
    })

    t.field('deleteCondition', {
      type: 'Condition',
      args: {
        conditionId: idArg({ required: true }),
      },
      resolve: deleteCondition,
    })

    /*
     * INPUT
     */

    t.field('createSqlInput', {
      type: 'Input',
      args: {
        inputGroupId: idArg({ required: true }),
        script: stringArg(),
        conceptMapId: stringArg(),
        sql: arg({
          type: 'ColumnInput',
        }),
      },
      resolve: createSqlInput,
    })

    t.field('createStaticInput', {
      type: 'Input',
      args: {
        inputGroupId: idArg({ required: true }),
        value: stringArg(),
      },
      resolve: createStaticInput,
    })

    t.field('updateInput', {
      type: 'Input',
      args: {
        inputId: idArg({ required: true }),
        data: arg({ type: 'UpdateInputInput', required: true }),
      },
      resolve: updateInput,
    })

    t.field('deleteInput', {
      type: 'Input',
      args: {
        inputId: idArg({ required: true }),
      },
      resolve: deleteInput,
    })

    /*
     * COLUMN
     */

    t.field('updateColumn', {
      type: 'Column',
      args: {
        columnId: idArg({ required: true }),
        data: arg({ type: 'ColumnInputWithoutJoins', required: true }),
      },
      resolve: updateColumn,
    })

    t.field('addJoinToColumn', {
      type: 'Column',
      args: {
        columnId: idArg({ required: true }),
        join: arg({ type: 'JoinTablesInput', required: true }),
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
        data: arg({ type: 'JoinTablesInput', required: true }),
      },
      resolve: updateJoin,
    })

    t.field('deleteJoin', {
      type: 'Join',
      args: {
        joinId: idArg({ required: true }),
      },
      resolve: deleteJoin,
    })

    /*
     * ACCESS CONTROL
     */

    t.field('createAccessControl', {
      type: 'AccessControl',
      args: {
        userEmail: stringArg({ required: true }),
        sourceId: idArg({ required: true }),
        role: arg({ type: 'SourceRole', required: true }),
      },
      resolve: createAccessControl,
    })

    t.field('deleteAccessControl', {
      type: 'AccessControl',
      args: {
        accessControlId: idArg({ required: true }),
      },
      resolve: deleteAccessControl,
    })

    /*
     * USER
     */

    t.field('logout', {
      type: 'User',
      resolve: (_parent, _args, ctx) => {
        const { del } = cache()
        del!(`user:${ctx.user?.email}`)
        return ctx.user!
      },
    })

    t.field('updateRole', {
      type: 'User',
      args: {
        userId: idArg({ required: true }),
        newRole: arg({ type: 'Role', required: true }),
      },
      resolve: updateRole,
    })
  },
})

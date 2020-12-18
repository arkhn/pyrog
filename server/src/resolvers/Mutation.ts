import {
  arg,
  idArg,
  mutationType,
  stringArg,
  booleanArg,
  nonNull,
  list,
  nullable,
} from 'nexus'

import { createAttribute, deleteAttribute, deleteAttributes } from './Attribute'
import { createAccessControl, deleteAccessControl } from './AccessControl'
import { addJoinToColumn } from './Column'
import { createComment } from './Comment'
import { deleteCondition, updateCondition } from './Condition'
import { deleteCredential, upsertCredential } from './Credential'
import { createInput, deleteInput, updateInput } from './Input'
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
import { Prisma } from '@prisma/client'

export const Mutation = mutationType({
  /*
   * AUTH
   */

  definition(t) {
    /*
     * TEMPLATE
     */

    t.field('createTemplate', {
      type: 'Template',
      args: {
        name: nonNull(stringArg()),
      },
      resolve: createTemplate,
    })

    t.field('deleteTemplate', {
      type: 'Template',
      args: {
        id: nonNull(idArg()),
      },
      resolve: deleteTemplate,
    })

    /*
     * SOURCE
     */

    t.field('createSource', {
      type: 'Source',
      args: {
        templateName: nonNull(stringArg()),
        name: nonNull(stringArg()),
        mapping: stringArg(),
      },
      resolve: createSource,
    })

    t.field('deleteSource', {
      type: 'Source',
      args: {
        sourceId: nonNull(idArg()),
      },
      resolve: deleteSource,
    })

    /*
     * DATABASE
     */

    t.field('upsertCredential', {
      type: 'Credential',
      args: {
        sourceId: nonNull(idArg()),
        host: nonNull(stringArg()),
        port: nonNull(stringArg()),
        database: nonNull(stringArg()),
        login: nonNull(stringArg()),
        password: nonNull(stringArg()),
        owner: nonNull(stringArg()),
        model: nonNull(stringArg()),
      },
      resolve: upsertCredential,
    })

    t.field('deleteCredential', {
      type: 'Credential',
      args: {
        credentialId: nonNull(idArg()),
      },
      resolve: deleteCredential,
    })

    /*
     * RESOURCE
     */

    t.field('createResource', {
      type: 'Resource',
      args: {
        sourceId: nonNull(idArg()),
        definitionId: nonNull(stringArg()),
      },
      resolve: createResource,
    })

    t.field('deleteResource', {
      type: 'Resource',
      args: {
        resourceId: nonNull(idArg()),
      },
      resolve: deleteResource,
    })

    t.field('updateResource', {
      type: 'Resource',
      args: {
        resourceId: nonNull(idArg()),
        data: nonNull(arg({ type: 'UpdateResourceInput' })),
        filters: list(arg({ type: 'FilterInput' })),
      },
      resolve: updateResource,
    })

    /*
     * ATTRIBUTE
     */

    t.field('createAttribute', {
      type: 'Attribute',
      args: {
        resourceId: nonNull(idArg()),
        definitionId: nonNull(idArg()),
        path: nonNull(stringArg()),
        sliceName: stringArg(),
        data: arg({ type: 'AttributeInput' }),
      },
      resolve: createAttribute,
    })

    t.field('createComment', {
      type: 'Comment',
      args: {
        attributeId: nonNull(idArg()),
        content: nonNull(stringArg()),
        validation: nonNull(booleanArg()),
      },
      resolve: createComment,
    })

    t.field('deleteAttribute', {
      type: 'Attribute',
      args: {
        attributeId: nonNull(idArg()),
      },
      resolve: deleteAttribute,
    })

    t.field('deleteAttributes', {
      type: nullable('Attribute'),
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
        attributeId: nonNull(idArg()),
      },
      resolve: createInputGroup,
    })

    t.field('updateInputGroup', {
      type: 'InputGroup',
      args: {
        inputGroupId: nonNull(idArg()),
        mergingScript: stringArg(),
      },
      resolve: updateInputGroup,
    })

    t.field('addConditionToInputGroup', {
      type: 'InputGroup',
      args: {
        inputGroupId: nonNull(idArg()),
        action: stringArg(),
        table: stringArg(),
        column: stringArg(),
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
        conditionId: nonNull(idArg()),
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
        conditionId: nonNull(idArg()),
      },
      resolve: deleteCondition,
    })

    /*
     * INPUT
     */

    t.field('createInput', {
      type: 'Input',
      args: {
        inputGroupId: nonNull(idArg()),
        script: stringArg(),
        static: stringArg(),
        sql: arg({
          type: 'ColumnInput',
        }),
      },
      resolve: createInput,
    })

    t.field('updateInput', {
      type: 'Input',
      args: {
        inputId: nonNull(idArg()),
        data: nonNull(arg({ type: 'UpdateInputInput' })),
      },
      resolve: updateInput,
    })

    t.field('deleteInput', {
      type: 'Input',
      args: {
        inputId: nonNull(idArg()),
      },
      resolve: deleteInput,
    })

    /*
     * COLUMN
     */

    t.field('addJoinToColumn', {
      type: 'Column',
      args: {
        columnId: nonNull(idArg()),
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
        joinId: nonNull(idArg()),
        data: nonNull(arg({ type: 'JoinInput' })),
      },
      resolve: updateJoin,
    })

    t.field('deleteJoin', {
      type: 'Join',
      args: {
        joinId: nonNull(idArg()),
      },
      resolve: deleteJoin,
    })

    /*
     * ACCESS CONTROL
     */

    t.field('createAccessControl', {
      type: 'AccessControl',
      args: {
        userEmail: nonNull(stringArg()),
        sourceId: nonNull(idArg()),
        role: nonNull(arg({ type: 'SourceRole' })),
      },
      resolve: createAccessControl,
    })

    t.field('deleteAccessControl', {
      type: 'AccessControl',
      args: {
        accessControlId: nonNull(idArg()),
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
        userId: nonNull(idArg()),
        newRole: nonNull(arg({ type: 'Role' })),
      },
      resolve: updateRole,
    })
  },
})

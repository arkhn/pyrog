import { inputObjectType } from 'nexus'

export const AttributeInput = inputObjectType({
  name: 'AttributeInput',
  definition(t) {
    t.string('comments')
    t.string('mergingScript')
  },
})

export const UpdateResourceInput = inputObjectType({
  name: 'UpdateResourceInput',
  definition(t) {
    t.field('label', { type: 'String' })
    t.field('primaryKeyOwner', { type: 'String' })
    t.field('primaryKeyTable', { type: 'String' })
    t.field('primaryKeyColumn', { type: 'String' })
  },
})

export const UpdateInputInput = inputObjectType({
  name: 'UpdateInputInput',
  definition(t) {
    t.field('script', { type: 'String' })
    t.field('conceptMap', { type: 'String' })
  },
})

export const ColumnInput = inputObjectType({
  name: 'ColumnInput',
  definition(t) {
    t.field('owner', { type: 'String', required: true })
    t.field('table', { type: 'String', required: true })
    t.field('column', { type: 'String', required: true })
    t.list.field('joins', {
      type: 'JoinInput',
    })
  },
})

export const ColumnInputWithoutJoins = inputObjectType({
  name: 'ColumnInputWithoutJoins',
  definition(t) {
    t.field('owner', { type: 'String' })
    t.field('table', { type: 'String' })
    t.field('column', { type: 'String' })
  },
})

export const JoinInput = inputObjectType({
  name: 'JoinInput',
  definition(t) {
    t.field('source', {
      type: 'ColumnInputWithoutJoins',
    })
    t.field('target', {
      type: 'ColumnInputWithoutJoins',
    })
  },
})

export const StructureDefinitionWhereFilter = inputObjectType({
  name: 'StructureDefinitionWhereFilter',
  definition(t) {
    t.field('derivation', { type: 'String' })
    t.field('kind', { type: 'String' })
    t.field('type', { type: 'String' })
  },
})

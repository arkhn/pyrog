import { inputObjectType, nonNull } from 'nexus'

export const UpdateResourceInput = inputObjectType({
  name: 'UpdateResourceInput',
  definition(t) {
    t.field('label', { type: 'String' })
    t.field('primaryKeyTable', { type: 'String' })
    t.field('primaryKeyColumn', { type: 'String' })
  },
})

export const AttributeInput = inputObjectType({
  name: 'AttributeInput',
  definition(t) {
    t.string('mergingScript')
  },
})

export const FilterInput = inputObjectType({
  name: 'FilterInput',
  definition(t) {
    t.nonNull.field('sqlColumn', { type: 'ColumnInputWithoutJoins' })
    t.nonNull.field('relation', { type: 'String' })
    t.nonNull.field('value', { type: 'String' })
  },
})

export const UpdateInputInput = inputObjectType({
  name: 'UpdateInputInput',
  definition(t) {
    t.field('script', { type: 'String' })
    t.field('conceptMapId', { type: 'String' })
  },
})

export const ColumnInput = inputObjectType({
  name: 'ColumnInput',
  definition(t) {
    t.nonNull.field('table', { type: 'String' })
    t.nonNull.field('column', { type: 'String' })
    t.list.nonNull.field('joins', {
      type: 'JoinInput',
    })
  },
})

export const ColumnInputWithoutJoins = inputObjectType({
  name: 'ColumnInputWithoutJoins',
  definition(t) {
    t.field('table', { type: 'String' })
    t.field('column', { type: 'String' })
  },
})

export const JoinInput = inputObjectType({
  name: 'JoinInput',
  definition(t) {
    t.nonNull.field('source', {
      type: 'ColumnInputWithoutJoins',
    })
    t.nonNull.field('target', {
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

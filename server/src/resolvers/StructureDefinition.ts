import { objectType, FieldResolver } from 'nexus'
import {
  StructureDefinitionCreateInput,
  StructureDefinitionUpdateInput,
} from '@prisma/photon'
import { getUserId } from 'utils'

export const StructureDefinition = objectType({
  name: 'StructureDefinition',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.type()
    t.model.description()
    t.model.author()
    t.model.kind()
    t.model.derivation()

    t.field('content', { type: 'JSON', resolve: () => t.model.content() })

    t.model.updatedAt()
    t.model.createdAt()
  },
})

export const createStructureDefinition: FieldResolver<
  'Mutation',
  'createStructureDefinition'
> = async (_parent, { definition: rawDefinition }, ctx) => {
  const definition = JSON.parse(rawDefinition)
  if (
    !definition.resourceType ||
    definition.resourceType !== 'StructureDefinition'
  ) {
    throw new Error(`${definition.name} must be a FHIR definition resource`)
  }

  const data: StructureDefinitionCreateInput = {
    id: definition.id,
    name: definition.name,
    type: definition.type,
    description: definition.description,
    kind: definition.kind,
    derivation: definition.derivation,
    author: definition.publisher || getUserId(ctx),
    content: JSON.stringify(definition),
  }
  return ctx.photon.structureDefinitions.create({ data })
}

export const updateStructureDefinition: FieldResolver<
  'Mutation',
  'updateStructureDefinition'
> = async (_parent, { id, definition: rawDefinition }, ctx) => {
  const definition = JSON.parse(rawDefinition)
  if (
    !definition.resourceType ||
    definition.resourceType !== 'StructureDefinition'
  ) {
    throw new Error(`${definition.name} must be a FHIR definition resource`)
  }

  if (definition.id !== id) {
    throw new Error(
      `Provided id ('${id}') must match the definition's id ('${definition.id}')`,
    )
  }

  const data: StructureDefinitionUpdateInput = {
    name: definition.name,
    type: definition.type,
    description: definition.description,
    kind: definition.kind,
    derivation: definition.derivation,
    author: definition.publisher || getUserId(ctx),
    content: JSON.stringify(definition),
  }
  return ctx.photon.structureDefinitions.update({ where: { id }, data })
}

export const deleteStructureDefinition: FieldResolver<
  'Mutation',
  'deleteStructureDefinition'
> = async (_parent, { id }, ctx) =>
  ctx.photon.structureDefinitions.delete({ where: { id } })

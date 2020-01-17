import { FieldResolver } from 'nexus'
import {
  AttributeCreateWithoutResourceInput,
  InputCreateWithoutAttributeInput,
  ColumnCreateWithoutInputsInput,
  JoinCreateWithoutColumnInput,
  FindManyResourceIncludeArgs,
  Photon,
} from '@prisma/photon'

import {
  JoinWithColumn,
  ColumnWithJoins,
  InputWithColumn,
  AttributeWithChildren,
} from 'types'

import { CURRENT_MAPPING_VERSION, MAPPING_VERSION_1 } from '../constants'

const clean = (entry: any): any => {
  delete entry.id
  delete entry.updatedAt
  delete entry.createdAt
  return entry
}

const buildJoinsFromMapping = (
  joins: JoinWithColumn[],
): JoinCreateWithoutColumnInput[] | null =>
  joins.map(j => {
    let join: JoinCreateWithoutColumnInput = clean(j)
    if (j.tables && j.tables.length) {
      join.tables = { create: j.tables.map(clean) }
    } else {
      delete join.tables
    }
    return join
  })

const buildColumnFromMapping = (
  c: ColumnWithJoins,
): ColumnCreateWithoutInputsInput | null => {
  let column: ColumnCreateWithoutInputsInput = clean(c)
  if (c.joins && c.joins.length) {
    column.joins = { create: buildJoinsFromMapping(c.joins) }
  } else {
    delete column.joins
  }
  return column
}

const buildInputsFromMapping = (
  inputs: InputWithColumn[],
): InputCreateWithoutAttributeInput[] | null =>
  inputs.map(i => {
    let input: InputCreateWithoutAttributeInput = clean(i)
    if (i.sqlValue) {
      input.sqlValue = { create: buildColumnFromMapping(i.sqlValue) }
    } else {
      delete input.sqlValue
    }
    return input
  })

const buildResourceFromMapping = (
  children: AttributeWithChildren[],
): AttributeCreateWithoutResourceInput[] | null =>
  children.map(child => {
    let attr: AttributeCreateWithoutResourceInput = clean(child)
    if (child.children && child.children.length) {
      attr.children = { create: buildResourceFromMapping(child.children) }
    } else {
      delete attr.children
    }
    if (child.inputs && child.inputs.length) {
      attr.inputs = { create: buildInputsFromMapping(child.inputs) }
    } else {
      delete attr.inputs
    }
    return attr
  })

export const exportMapping: FieldResolver<'Source', 'mapping'> = async (
  parent,
  { depth },
  ctx,
) => {
  const buildRecursiveQuery = (dependencies: {
    [key: string]: any
  }): FindManyResourceIncludeArgs => {
    return {
      include: Object.keys(dependencies).reduce((acc, val) => {
        const item = dependencies[val]

        if (typeof item == 'number') {
          return {
            ...acc,
            [val]:
              item == 1
                ? true
                : buildRecursiveQuery({
                    ...dependencies,
                    [val]: item - 1,
                  }),
          }
        }

        return {
          ...acc,
          [val]: buildRecursiveQuery(item),
        }
      }, {}),
    }
  }
  const { template } = (await ctx.photon.sources.findOne({
    where: { id: parent.id },
    include: { template: true },
  }))!

  const resources = await ctx.photon.resources({
    where: { source: { id: parent.id } },
    ...buildRecursiveQuery({
      attributes: {
        children: depth,
        inputs: { sqlValue: { joins: { tables: 1 } } },
      },
    }),
  })
  return JSON.stringify({
    source: { name: parent.name, hasOwner: parent.hasOwner },
    template: { name: template.name },
    resources,
    version: CURRENT_MAPPING_VERSION,
  })
}

// copy all the resources from the mapping and their attributes.
// this is done through a single query matching the graph of the mapping.
export const importMapping = async (
  photon: Photon,
  sourceId: string,
  mapping: string,
) => {
  const { version, resources } = JSON.parse(mapping)
  if (!version) {
    throw new Error('Missing mapping version')
  }
  if (!resources) {
    throw new Error('Missing "resources" key in mapping')
  }
  switch (version) {
    case MAPPING_VERSION_1:
      return Promise.all(
        resources.map(async (r: any) =>
          photon.resources.create({
            data: {
              ...clean(r),
              attributes: {
                create: buildResourceFromMapping(r.attributes),
              },
              source: {
                connect: {
                  id: sourceId,
                },
              },
            },
          }),
        ),
      )
    default:
      throw new Error(`Unknown mapping version: "${version}"`)
  }
}
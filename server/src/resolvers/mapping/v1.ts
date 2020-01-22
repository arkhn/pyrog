import { Photon, Attribute, Resource } from '@prisma/photon'

import { AttributeWithChildren } from 'types'
import { clean, buildAttributesQuery } from './utils'

type AttributeV1 = Attribute & {
  name: string
  fhirType: string
  description: string
  isRequired: boolean
  isArray: boolean
  children: AttributeV1[]
}
type ResourceV1 = Resource & {
  profile: string
  fhirType: string
}

const cleanAttributeV1 = (attribute: AttributeV1) => {
  attribute = clean(attribute)
  delete attribute.name
  delete attribute.fhirType
  delete attribute.description
  delete attribute.isRequired
  delete attribute.isArray
  delete attribute.children
  return attribute
}

const cleanResourceV1 = (resource: ResourceV1) => {
  resource = clean(resource)
  delete resource.profile
  delete resource.fhirType
  return resource
}

const computePath = (
  attribute: AttributeV1,
  parent?: AttributeV1,
  index?: number,
): string => {
  if (parent) {
    return parent.isArray
      ? `${parent.path}[${index}]`
      : `${parent.path}.${attribute.name}`
  }
  return attribute.name
}

const flatten = (
  acc: any[],
  attribute: AttributeV1,
  parent?: AttributeV1,
  idx?: number,
) => {
  // TODO: compute path
  attribute.path = computePath(attribute, parent, idx)
  acc.push(attribute)
  if (attribute.children && attribute.children.length) {
    attribute.children.forEach((a, index) => flatten(acc, a, attribute, index))
  }
  return acc
}

export default (photon: Photon, sourceId: string, resources: any[]) => {
  return Promise.all(
    resources.map(async (r: any) => {
      const attributes = r.attributes
        .reduce((acc: any[], val: AttributeV1) => flatten(acc, val), [])
        .map(cleanAttributeV1)
        .filter((a: any) => a.inputs && a.inputs.length > 0)

      return photon.resources.create({
        data: {
          ...cleanResourceV1(r),
          attributes: {
            create: buildAttributesQuery(attributes),
          },
          source: {
            connect: {
              id: sourceId,
            },
          },
        },
      })
    }),
  )
}

import { PrismaClient } from '@prisma/client'
import { v4 } from 'uuid'

const prisma = new PrismaClient()

const initLogicalReference = async () => {
  const resourcesToInit = await prisma.resource.findMany({
    where: { logicalReference: '' },
  })

  const initializations = resourcesToInit.map(r =>
    prisma.resource.update({
      where: { id: r.id },
      data: { logicalReference: v4() },
    }),
  )
  return prisma.$transaction(initializations)
}

const updateIdentifiersSystem = async () => {
  const allResources = await prisma.resource.findMany({
    select: { logicalReference: true, id: true },
  })
  const logicalReferenceMapping: { [id: string]: string } = allResources.reduce(
    (acc, r) => ({ ...acc, [r.id]: v4() }),
    {},
  )

  // find all identifier attributes
  const identifierAttributes = await prisma.attribute.findMany({
    where: { definitionId: { equals: 'Identifier' } },
  })

  // find all identifier system attributes
  const identifierSystemAttributes = await prisma.attribute.findMany({
    where: { path: { in: identifierAttributes.map(a => `${a.path}.system`) } },
    include: {
      inputGroups: { include: { inputs: true } },
      resource: true,
    },
  })

  // compute prisma updates for identifiers' system input staticValue
  const inputUpdates = identifierSystemAttributes
    .filter(a => {
      const hasInput =
        a.inputGroups &&
        a.inputGroups.length &&
        a.inputGroups[0].inputs &&
        a.inputGroups[0].inputs.length &&
        a.inputGroups[0].inputs[0].staticValue
      if (!hasInput)
        console.warn(`[${a.resource!.definitionId}.${a.path}] missing input`)
      return hasInput
    })
    .map(a => {
      let prevSystemValue = a.inputGroups[0].inputs[0].staticValue!
      if (!prevSystemValue.includes('terminology.arkhn.org')) return null

      // system used to look like http://terminology.arkhn.com/<sourceId>/<resourceId>[/<optionalCustomKey>]
      const parts = prevSystemValue.split(/\//)
      const targetResourceId = parts[4]

      // extract the trailing custom identifier key if present
      const optionalIdentifierKey = parts.length === 6 ? parts[5] : null

      if (!targetResourceId) {
        console.error(
          `[${a.resource!.definitionId}.${
            a.path
          }] bad reference system: ${prevSystemValue}`,
        )
        return null
      } else if (!logicalReferenceMapping[targetResourceId]) {
        console.error(
          `[${a.resource!.definitionId}.${
            a.path
          }] could not update identifier system: resource id ${targetResourceId} does not exist`,
        )
        return null
      }

      const identifierSystem = `http://terminology.arkhn.org/${
        logicalReferenceMapping[targetResourceId]
      }${optionalIdentifierKey ? '/' + optionalIdentifierKey : ''}`

      // identifier.system now looks like http://terminology.arkhn.com/<resourceLogicalReference>[/<optionalCustomKey>]
      return prisma.input.update({
        where: { id: a.inputGroups[0].inputs[0].id },
        data: {
          staticValue: identifierSystem,
        },
      })
    })
    .filter(Boolean)

  console.log(`Updating ${inputUpdates.length} input records in the DB...`)
  await prisma.$transaction(inputUpdates)
}

initLogicalReference()
  .then(updateIdentifiersSystem)
  .then(() => process.exit(0))

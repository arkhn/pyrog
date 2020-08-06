import { PrismaClient } from '@prisma/client'

import importMappingV6 from './v6'
import * as mappingV6 from '../../../test/fixtures/chimio-mapping-v6.json'

const mockCreateResource = jest.fn()
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    resource: {
      create: (data: any) => mockCreateResource(data),
    },
  })),
}))

describe('import mapping V6', () => {
  const sourceId = '01234567'
  const resourceCount = 2
  const { resources } = mappingV6 as any

  beforeEach(() => {
    mockCreateResource.mockClear()
  })

  it('should send a query per resource', async () => {
    await importMappingV6(new PrismaClient(), sourceId, resources)
    expect(mockCreateResource).toHaveBeenCalledTimes(resourceCount)
    expect(mockCreateResource.mock.calls[0]).toMatchSnapshot() // EpisodeOfCare - HopitalStay
    expect(mockCreateResource.mock.calls[1]).toMatchSnapshot() // Patient
  })

  it('should have cleaned the resource and attributes', async () => {
    await importMappingV6(new PrismaClient(), sourceId, resources)
    expect(mockCreateResource.mock.calls[0][0]).toEqual({
      data: {
        id: resources[0].id,
        label: resources[0].label,
        primaryKeyTable: resources[0].primaryKeyTable,
        primaryKeyColumn: resources[0].primaryKeyColumn,
        source: {
          connect: {
            id: sourceId,
          },
        },
        definitionId: 'EpisodeOfCare',
        attributes: {
          create: expect.arrayContaining([
            {
              id: expect.any(String),
              path: 'period.start',
              definitionId: 'dateTime',
              inputGroups: {
                create: expect.arrayContaining([
                  {
                    mergingScript: 'merge_concat',
                    inputs: {
                      create: expect.any(Array),
                    },
                  },
                ]),
              },
            },
            {
              id: expect.any(String),
              path: 'managingOrganization.reference',
              comments: {
                create: {
                  author: {
                    connect: {
                      email: 'admin@arkhn.com',
                    },
                  },
                  content: 'test',
                },
              },
              definitionId: 'string',
              inputGroups: {
                create: expect.arrayContaining([
                  {
                    mergingScript: null,
                    inputs: {
                      create: expect.any(Array),
                    },
                  },
                ]),
              },
            },
          ]),
        },
        filters: {
          create: [
            {
              id: expect.any(String),
              value: '200',
              relation: '<=',
              sqlColumn: {
                create: {
                  id: expect.any(String),
                  column: 'CHAMBRE',
                  table: 'SEJOUR',
                },
              },
            },
          ],
        },
      },
    })
  })
})

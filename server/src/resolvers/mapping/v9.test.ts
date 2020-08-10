import { PrismaClient } from '@prisma/client'

import importMappingV9 from './v9'
import * as mappingV9 from '../../../test/fixtures/chimio-mapping-v9.json'

const mockCreateResource = jest.fn()

const mockFindManyUser = jest.fn(() => [{ email: 'admin@arkhn.com' }])
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    resource: {
      create: (data: any) => mockCreateResource(data),
    },
    user: {
      findMany: mockFindManyUser,
    },
  })),
}))

describe('import mapping V9', () => {
  const sourceId = '01234567'
  const { resources } = mappingV9 as any

  beforeEach(() => {
    mockCreateResource.mockClear()
  })

  it('should send a query per resource', async () => {
    await importMappingV9(new PrismaClient(), sourceId, resources)
    expect(mockCreateResource).toHaveBeenCalledTimes(resources.length)
    expect(mockCreateResource.mock.calls[0]).toMatchSnapshot() // EpisodeOfCare - HopitalStay
    expect(mockCreateResource.mock.calls[1]).toMatchSnapshot() // Patient
  })

  it('should raise an error if importing mapping with unexisting comment author', async () => {
    mockFindManyUser.mockReturnValueOnce([{ email: 'user@arkhn.com' }])
    const t = importMappingV9(new PrismaClient(), sourceId, resources)
    expect(t).rejects.toThrowError(
      'trying to import a mapping with unexisting comment author',
    )
  })

  it('should have cleaned the resource and attributes', async () => {
    await importMappingV9(new PrismaClient(), sourceId, resources)
    expect(mockCreateResource.mock.calls[0][0]).toEqual({
      data: {
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
              path: 'period.start',
              definitionId: 'dateTime',
              sliceName: null,
              inputGroups: {
                create: expect.arrayContaining([
                  {
                    mergingScript: 'merge_concat',
                    inputs: {
                      create: expect.any(Array),
                    },
                    conditions: {
                      create: expect.arrayContaining([
                        {
                          action: 'EXCLUDE',
                          value: '-1',
                          sqlValue: {
                            create: { table: 'SEJOUR', column: 'DATEIN' },
                          },
                        },
                      ]),
                    },
                  },
                ]),
              },
            },
            {
              path: 'managingOrganization.reference',
              comments: {
                create: [
                  {
                    author: {
                      connect: {
                        email: 'admin@arkhn.com',
                      },
                    },
                    content: 'test',
                    createdAt: '2020-04-02T08:53:07.997Z',
                  },
                ],
              },
              sliceName: null,
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
              value: '200',
              relation: '<=',
              sqlColumn: {
                create: {
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

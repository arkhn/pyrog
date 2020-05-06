import { PrismaClient } from '@prisma/client'

import importMappingV7 from './v7'
import * as mappingV7 from '../../../test/fixtures/chimio-mapping-v7.json'

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

describe('import mapping V7', () => {
  const sourceId = '01234567'
  const resourceCount = 2
  const { resources } = mappingV7 as any

  beforeEach(() => {
    mockCreateResource.mockClear()
  })

  it('should send a query per resource', async () => {
    await importMappingV7(new PrismaClient(), sourceId, resources)
    expect(mockCreateResource).toHaveBeenCalledTimes(resourceCount)
    expect(mockCreateResource.mock.calls[0]).toMatchSnapshot() // EpisodeOfCare - HopitalStay
    expect(mockCreateResource.mock.calls[1]).toMatchSnapshot() // Patient
  })

  it('should raise an error if importing mapping with unexisting comment author', async () => {
    mockFindManyUser.mockReturnValueOnce([{ email: 'user@arkhn.com' }])
    const t = importMappingV7(new PrismaClient(), sourceId, resources)
    expect(t).rejects.toThrowError(
      'trying to import a mapping with unexisting comment author',
    )
  })

  it('should have cleaned the resource and attributes', async () => {
    await importMappingV7(new PrismaClient(), sourceId, resources)
    expect(mockCreateResource.mock.calls[0][0]).toEqual({
      data: {
        id: resources[0].id,
        label: resources[0].label,
        primaryKeyOwner: resources[0].primaryKeyOwner,
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
              mergingScript: 'merge_concat',
              inputs: {
                create: expect.any(Array),
              },
            },
            {
              id: expect.any(String),
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
              definitionId: 'string',
              mergingScript: null,
              inputs: {
                create: expect.any(Array),
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
                  owner: 'OPS$ACHQ1ABC',
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

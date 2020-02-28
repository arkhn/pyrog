import { Photon } from '@prisma/photon'

import importMappingV4 from './v4'
import * as mappingV4 from '../../../test/fixtures/chimio-mapping-v4.json'

const mockCreateResource = jest.fn()
jest.mock('@prisma/photon', () => ({
  Photon: jest.fn().mockImplementation(() => ({
    resources: {
      create: (data: any) => mockCreateResource(data),
    },
  })),
}))

describe('import mapping V4', () => {
  const sourceId = '01234567'
  const resourceCount = 2
  const { resources } = mappingV4 as any

  beforeEach(() => {
    mockCreateResource.mockClear()
  })

  it('should send a query per resource', async () => {
    await importMappingV4(new Photon(), sourceId, resources)
    expect(mockCreateResource).toHaveBeenCalledTimes(resourceCount)
    expect(mockCreateResource.mock.calls[0]).toMatchSnapshot() // EpisodeOfCare - HopitalStay
    expect(mockCreateResource.mock.calls[1]).toMatchSnapshot() // Patient
  })

  it('should have cleaned the resource and attributes', async () => {
    await importMappingV4(new Photon(), sourceId, resources)
    expect(mockCreateResource.mock.calls[0][0]).toEqual({
      data: {
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
              path: 'period.start',
              comments: null,
              mergingScript: 'merge_concat',
              inputs: {
                create: expect.any(Array),
              },
            },
          ]),
        },
      },
    })
  })
})

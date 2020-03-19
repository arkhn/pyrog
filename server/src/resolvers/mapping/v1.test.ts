import { Photon } from '@prisma/photon'
import set from 'lodash.set'

import importMappingV1 from './v1'
import * as mappingV1 from '../../../test/fixtures/chimio-mapping-v1.json'

const mockCreateResource = jest.fn()
jest.mock('@prisma/photon', () => ({
  Photon: jest.fn().mockImplementation(() => ({
    resources: {
      create: (data: any) => mockCreateResource(data),
    },
  })),
}))

describe('import mapping V1', () => {
  const sourceId = '01234567'
  const resourceCount = 2
  const { resources } = mappingV1 as any

  beforeEach(() => {
    mockCreateResource.mockClear()
  })

  it('should flatten the mapping and send a query per resource', async () => {
    await importMappingV1(new Photon(), sourceId, resources)
    expect(mockCreateResource).toHaveBeenCalledTimes(resourceCount)
    expect(mockCreateResource.mock.calls[0]).toMatchSnapshot() // EpisodeOfCare - HopitalStay
    expect(mockCreateResource.mock.calls[1]).toMatchSnapshot() // Patient
  })

  it('should have cleaned the resource and attributes', async () => {
    await importMappingV1(new Photon(), sourceId, resources)
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
              definitionId: '',
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

  it('should have computed the path correctly', async () => {
    await importMappingV1(new Photon(), sourceId, resources)
    const {
      attributes: { create: attributes },
    } = mockCreateResource.mock.calls[1][0].data // Patient attributes
    let structure = {}
    for (const a of attributes) {
      set(structure, a.path, a.inputs!.create) // use lodash to fill a structured object
    }
    expect(structure).toMatchSnapshot()
  })
})

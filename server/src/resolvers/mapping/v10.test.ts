import { PrismaClient } from '@prisma/client'

import importMappingV10 from './v10'
import * as mappingV10 from '../../../test/fixtures/mimic-mapping-v10.json'

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
  const source = {
    id: '01234567',
    credential: { id: '456', owners: [] },
  } as any
  const { resources } = mappingV10 as any

  beforeEach(() => {
    mockCreateResource.mockClear()
  })

  it('should send a query per resource', async () => {
    await importMappingV10(new PrismaClient(), source, resources)
    expect(mockCreateResource).toHaveBeenCalledTimes(resources.length)
    expect(mockCreateResource.mock.calls[0]).toMatchSnapshot() // EpisodeOfCare - HopitalStay
    expect(mockCreateResource.mock.calls[1]).toMatchSnapshot() // Patient
  })

  it('should raise an error if importing mapping with unexisting comment author', async () => {
    mockFindManyUser.mockReturnValueOnce([{ email: 'user@arkhn.com' }])
    const t = importMappingV10(new PrismaClient(), source, resources)
    expect(t).rejects.toThrowError(
      'trying to import a mapping with unexisting comment author',
    )
  })

  it('should have cleaned the resource and attributes', async () => {
    await importMappingV10(new PrismaClient(), source, resources)
    expect(mockCreateResource.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "attributes": Object {
            "create": Array [
              Object {
                "comments": Object {
                  "create": Array [
                    Object {
                      "author": Object {
                        "connect": Object {
                          "email": "admin@arkhn.com",
                        },
                      },
                      "content": "test",
                      "createdAt": "2020-04-02T08:53:07.997Z",
                    },
                  ],
                },
                "definitionId": "Extension",
                "path": "extension[1]",
                "sliceName": null,
              },
              Object {
                "definitionId": "uri",
                "inputGroups": Object {
                  "create": Array [
                    Object {
                      "inputs": Object {
                        "create": Array [
                          Object {
                            "conceptMapId": null,
                            "script": null,
                            "staticValue": "http://hl7.org/fhir/StructureDefinition/patient-congregation",
                          },
                        ],
                      },
                      "mergingScript": null,
                    },
                  ],
                },
                "path": "extension[1].url",
                "sliceName": null,
              },
              Object {
                "definitionId": "string",
                "inputGroups": Object {
                  "create": Array [
                    Object {
                      "inputs": Object {
                        "create": Array [
                          Object {
                            "conceptMapId": null,
                            "script": null,
                            "sqlValue": Object {
                              "create": Object {
                                "column": "gender",
                                "owner": Object {
                                  "connect": Object {
                                    "Owner_name_credential_unique_constraint": Object {
                                      "credentialId": "456",
                                      "name": "mimiciii",
                                    },
                                  },
                                },
                                "table": "patients",
                              },
                            },
                            "staticValue": null,
                          },
                        ],
                      },
                      "mergingScript": null,
                    },
                  ],
                },
                "path": "extension[1].valueString",
                "sliceName": null,
              },
              Object {
                "definitionId": "string",
                "inputGroups": Object {
                  "create": Array [
                    Object {
                      "inputs": Object {
                        "create": Array [
                          Object {
                            "conceptMapId": null,
                            "script": null,
                            "staticValue": "Jean",
                          },
                        ],
                      },
                      "mergingScript": null,
                    },
                  ],
                },
                "path": "name[0].given[0]",
                "sliceName": null,
              },
              Object {
                "definitionId": "HumanName",
                "path": "name[0]",
                "sliceName": null,
              },
              Object {
                "definitionId": "string",
                "inputGroups": Object {
                  "create": Array [
                    Object {
                      "inputs": Object {
                        "create": Array [
                          Object {
                            "conceptMapId": null,
                            "script": null,
                            "staticValue": "Georges",
                          },
                        ],
                      },
                      "mergingScript": null,
                    },
                  ],
                },
                "path": "name[0].given[1]",
                "sliceName": null,
              },
              Object {
                "definitionId": "uri",
                "inputGroups": Object {
                  "create": Array [
                    Object {
                      "inputs": Object {
                        "create": Array [
                          Object {
                            "conceptMapId": null,
                            "script": null,
                            "staticValue": "http://terminology.arkhn.org/b8efd322-3e38-4072-9c68-e62e15d84d04",
                          },
                        ],
                      },
                      "mergingScript": null,
                    },
                  ],
                },
                "path": "identifier[0].system",
                "sliceName": null,
              },
              Object {
                "definitionId": "Identifier",
                "path": "identifier[0]",
                "sliceName": null,
              },
              Object {
                "definitionId": "string",
                "inputGroups": Object {
                  "create": Array [
                    Object {
                      "inputs": Object {
                        "create": Array [
                          Object {
                            "conceptMapId": null,
                            "script": null,
                            "sqlValue": Object {
                              "create": Object {
                                "column": "subject_id",
                                "owner": Object {
                                  "connect": Object {
                                    "Owner_name_credential_unique_constraint": Object {
                                      "credentialId": "456",
                                      "name": "mimiciii",
                                    },
                                  },
                                },
                                "table": "patients",
                              },
                            },
                            "staticValue": null,
                          },
                        ],
                      },
                      "mergingScript": null,
                    },
                  ],
                },
                "path": "identifier[0].value",
                "sliceName": null,
              },
            ],
          },
          "definitionId": "Patient",
          "filters": Object {
            "create": Array [],
          },
          "label": "feat_1_extension+Observation(microbio)Ref",
          "logicalReference": "b8efd322-3e38-4072-9c68-e62e15d84d04",
          "primaryKeyColumn": "row_id",
          "primaryKeyOwner": Object {
            "connect": Object {
              "Owner_name_credential_unique_constraint": Object {
                "credentialId": "456",
                "name": "mimiciii",
              },
            },
          },
          "primaryKeyTable": "patients",
          "source": Object {
            "connect": Object {
              "id": "01234567",
            },
          },
        },
      }
    `)
  })

  it('should have cleaned the resource and attributes', async () => {
    await importMappingV10(new PrismaClient(), source, resources)
    expect(mockCreateResource.mock.calls[4][0]).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "attributes": Object {
            "create": Array [
              Object {
                "definitionId": "uri",
                "inputGroups": Object {
                  "create": Array [
                    Object {
                      "inputs": Object {
                        "create": Array [
                          Object {
                            "conceptMapId": null,
                            "script": null,
                            "staticValue": "http://terminology.arkhn.org/33684f2e-bb84-4863-baea-7f1f199e0dd4",
                          },
                        ],
                      },
                      "mergingScript": null,
                    },
                  ],
                },
                "path": "identifier[0].system",
                "sliceName": null,
              },
              Object {
                "definitionId": "string",
                "inputGroups": Object {
                  "create": Array [
                    Object {
                      "inputs": Object {
                        "create": Array [
                          Object {
                            "conceptMapId": null,
                            "script": null,
                            "sqlValue": Object {
                              "create": Object {
                                "column": "hadm_id",
                                "joins": Object {
                                  "create": Array [
                                    Object {
                                      "tables": Object {
                                        "create": Array [
                                          Object {
                                            "column": "subject_id",
                                            "owner": Object {
                                              "connect": Object {
                                                "Owner_name_credential_unique_constraint": Object {
                                                  "credentialId": "456",
                                                  "name": "mimiciii",
                                                },
                                              },
                                            },
                                            "table": "admissions",
                                          },
                                          Object {
                                            "column": "subject_id",
                                            "owner": Object {
                                              "connect": Object {
                                                "Owner_name_credential_unique_constraint": Object {
                                                  "credentialId": "456",
                                                  "name": "mimiciii",
                                                },
                                              },
                                            },
                                            "table": "patients",
                                          },
                                        ],
                                      },
                                    },
                                  ],
                                },
                                "owner": Object {
                                  "connect": Object {
                                    "Owner_name_credential_unique_constraint": Object {
                                      "credentialId": "456",
                                      "name": "mimiciii",
                                    },
                                  },
                                },
                                "table": "admissions",
                              },
                            },
                            "staticValue": null,
                          },
                        ],
                      },
                      "mergingScript": null,
                    },
                  ],
                },
                "path": "identifier[0].value",
                "sliceName": null,
              },
              Object {
                "definitionId": "Identifier",
                "path": "identifier[0]",
                "sliceName": null,
              },
            ],
          },
          "definitionId": "Patient",
          "filters": Object {
            "create": Array [
              Object {
                "relation": "=",
                "sqlColumn": Object {
                  "create": Object {
                    "column": "subject_id",
                    "owner": Object {
                      "connect": Object {
                        "Owner_name_credential_unique_constraint": Object {
                          "credentialId": "456",
                          "name": "mimiciii",
                        },
                      },
                    },
                    "table": "patients",
                  },
                },
                "value": "10059",
              },
            ],
          },
          "label": "feat_2_joins that fill lists of attributes patient.identifier",
          "logicalReference": "33684f2e-bb84-4863-baea-7f1f199e0dd4",
          "primaryKeyColumn": "row_id",
          "primaryKeyOwner": Object {
            "connect": Object {
              "Owner_name_credential_unique_constraint": Object {
                "credentialId": "456",
                "name": "mimiciii",
              },
            },
          },
          "primaryKeyTable": "patients",
          "source": Object {
            "connect": Object {
              "id": "01234567",
            },
          },
        },
      }
    `)
  })
})

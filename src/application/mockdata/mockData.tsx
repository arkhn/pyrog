import * as React from "react";
import {Classes, Icon, ITreeNode, Position, Tooltip, Tree} from "@blueprintjs/core";

import {
    IFhirResource,
    IDatabase,
} from '../types'

export const inputDatabases : IDatabase[] = [
    {
        name: 'CW',
        schema: {
            'ISCF': {
                'PATIENT': {
                    'NOPAT': null,
                    'PREPAT': null
                }
            },
            'SYSTEM': {
                'TABLE1': {
                    'COL1': null,
                    'COL2': null
                }
            }
        }
    },
    {
        name: 'DC',
        schema: {
            'OWNER1': {
                'TABLE1': {
                    'COL1': null,
                    'COL2': null
                }
            }
        }
    },
    {
        name: 'ORB',
        schema: {
            'OWNER1': {
                'TABLE1': {
                    'COL1': null,
                    'COL2': null
                }
            }
        }
    }
]

export const fhirResources : IFhirResource[] = [
    {
        resourceType: 'Patient',
        owner: 'ISCF',
        table: 'PATIENT',
        primaryKey: 'NOPAT',
        contentAsTree: [
            {
                id: 1,
                isExpanded: true,
                label: 'Name',
                childNodes: [
                    {
                        id: 3,
                        label: "First Name",
                        secondaryLabel: (
                            <Tooltip content="Mapped">
                                <Icon icon="tick" />
                            </Tooltip>
                        ),
                    },
                    {
                        id: 4,
                        label: "Last Name",
                        secondaryLabel: (
                            <Tooltip content="Mapped & Joined">
                                <Icon icon="endorsed" />
                            </Tooltip>
                        ),
                    }
                ],
            },
            {
                id: 0,
                hasCaret: false,
                label: "Gender",
            }
        ],
        inputColumnsDict: {
            'Name.First Name': [
                {owner: 'ISCF', table: 'PATIENT', column: 'PREPAT'},
                {owner: 'ISCF', table: 'PATIENT', column: 'XXXPAT'},
            ],
            'Name.Last Name': [
                {owner: 'ISCF', table: 'PATIENT', column: 'FAMPAT'},
            ]
        }
    },
    {
        resourceType: 'Practitioner',
        owner: null,
        table: null,
        primaryKey: null,
        contentAsTree: [
            {
                id: 0,
                hasCaret: true,
                label: "Name",
            }
        ]
    },
    {
        resourceType: 'Medication',
        owner: null,
        table: null,
        primaryKey: null,
        contentAsTree: [
            {
                id: 0,
                hasCaret: true,
                label: "Whatever",
            }
        ]
    },
]

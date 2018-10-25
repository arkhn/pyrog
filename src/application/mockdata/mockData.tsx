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
        content: [
            {
                id: 1,
                icon: "id-number",
                isExpanded: true,
                label: (
                    <Tooltip content="I'm a folder <3" position={Position.RIGHT}>
                        Name
                    </Tooltip>
                ),
                childNodes: [
                    {
                        id: 3,
                        icon: "tag",
                        label: "First Name",
                        secondaryLabel: (
                            <Tooltip content="Mapped">
                                <Icon icon="tick" />
                            </Tooltip>
                        ),
                    },
                    {
                        id: 4,
                        icon: "tag",
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
                icon: "id-number",
                label: "Gender",
            }
        ]
    },
    {
        resourceType: 'Practitioner',
        owner: null,
        table: null,
        primaryKey: null,
        content: [
            {
                id: 0,
                hasCaret: true,
                icon: "id-number",
                label: "Name",
            }
        ]
    },
    {
        resourceType: 'Medication',
        owner: null,
        table: null,
        primaryKey: null,
        content: [
            {
                id: 0,
                hasCaret: true,
                icon: "info-sign",
                label: "Whatever",
            }
        ]
    },
]

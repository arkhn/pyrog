import * as React from "react";
import {Classes, Icon, ITreeNode, Position, Tooltip, Tree} from "@blueprintjs/core";

import {
    IFhirResource,
    IDatabase,
} from '../types'

export const inputDatabases : IDatabase[] = [
    {name: 'CW'},
    {name: 'DC'}
]

export const fhirResources : IFhirResource[] = [
    {
        resourceType: 'Patient',
        owner: null,
        table: null,
        primaryKey: null,
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

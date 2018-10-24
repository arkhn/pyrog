import * as React from "react";
import {Classes, Icon, ITreeNode, Position, Tooltip, Tree} from "@blueprintjs/core";

import {IFhirResource} from './types'

export const FhirResources : IFhirResource[] = [
    {
        name: 'Patient',
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
                            <Tooltip content="An eye!">
                                <Icon icon="eye-open" />
                            </Tooltip>
                        ),
                    },
                    {
                        id: 4,
                        icon: "tag",
                        label: "Last Name",
                    }
                ],
            }
        ]
    },
    {
        name: 'Practitioner',
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
        name: 'Medication',
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

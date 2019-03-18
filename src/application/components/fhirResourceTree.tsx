import {
    Button
    Classes,
    Icon,
    InputGroup
    ITreeNode,
    Position,
    Tooltip,
    Tree
} from '@blueprintjs/core'
import {
    Mutation,
} from 'react-apollo'
import * as React from 'react'

import {isNullOrUndefined} from 'util';

const createAttributeProfileInAttribute = require('./graphql/mutations/createAttributeProfileInAttribute.graphql')
const deleteAttribute = require('./graphql/mutations/deleteAttribute.graphql')


interface INodeData {
    comment: string,
    id: string,
    isProfile: boolean,
    name: string,
    path: string[],
    type: string,
}

export interface IProps {
    json: any,
    onClickCallback: any,
    selectedNodeId: string,
}

export interface IState {
    isBroken: boolean,
    nodes: ITreeNode<INodeData>[],
    renderJson: string,
    selectedNode: ITreeNode<INodeData>,
}

export default class FhirResourceTree extends React.Component<IProps, IState> {
    static id: number = 0;

    constructor(props: IProps) {
        super(props);
        this.state = {
            isBroken: false,
            nodes: [],
            renderJson: "",
            selectedNode: null,
        }
    }

    static getId = (): number => {
        FhirResourceTree.id++;
        return FhirResourceTree.id;
    }

    private static breadFirstSearchInputColumn = (node: any) => {
        if (node.inputColumns && node.inputColumns.length > 0) {
            return true
        } else if (node.attributes && node.attributes.length > 0) {
            return node.attributes.some((attribute: any) => {
                return FhirResourceTree.breadFirstSearchInputColumn(attribute)
            })
        } else {
            return false
        }
    }

    private static genObjNodes = (node: any, pathAcc: string[]): ITreeNode<INodeData> => {

        if (node.isProfileButton) {

            let newProfileName = "new_attribute"
            const nodeLabel = <div>
                <InputGroup
                    id="static-value-input"
                    onChange={(event: React.FormEvent<HTMLElement>) => {
                        const target = event.target as HTMLInputElement

                        let newProfileName = target.value
                    }}
                    placeholder="Profile name"
                    {/* value={newProfileName} */}
                />
                <Mutation
                    mutation={createAttributeProfileInAttribute}
                >
                    {(createAttributeProfile, { data, loading }) => {
                        return <Button
                            icon={'add'}
                            loading={loading}
                            onClick={() => {
                                createAttributeProfile({
                                    variables: {
                                        parent_attribute_id: node.ParentId,
                                        child_attribute_name: "prout",
                                        child_attribute_type: node.newProfileType
                                    }
                                })
                            }}
                        />
                    }}
                </Mutation>
            </div>

            return {
                childNodes: null,
                hasCaret: false,
                icon: null,
                id: null,
                isExpanded: false,
                isSelected: false,
                label: nodeLabel,
                nodeData: {
                    comment: null,
                    id: null,
                    isProfile: null,
                    name: null,
                    path: null,
                    type: null,
                },
                secondaryLabel: null,
            }
        } else {

            const hasChildren = (node.attributes && node.attributes.length > 0)
            const hasInputColumns = (node.inputColumns && node.inputColumns.length > 0)
            const nodePath = [...pathAcc, node.id]

            const secondaryLabel = hasInputColumns ?
                <Icon icon='small-tick' intent={'success'}/> :
                (
                    hasChildren ?
                        (
                            FhirResourceTree.breadFirstSearchInputColumn(node) ?
                                <Icon icon='dot' /> :
                                null
                        ) :
                        null
                )

            const nodeLabel = node.isProfile ?
                <div className={'node-label'}>
                    <div>{node.name}</div>
                    <div className={'node-type'}>{node.type}</div>
                    <Mutation
                        mutation={deleteAttribute}
                    >
                        {(deleteAttribute, { data, loading }) => {
                            return <Button
                                icon={'remove'}
                                loading={loading}
                                onClick={() => {
                                    deleteAttribute({
                                        variables: {
                                            attributeId: node.id,
                                        }
                                    })
                                }}
                            />
                        }}
                    </Mutation>
                </div> :

                <div className={'node-label'}>
                    <div>{node.name}</div>
                    <div className={'node-type'}>{node.type}</div>
                </div>

            // Implement button for profile addition if node type is "list::*"
            // Bugfix: there might be no 'node.attributes' if recursive query to server was not long enough
            if (node.type && node.type.startsWith("list::") && node.attributes) {
                // Don't add a second button if we already have one
                (node.attributes[node.attributes.length-1] && node.attributes[node.attributes.length-1].isProfileButton) ?
                    null :
                    node.attributes.push({
                        isProfileButton: true,
                        ParentId: node.id,
                        newProfileType: node.type.substring(6).startsWith("Reference") ?
                        // We want "Reference" instead of "Reference(Organisation)"
                            "Reference" :
                            node.type.substring(6)
                    })
            }
            // node.attattributes.push()

            return {
                childNodes: hasChildren ? node.attributes.map((attribute: any) => {
                    return FhirResourceTree.genObjNodes(attribute, nodePath)
                }) : null,
                hasCaret: hasChildren,
                icon: node.isProfile ? 'multi-select' : (hasChildren ? 'folder-open' : 'tag'),
                id: FhirResourceTree.getId(),
                isExpanded: false,
                isSelected: false,
                label: node.comment ?
                    <Tooltip content={node.comment}>{nodeLabel}</Tooltip> :
                    nodeLabel,
                nodeData: {
                    comment: node.comment,
                    id: node.id,
                    isProfile: node.isProfile,
                    name: node.name,
                    path: nodePath,
                    type: node.type,
                },
                secondaryLabel: secondaryLabel,
            }
        }
    }

    private static forEachNode(nodes: ITreeNode[], callback: (node: ITreeNode) => void) {
        if (nodes == null) {
            return;
        }

        for (const node of nodes) {
            callback(node);
            FhirResourceTree.forEachNode(node.childNodes, callback);
        }
    }

    static getDerivedStateFromProps(props: IProps, state: IState) {
        if (props.json !== state.renderJson) {
            try {
                let nodes = props.json.map((attribute: any) => {
                    return FhirResourceTree.genObjNodes(attribute, [])
                })

                const selectedNode = nodes.filter((node: ITreeNode<INodeData>) => {
                    return node.nodeData.id == props.selectedNodeId
                })[0]

                FhirResourceTree.forEachNode(nodes, (node: ITreeNode<INodeData>) => {
                    node.isSelected = node.nodeData.id == props.selectedNodeId
                    node.isExpanded = selectedNode ?
                        selectedNode.nodeData.path.indexOf(node.nodeData.id) != -1 :
                        false
                })

                return {
                    isBroken: false,
                    nodes: nodes,
                    renderJson: props.json,
                    selectedNode,
                }
            } catch(err) {
                console.log(err)
                return {
                    isBroken: true,
                    nodes: [],
                    renderJson: props.json,
                    selectedNode: null,
                }
            }
        } else {
            return state
        }
    }

    private handleNodeCollapse = (node: ITreeNode<INodeData>) => {
        node.isExpanded = false;
        this.setState(this.state);
    }

    private handleNodeExpand = (node: ITreeNode<INodeData>) => {
        node.isExpanded = true;
        this.setState(this.state);
    }

    private handleNodeClick = (node: ITreeNode<INodeData>, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
        // Can only select tree leaves
        if (!node.hasCaret) {
            const originallySelected = node.isSelected

            if (!e.shiftKey) {
                FhirResourceTree.forEachNode(this.state.nodes, (node: ITreeNode<INodeData>) => (node.isSelected = false));
            }

            node.isSelected = originallySelected == null ? true : !originallySelected;
            this.setState(this.state);

            this.props.onClickCallback(node.nodeData)
        } else {
            if (node.isExpanded) {
                this.handleNodeCollapse(node)
            } else {
                this.handleNodeExpand(node)
            }
        }
    }

    public render() {
        return (
            <Tree
                className={Classes.ELEVATION_0}
                contents={this.state.nodes}
                onNodeClick={this.handleNodeClick}
                onNodeCollapse={this.handleNodeCollapse}
                onNodeExpand={this.handleNodeExpand}
            />
        );
    }
}

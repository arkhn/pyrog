import {
    Button,
    Classes,
    ContextMenu,
    ContextMenuTarget,
    ControlGroup,
    Icon,
    InputGroup,
    ITreeNode,
    Menu,
    MenuDivider,
    MenuItem,
    Popover,
    Position,
    Tooltip,
    Tree,
} from '@blueprintjs/core'
import { ApolloClient } from "apollo-client";
import {
    Mutation,
    withApollo,
} from 'react-apollo'
import * as React from 'react'

import { isNullOrUndefined } from 'util'

const createAttributeProfileInAttribute = require('../../graphql/mutations/createAttributeProfileInAttribute.graphql')
const deleteAttribute = require('../../graphql/mutations/deleteAttribute.graphql')

interface INodeData {
    comment: string,
    id: string,
    isProfile: boolean,
    name: string,
    path: string[],
    type: string,
}

export interface IProps {
    addProfileCallback: any,
    client?: ApolloClient<any>,
    deleteProfileCallback: any,
    expandedAttributesIdList: string[],
    nodeCollapseCallback: any,
    nodeExpandCallback: any,
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

interface INodeLabelProps {
    createProfile: any,
    deleteAttribute: any,
    node: any,
}

interface INodeLabelState {
    isContextMenuOpen: boolean,
}

class NodeLabel extends React.PureComponent<INodeLabelProps, INodeLabelState> {
    public state = { isContextMenuOpen: false }

    public render() {
        return (
            <div className={'node-label'} onContextMenu={this.showContextMenu}>
                <div>{this.props.node.name}</div>
                <div className={'node-type'}>{this.props.node.type}</div>
            </div>
        )
    }

    private showContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()

        const { node } = this.props

        const menu = node.isProfile ?
            <Menu>
                <MenuItem icon={'edit'} text={'Renommer'} disabled />
                <MenuItem icon={'duplicate'} text={'Dupliquer'} disabled />
                <MenuDivider />
                <MenuItem
                    icon={'trash'}
                    intent={'danger'}
                    onClick={() => this.props.deleteAttribute(node)}
                    text={'Supprimer'}
                />
            </Menu> :
            (
                node.type && node.type.startsWith("list::") && node.attributes ?
                    <Menu>
                        <MenuItem
                            icon={'add'}
                            onClick={() => this.props.createProfile(node)}
                            text={'Ajouter un profil'}
                        />
                    </Menu> :
                    null
            )

        ContextMenu.show(
            menu,
            { left: e.clientX, top: e.clientY },
            () => this.setState({ isContextMenuOpen: false }),
        )

        this.setState({ isContextMenuOpen: true })
    }
}

class FhirResourceTree extends React.Component<IProps, IState> {
    static id: number = 0;

    constructor(props: IProps) {
        super(props)
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
        const genObjNodes = (node: any, pathAcc: string[]): ITreeNode<INodeData> => {
            const nodeLabel = (
                <NodeLabel
                    createProfile={(node: any) => {
                        // One puts "Reference" instead of "Reference(Organisation)"
                        const type = (node.type && node.type.substring(6).startsWith("Reference")) ?
                            "Reference" :
                            node.type.substring(6)

                        props.client.mutate({
                            mutation: createAttributeProfileInAttribute,
                            variables: {
                                parentAttributeId: node.id,
                                attributeName: `${type}_${node.attributes.length}`,
                                attributeType: type,
                            }
                        })
                        .then((response: any) => {
                            props.addProfileCallback(response)
                        })
                        .catch((error: any) => {
                            console.log(error)
                        })
                    }}
                    deleteAttribute={(node: any) => {
                        props.client.mutate({
                            mutation: deleteAttribute,
                            variables: {
                                attributeId: node.id,
                            }
                        })
                        .then((response: any) => {
                            props.deleteProfileCallback(response)
                        })
                        .catch((error: any) => {
                            console.log(error)
                        })
                    }}
                    node={node}
                />
            )

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
            return {
                childNodes: hasChildren ? node.attributes.map((attribute: any) => {
                    return genObjNodes(attribute, nodePath)
                }) : null,
                hasCaret: hasChildren,
                icon: node.isProfile ? 'multi-select' : (hasChildren ? 'folder-open' : 'tag'),
                id: FhirResourceTree.getId(),
                isExpanded: false,
                isSelected: false,
                label: node.comment ?
                    <Tooltip
                        boundary={'viewport'}
                        content={node.comment}
                    >
                        {nodeLabel}
                    </Tooltip> :
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

        if (props.json !== state.renderJson) {
            try {
                let nodes = props.json.map((attribute: any) => {
                    return genObjNodes(attribute, [])
                })

                const selectedNode = nodes.filter((node: ITreeNode<INodeData>) => {
                    return node.nodeData.id == props.selectedNodeId
                })[0]

                FhirResourceTree.forEachNode(nodes, (node: ITreeNode<INodeData>) => {
                    node.isSelected = node.nodeData.id == props.selectedNodeId
                    node.isExpanded = selectedNode ?
                        selectedNode.nodeData.path.indexOf(node.nodeData.id) != -1 :
                        props.expandedAttributesIdList.indexOf(node.nodeData.id) >= 0
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
        node.isExpanded = false
        this.setState(this.state)
        this.props.nodeCollapseCallback(node)
    }

    private handleNodeExpand = (node: ITreeNode<INodeData>) => {
        node.isExpanded = true
        this.setState(this.state)
        this.props.nodeExpandCallback(node)
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

export default withApollo(FhirResourceTree as any) as any

import {
    Classes,
    Icon,
    ITreeNode,
    Position,
    Tooltip,
    Tree
} from '@blueprintjs/core'
import * as React from 'react'

import {isNullOrUndefined} from 'util';

interface INodeData {
    name: string,
    path: string[],
}

export interface IProps {
    json: any,
    onClickCallback: any,
    selectedNode: string[],
}

export interface IState {
    nodes: ITreeNode<INodeData>[],
    renderJson: string,
    isBroken: boolean,
}

export default class FhirResourceTree extends React.Component<IProps, IState> {
    static id: number = 0;

    constructor(props: IProps) {
        super(props);
        this.state = {
            nodes: [],
            renderJson: "",
            isBroken: false,
        }
    }

    static getId = (): number => {
        FhirResourceTree.id++;
        return FhirResourceTree.id;
    }

    private static genObjNodes = (json: any, pathAcc: string[]): ITreeNode<INodeData> => {
        const hasChildren = json.attributes && json.attributes.length > 0 ? true : false

        // const regex = /(.*)<(.*)>/
        // const regexResult = regex.exec(key)
        // // Compute if current node's fhir type is 'list'
        // const nodeIsTypeList = (regexResult && regexResult.length > 1) ? regexResult[2].startsWith('list') && json[key] && json[key].length > 0 : false

        const nodePath = [...pathAcc, json.name]

        return {
            childNodes: hasChildren ? json.attributes.map((attribute: any) => {
                return FhirResourceTree.genObjNodes(attribute, nodePath)
            }) : null,
            hasCaret: hasChildren,
            icon: hasChildren ? 'folder-open' : 'tag',
            id: FhirResourceTree.getId(),
            isExpanded: false,
            isSelected: false,
            label: <div>
                <div>{json.name}</div>
                <div>Type</div>
            </div>,
            nodeData: {
                name: json.name,
                path: nodePath,
            },
            secondaryLabel: (json.inputColumns && json.inputColumns.length > 0) ?
                <Icon icon={'dot'} intent={'success'}/> :
                null,
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
                let nodes = props.json.attributes.map((attribute: any) => {
                    return FhirResourceTree.genObjNodes(attribute, [])
                })

                console.log(nodes)

                FhirResourceTree.forEachNode(nodes, (node: ITreeNode<INodeData>) => {
                    node.isSelected = node.nodeData.path == props.selectedNode
                    node.isExpanded = props.selectedNode ?
                        props.selectedNode.join('.').startsWith(node.nodeData.path.join('.')) :
                        false
                })

                return {
                    nodes: nodes,
                    renderJson: props.json,
                    isBroken: false,
                }
            } catch(err) {
                console.log(err)
                return {
                    nodes: [],
                    renderJson: props.json,
                    isBroken: true,
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

            this.props.onClickCallback(node.nodeData.path)
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
                contents={this.state.nodes}
                onNodeClick={this.handleNodeClick}
                onNodeCollapse={this.handleNodeCollapse}
                onNodeExpand={this.handleNodeExpand}
                className={Classes.ELEVATION_0}
            />
        );
    }
}

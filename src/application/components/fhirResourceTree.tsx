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

import {changeCurrentFhirAttribute} from '../actions/currentFhirAttribute'

interface nodeData {
    name: string,
}

export interface IProps {
    json: any,
}

export interface IState {
    nodes: ITreeNode<nodeData>[],
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

    private static genObjNodes = (json: any): ITreeNode<nodeData>[] => {
        return Object.keys(json).map((key: string) : ITreeNode<nodeData> => {
            const hasChildren = !isNullOrUndefined(json[key]) && (json[key] instanceof Array || json[key] instanceof Object)

            const regex = /(.*)<(.*)>/
            const regexResult = regex.exec(key)
            // Compute if current node's fhir type is 'list'
            const nodeIsTypeList = (regexResult && regexResult.length > 1) ? regexResult[2].startsWith('list') && json[key] && json[key].length > 0 : false

            return {
                childNodes: hasChildren ? FhirResourceTree.genObjNodes(nodeIsTypeList ? json[key][0] : json[key]) : null,
                hasCaret: hasChildren,
                icon: hasChildren ? 'folder-open' : 'tag',
                id: FhirResourceTree.getId(),
                isExpanded: false,
                isSelected: false,
                label: <div>
                    <div>{regexResult ? regexResult[1] : key}</div>
                    <div>{regexResult ? regexResult[2] : ''}</div>
                </div>,
                nodeData: {
                    name: key,
                },
            }
        })
    }

    static getDerivedStateFromProps(props: IProps, state: IState) {
        if (props.json !== state.renderJson) {
            try {
                const nodes = FhirResourceTree.genObjNodes(props.json)

                return {
                    nodes: nodes,
                    renderJson: props.json,
                    isBroken: false,
                }
            } catch(err) {
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

    private handleNodeClick = (nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
        // Can only select tree leaves
        if (!nodeData.hasCaret) {
            const originallySelected = nodeData.isSelected

            if (!e.shiftKey) {
                this.forEachNode(this.state.nodes, n => (n.isSelected = false));
            }

            nodeData.isSelected = originallySelected == null ? true : !originallySelected;
            this.setState(this.state);

            // Building string path to clicked node.
            let nodePath : string[] = []
            let currentNodes : ITreeNode<nodeData>[] = this.state.nodes

            for (var key of _nodePath) {
                nodePath.push(currentNodes[key].nodeData.name as string)
                currentNodes = currentNodes[key].childNodes
            }

            // this.props.dispatch(changeCurrentFhirAttribute(originallySelected, nodePath))
        }
    };

    private handleNodeCollapse = (nodeData: ITreeNode) => {
        nodeData.isExpanded = false;
        this.setState(this.state);
    };

    private handleNodeExpand = (nodeData: ITreeNode) => {
        nodeData.isExpanded = true;
        this.setState(this.state);
    };

    private forEachNode(nodes: ITreeNode[], callback: (node: ITreeNode) => void) {
        if (nodes == null) {
            return;
        }

        for (const node of nodes) {
            callback(node);
            this.forEachNode(node.childNodes, callback);
        }
    }
}

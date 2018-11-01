import * as React from "react";
import {
    Classes,
    Icon,
    ITreeNode,
    Position,
    Tooltip,
    Tree
} from "@blueprintjs/core";
import {isNullOrUndefined} from 'util';

import {changeCurrentFhirAttribute} from '../actions/currentFhirAttribute'

interface nodeData {
    name: string,
}

export interface IFhirResourceTreeProps {
    json: any,
    dispatch: any,
}

export interface IFhirResourceTreeState {
    nodes: ITreeNode<nodeData>[],
    renderJson: string,
    isBroken: boolean,
}

export default class FhirResourceTree extends React.Component<IFhirResourceTreeProps, IFhirResourceTreeState> {
    static id: number = 0;

    constructor(props: IFhirResourceTreeProps) {
        super(props);
        this.state = {
            nodes: [],
            renderJson: "",
            isBroken: false,
        }
    }

    static getId(): number {
        this.id++;
        return this.id;
    }

    private static genNode(_key: string, _obj: any): ITreeNode {
        const hasChildren = !isNullOrUndefined(_obj) && (_obj instanceof Array || _obj instanceof Object);

        const regex = /(.*)<(.*)>/
        const regexResult = regex.exec(_key)

        const result : ITreeNode<nodeData> = {
            id: this.getId(),
            hasCaret: hasChildren,
            icon: hasChildren ? "folder-open" : "tag",
            isExpanded: false,
            nodeData: {
                name: regexResult ? regexResult[1] : _key,
            },
            label: <div>
                <div>{regexResult ? regexResult[1] : _key}</div>
                <div>{regexResult ? regexResult[2] : ''}</div>
            </div>,
            isSelected: false,
        }

        if (hasChildren) {
            return Object.assign(result, {childNodes: FhirResourceTree.genNodes(_obj)})
        }

        return result;
    }

    private static genNodes(_obj: any): ITreeNode[] {
        let returnList = [];

        for (let key of Object.keys(_obj)) {
            returnList.push(FhirResourceTree.genNode(key, _obj[key]));
        }

        return returnList;
    }

    private static genObjNodes(json: any): ITreeNode[] {
        let returnList = [];

        for (let key of Object.keys(json))
        {
            returnList.push(this.genNode(key, json[key]));
        }

        return returnList;
    }

    static getDerivedStateFromProps(props: IFhirResourceTreeProps, state: IFhirResourceTreeState) {
        if(props.json !== state.renderJson) {
            try {
                const nodes = FhirResourceTree.genObjNodes(props.json);

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
            const originallySelected = nodeData.isSelected;

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

            this.props.dispatch(changeCurrentFhirAttribute(originallySelected, nodePath))
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

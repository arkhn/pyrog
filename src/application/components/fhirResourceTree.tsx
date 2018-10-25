import * as React from "react";
import {Classes, Icon, ITreeNode, Position, Tooltip, Tree} from "@blueprintjs/core";

import {changeCurrentTreeNode} from '../actions'

export interface ITreeExampleProps {
    nodes: ITreeNode[];
    dispatch: any;
}

export interface ITreeExampleState {
    nodes: ITreeNode[];
}

export default class FhirResourceTree extends React.Component<ITreeExampleProps, ITreeExampleState> {
    public state: ITreeExampleState = {
        nodes: this.props.nodes
    };

    static getDerivedStateFromProps(props: ITreeExampleProps, state:ITreeExampleState) {
        return {
            nodes: props.nodes
        };
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
        const originallySelected = nodeData.isSelected;
        if (!e.shiftKey) {
            this.forEachNode(this.state.nodes, n => (n.isSelected = false));
        }
        nodeData.isSelected = originallySelected == null ? true : !originallySelected;
        this.setState(this.state);

        // Building string path to clicked node.
        let nodePath : string[] = []
        let currentNodes : ITreeNode[] = this.props.nodes

        for (var key of _nodePath) {
            nodePath.push(currentNodes[key].label as string)
            currentNodes = currentNodes[key].childNodes
        }

        this.props.dispatch(changeCurrentTreeNode(nodePath))
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

import * as JSONPretty from 'react-json-pretty';
import * as React from 'react';
import { array, object } from 'prop-types';
import {
    Button,
    ITreeNode,
    NonIdealState,
    Tab,
    TabId,
    Tabs,
    Tree
    } from '@blueprintjs/core';
import { isNullOrUndefined } from 'util';
// import 'react-json-pretty/src/JSONPretty.monikai.css';


export interface IJsonViewerProps {
    json: string;
}

export interface IJsonViewerState {
    nodes: ITreeNode[];
    renderJson: string;
    isBroken: boolean;
    navbarTabId: TabId
}

export default class JsonViewer extends React.Component<IJsonViewerProps, IJsonViewerState> {
    static id: number = 0;

    constructor(props: IJsonViewerProps) {
        super(props);
        this.state = {nodes:[], renderJson: "", isBroken: false, navbarTabId: "treeview"}
    }

    private static genObjNodes(json: string): ITreeNode[] {
        const obj = JSON.parse(json);
        console.log(obj);
        let returnList = [];
        for (let key of Object.keys(obj))
        {
            returnList.push(this.genNode(key, obj[key]));
        }

        return returnList;
    }

    static getId(): number {
        this.id++;
        return this.id;
    }

    static genNode(_key: string, _obj: any): ITreeNode {
        const hasChildren = !isNullOrUndefined(_obj) && (_obj instanceof Array || _obj instanceof Object);
        const result = {
            id: this.getId(),
            hasCaret: hasChildren,
            icon: hasChildren ? "folder-open" : "new-object",
            isExpanded: hasChildren,
            label: hasChildren ? _key : `${_key} : ${_obj}`,
        } as ITreeNode

        if (hasChildren){
            return Object.assign(result,{childNodes: this.genNodes(_obj)})
        }
        return result;
    }

    private static genNodes(_obj: any): ITreeNode[] {
        let returnList = [];
        for (let key of Object.keys(_obj))
        {
            returnList.push(this.genNode(key, _obj[key]));
        }

        return returnList;
    }

    public componentDidUpdate(prevProps: IJsonViewerProps) {
        if(this.props.json !== this.state.renderJson){
            try{
                const nodes = JsonViewer.genObjNodes(this.props.json);
                this.setState({ nodes: nodes, renderJson:this.props.json, isBroken: false }) ;
            }
            catch(err){
                this.setState({ nodes:[], renderJson:this.props.json, isBroken: true }) ;
            }
        }
    }

    public render() {
        return this.state.isBroken?
            <NonIdealState icon="error" title="Invalid json"/> :
            <Tabs id="TabsExample" onChange={this.handleTabChange} selectedTabId={this.state.navbarTabId}>
                <Tab id="treeview" title="Tree View" panel={
                    <Tree className="jsonView" contents={this.state.nodes}
                        onNodeCollapse={this.handleNodeCollapse}
                        onNodeExpand={this.handleNodeExpand} />} />
                <Tab id="stringview" title="Plain View" panel={ <JSONPretty id="json-pretty" json={this.state.renderJson} />} />
                <Tabs.Expander />
                <Button />
                <Button />
            </Tabs>
    }

    private handleTabChange = (navbarTabId: TabId) => this.setState({ navbarTabId });

    private handleNodeCollapse = (nodeData: ITreeNode) => {
        nodeData.isExpanded = false;
        this.setState(this.state);
    };

    private handleNodeExpand = (nodeData: ITreeNode) => {
        nodeData.isExpanded = true;
        this.setState(this.state);
    };
}

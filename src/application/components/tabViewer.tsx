import * as React from "react";
import {Icon, Tabs, Tab, TabId} from "@blueprintjs/core";

import TextSearchInputs from './textSearchInputs'
import ClusterSearchInputs from './clusterSearchInputs'
import ColumnViewer from './columnViewer'

export interface ITabViewProps {
    dispatch: any;
}

export interface ITabViewState {
    navbarTabId: TabId;
}

export default class TabViewer extends React.Component<ITabViewProps, ITabViewState> {
    public state: ITabViewState = {
        navbarTabId: 'text'
    };

    private handleNavbarTabChange = (navbarTabId: TabId) => this.setState({ navbarTabId });

    public render() {
        let {dispatch} = this.props
        let {navbarTabId} = this.state

        const clusterTabTitle = <div className={'tab-title'}>
            <Icon icon={'layout'} />
            <span>Explore Clusters</span>
        </div>

        const clusterTab = <div className={'vertical-flex'}>
            <ClusterSearchInputs dispatch={dispatch} />
            <ColumnViewer dispatch={dispatch} />
        </div>

        const textTabTitle = <div className={'tab-title'}>
            <Icon icon={'paragraph'} />
            <span>Search by Text</span>
        </div>

        const textTab = <div className={'vertical-flex'}>
            <TextSearchInputs dispatch={dispatch} />
            <ColumnViewer dispatch={dispatch} />
        </div>

        return (
            <Tabs
                selectedTabId={navbarTabId} onChange={this.handleNavbarTabChange}
            >
                <Tab id="text" title={textTabTitle} panel={textTab} />
                <Tab id="clustering" title={clusterTabTitle} panel={clusterTab} />
            </Tabs>
        );
    }
}

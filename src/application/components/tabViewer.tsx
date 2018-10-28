import * as React from "react";
import {Tabs, Tab, TabId} from "@blueprintjs/core";

import TextSearchInputs from './textSearchInputs'

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

        let firstTab = <div className={'within-tab'}>
            <h2>First tab</h2>
        </div>

        let secondTab = <TextSearchInputs dispatch={dispatch} />

        return (
            <Tabs
                selectedTabId={navbarTabId} onChange={this.handleNavbarTabChange}
            >
                <Tab id="clustering" title="Clustering" panel={firstTab} />
                <Tab id="text" title="Text" panel={secondTab} />
            </Tabs>
        );
    }
}

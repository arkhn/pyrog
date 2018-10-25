import * as React from "react";
import {Tabs, Tab, TabId} from "@blueprintjs/core";

export interface ITabViewProps {
    dispatch: any;
}

export interface ITabViewState {
    navbarTabId: TabId;
}

export default class TabViewer extends React.Component<ITabViewProps, ITabViewState> {
    public state: ITabViewState = {
        navbarTabId: 'clustering'
    };

    private handleNavbarTabChange = (navbarTabId: TabId) => this.setState({ navbarTabId });

    public render() {
        let {navbarTabId} = this.state
        let firstTab = <div className={'within-tab'}>
            <h2>First tab</h2>
        </div>

        let secondTab = <div className={'within-tab'}>
            <h2>Second tab</h2>
        </div>
        return (
            <Tabs selectedTabId={navbarTabId} onChange={this.handleNavbarTabChange}>
                <Tab id="clustering" title="Clustering" panel={firstTab} />
                <Tab id="text" title="Text" panel={secondTab} />
            </Tabs>
        );
    }
}

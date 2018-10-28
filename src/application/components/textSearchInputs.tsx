import * as React from "react";
import {ControlGroup, InputGroup, Switch} from '@blueprintjs/core';

export interface ITabViewProps {
    dispatch: any;
}

export interface ITabViewState {
    filterValue: string;
    searchByEmbedding: boolean;
}

export default class TextSearchInputs extends React.Component<ITabViewProps, ITabViewState> {
    public state: ITabViewState = {
        filterValue: '',
        searchByEmbedding: false
    };

    private handleSearchChange (event: any) {
        this.setState({
            filterValue: event.target.value
        })
    }

    private handleSwitchChange (event: any) {
        this.setState({
            searchByEmbedding: event.target.checked
        })
    }

    public render() {
        let {filterValue, searchByEmbedding} = this.state;

        return (
            <div id={'text-tab-search-group'}>
                <div id={'text-input'}>
                    <InputGroup
                        leftIcon="search"
                        onChange={this.handleSearchChange.bind(this)}
                        placeholder="Text example..."
                        value={filterValue}
                    />
                </div>
                <div id={'switch'}>
                    <Switch
                        checked={this.state.searchByEmbedding}
                        label="Search by Embedding"
                        onChange={this.handleSwitchChange.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

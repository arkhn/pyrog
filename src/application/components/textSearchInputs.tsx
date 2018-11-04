import * as React from "react";
import {ControlGroup, InputGroup, Switch} from '@blueprintjs/core';

import StringSelect from './selects/stringSelect'
import {ownerList, tableList} from '../mockdata/database'

export interface ITextSearchInputsProps {
    dispatch: any;
}

export interface ITextSearchInputsState {
    filterValue: string;
    searchByEmbedding: boolean;
}

export default class TextSearchInputs extends React.Component<ITextSearchInputsProps, ITextSearchInputsState> {
    public state: ITextSearchInputsState = {
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
        let {dispatch} = this.props
        let {filterValue, searchByEmbedding} = this.state;

        return (
            <div id={'text-tab-search-group'}>
                <div className={'row'}>
                    <StringSelect
                        inputItem={''}
                        items={ownerList}
                        icon={'group-objects'}
                        onChange={null}
                        dispatch={dispatch}
                    />
                    <StringSelect
                        inputItem={''}
                        items={tableList}
                        icon={'th'}
                        onChange={null}
                        dispatch={dispatch}
                    />
                    <div id={'switch'}>
                        <Switch
                            checked={this.state.searchByEmbedding}
                            label="Search by Embedding"
                            onChange={this.handleSwitchChange.bind(this)}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div id={'text-input'}>
                        <InputGroup
                            leftIcon="search"
                            onChange={this.handleSearchChange.bind(this)}
                            placeholder="Text example..."
                            value={filterValue}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

import * as React from "react";
import {ControlGroup, InputGroup, Switch} from '@blueprintjs/core';

import StringSelect from './selects/stringSelect'
import {ownerList, tableList} from '../mockdata/database'

export interface IProps {

}

export interface IState {
    filterValue: string;
    searchByEmbedding: boolean;
}

export default class TextSearchInputs extends React.Component<IProps, IState> {
    public state: IState = {
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
                <div className={'row'}>
                    <StringSelect
                        icon={'group-objects'}
                        inputItem={''}
                        items={ownerList}
                        onChange={null}
                    />
                    <StringSelect
                        icon={'th'}
                        inputItem={''}
                        items={tableList}
                        onChange={null}
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

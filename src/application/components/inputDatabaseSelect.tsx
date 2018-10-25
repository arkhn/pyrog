import * as React from 'react'
import {Button, MenuItem} from "@blueprintjs/core";
import {Select, ItemPredicate, ItemRenderer} from "@blueprintjs/select";

import {changeCurrentInputDatabase} from '../actions'
import {IDatabase} from '../types'

// FhirResources typing and utils

const renderDatabase: ItemRenderer<IDatabase> = (resource, {handleClick, modifiers, query}) => {
    return (
        <MenuItem
            key={resource.name}
            onClick={handleClick}
            text={resource.name}
        />
    );
};

const filterByName: ItemPredicate<IDatabase> = (query, database) => {
    return `${database.name.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
};

// React object

const DatabaseSelect = Select.ofType<IDatabase>();

interface ISelectProps {
    items: IDatabase[];
    inputDatabase: IDatabase;
    dispatch: any;
};

interface ISelectState {

};

export default class InputDatabaseSelect extends React.Component<ISelectProps, ISelectState> {
    private handleValueChange = (database: IDatabase) => this.props.dispatch(changeCurrentInputDatabase(database))

    public render () {
        const {items, inputDatabase} = this.props;

        return (
            <div>
                <DatabaseSelect
                    items={items}
                    itemPredicate={filterByName}
                    itemRenderer={renderDatabase}
                    noResults={<MenuItem disabled={true} text="No results." />}
                    onItemSelect={this.handleValueChange}
                    popoverProps={{
                        targetClassName: 'main-select'
                    }}
                >
                    <Button
                        icon="database"
                        rightIcon="caret-down"
                        text={inputDatabase ? inputDatabase.name : "(No selection)"}
                    />
                </DatabaseSelect>
            </div>
        )
    }
}

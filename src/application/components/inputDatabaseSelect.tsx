import * as React from 'react'
import {Button, MenuItem} from "@blueprintjs/core";
import {Select, ItemPredicate, ItemRenderer} from "@blueprintjs/select";

import {changeCurrentInputDatabase} from '../actions'
import {IDatabase} from '../types'
import TSelect from './TSelect'

interface ISelectProps {
    items: IDatabase[];
    inputItem: IDatabase;
    dispatch: any;
};

export default class InputDatabaseSelect extends React.Component<ISelectProps, any> {
    private renderItem: ItemRenderer<IDatabase> = (resource, {handleClick, modifiers, query}) => {
        return (
            <MenuItem
                key={resource.name}
                onClick={handleClick}
                text={resource.name}
            />
        );
    };

    private filterByName: ItemPredicate<IDatabase> = (query, database) => {
        return `${database.name.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
    };

    private displayItem = function(resource: IDatabase): string {
        return (resource ? resource.name : "(No selection)");
    };

    public render () {
        const {items, inputItem, dispatch} = this.props;

        return (
            <div>
                <TSelect<IDatabase>
                    renderItem={this.renderItem}
                    filterItems={this.filterByName}
                    displayItem={this.displayItem}
                    inputItem={inputItem}
                    items={items}
                    dispatch={dispatch}
                    action={changeCurrentInputDatabase}
                />
            </div>
        )
    }
}

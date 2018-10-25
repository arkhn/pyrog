import * as React from 'react'
import {Button, MenuItem} from "@blueprintjs/core";
import {Select, ItemPredicate, ItemRenderer} from "@blueprintjs/select";
import {IconName} from '@blueprintjs/icons';

import {IDatabase} from '../../types'
import TSelect from './TSelect'

interface ISelectProps {
    items: IDatabase[];
    inputItem: IDatabase;
    icon: IconName;
    action: any;
    dispatch: any;
};

export default class InputDatabaseSelect extends React.Component<ISelectProps, any> {
    private renderItem: ItemRenderer<IDatabase> = (item, {handleClick, modifiers, query}) => {
        return (
            <MenuItem
                key={item.name}
                onClick={handleClick}
                text={item.name}
            />
        );
    };

    private filterByName: ItemPredicate<IDatabase> = (query, item) => {
        return `${item.name.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
    };

    private displayItem = function(item: IDatabase): string {
        return (item ? item.name : "(No selection)");
    };

    public render () {
        const {items, inputItem, icon, action, dispatch} = this.props;

        return (
            <div>
                <TSelect<IDatabase>
                    renderItem={this.renderItem}
                    filterItems={this.filterByName}
                    displayItem={this.displayItem}
                    inputItem={inputItem}
                    items={items}
                    icon={icon}
                    action={action}
                    dispatch={dispatch}
                />
            </div>
        )
    }
}

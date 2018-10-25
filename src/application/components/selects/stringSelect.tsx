import * as React from 'react'
import {Button, MenuItem} from "@blueprintjs/core";
import {Select, ItemPredicate, ItemRenderer} from "@blueprintjs/select";
import {IconName} from '@blueprintjs/icons';

import TSelect from './TSelect'

interface ISelectProps {
    items: string[];
    inputItem: string;
    icon: IconName;
    action: any;
    dispatch: any;
};

export default class InputDatabaseSelect extends React.Component<ISelectProps, any> {
    private renderItem: ItemRenderer<string> = (item, {handleClick, modifiers, query}) => {
        return (
            <MenuItem
                key={item}
                onClick={handleClick}
                text={item}
            />
        );
    };

    private filterByName: ItemPredicate<string> = (query, item) => {
        return `${item}`.indexOf(query.toLowerCase()) >= 0;
    };

    private displayItem = function(item: string): string {
        return (item ? item : "(No selection)");
    };

    public render () {
        const {items, inputItem, icon, action, dispatch} = this.props;

        return (
            <div>
                <TSelect<string>
                    renderItem={this.renderItem}
                    filterItems={this.filterByName}
                    displayItem={this.displayItem}
                    inputItem={inputItem}
                    items={items}
                    icon={icon}
                    dispatch={dispatch}
                    action={action}
                />
            </div>
        )
    }
}

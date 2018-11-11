import * as React from 'react'
import {Button, MenuItem, Intent} from "@blueprintjs/core";
import {Select, ItemPredicate, ItemRenderer} from "@blueprintjs/select";
import {IconName} from '@blueprintjs/icons';

import TSelect from './TSelect'

interface ISelectProps {
    items: string[];
    inputItem: string;
    icon: IconName;
    intent?: Intent;
    onChange: any;
    dispatch: any;
};

export default class StringSelect extends React.Component<ISelectProps, any> {
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
        return (item ? item : "None");
    };

    public render () {
        const {items, inputItem, icon, intent, onChange, dispatch} = this.props;

        return (
            <div>
                <TSelect<string>
                    renderItem={this.renderItem}
                    filterItems={this.filterByName}
                    displayItem={this.displayItem}
                    inputItem={inputItem}
                    items={items}
                    icon={icon}
                    intent={intent}
                    dispatch={dispatch}
                    onChange={onChange}
                />
            </div>
        )
    }
}

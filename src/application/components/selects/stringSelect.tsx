import * as React from 'react'
import {Button, MenuItem, Intent} from "@blueprintjs/core";
import {Select, ItemPredicate, ItemRenderer} from "@blueprintjs/select";
import {IconName} from '@blueprintjs/icons';

import TSelect from './TSelect'

interface ISelectProps {
    disabled?: boolean;
    icon: IconName;
    inputItem: string;
    intent?: Intent;
    items: string[];
    loading?: boolean;
    onChange: any;
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
        return `${item.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
    };

    private displayItem = function(item: string): string {
        return (item ? item : "None");
    };

    public render () {
        const {
            disabled,
            icon,
            inputItem,
            intent,
            items,
            loading,
            onChange,
        } = this.props;

        return (
            <div>
                <TSelect<string>
                    disabled={disabled}
                    displayItem={this.displayItem}
                    filterItems={this.filterByName}
                    loading={loading}
                    icon={icon}
                    inputItem={inputItem}
                    intent={intent}
                    items={items}
                    onChange={onChange}
                    renderItem={this.renderItem}
                />
            </div>
        )
    }
}

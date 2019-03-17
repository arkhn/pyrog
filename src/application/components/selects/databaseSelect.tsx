import * as React from 'react'
import {Button, MenuItem, Intent} from "@blueprintjs/core";
import {Select, ItemPredicate, ItemRenderer} from "@blueprintjs/select";
import {IconName} from '@blueprintjs/icons';

import TSelect from './TSelect'

interface IDatabase {
    id: string,
    name: string,
}

interface ISelectProps {
    disabled?: boolean;
    icon?: IconName;
    inputItem: IDatabase;
    intent?: Intent;
    items: IDatabase[];
    loading?: boolean;
    onChange: any;
}

export default class DatabaseSelect extends React.Component<ISelectProps, any> {
    private renderItem: ItemRenderer<IDatabase> = (resource: IDatabase, {handleClick, modifiers, query}) => {
        return (
            <MenuItem
                key={resource.id}
                onClick={handleClick}
                text={resource.name}
            />
        );
    };

    private filterByName: ItemPredicate<IDatabase> = (query, resource: IDatabase) => {
        return `${resource.name.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
    };

    private displayItem = function(resource: IDatabase): string {
        return (resource.name ? resource.name : "None");
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
                <TSelect<IDatabase>
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

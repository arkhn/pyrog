import * as React from 'react'
import {Button, MenuItem, Intent} from "@blueprintjs/core";
import {Select, ItemPredicate, ItemRenderer} from "@blueprintjs/select";
import {IconName} from '@blueprintjs/icons';

import TSelect from './TSelect'

interface ISource {
    id: string,
    name: string,
}

interface ISelectProps {
    disabled?: boolean;
    icon?: IconName;
    inputItem: ISource;
    intent?: Intent;
    items: ISource[];
    loading?: boolean;
    onChange: any;
}

export default class SourceSelect extends React.Component<ISelectProps, any> {
    private renderItem: ItemRenderer<ISource> = (resource: ISource, {handleClick, modifiers, query}) => {
        return (
            <MenuItem
                key={resource.id}
                onClick={handleClick}
                text={resource.name}
            />
        );
    };

    private filterByName: ItemPredicate<ISource> = (query, resource: ISource) => {
        return `${resource.name.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
    };

    private displayItem = function(resource: ISource): string {
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

        return <TSelect<ISource>
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
    }
}

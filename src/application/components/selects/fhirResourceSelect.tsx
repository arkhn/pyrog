import * as React from 'react'
import {Button, MenuItem} from "@blueprintjs/core";
import {Select, ItemPredicate, ItemRenderer} from "@blueprintjs/select";

import {IFhirResource} from '../../types'
import TSelect from './TSelect'

interface ISelectProps {
    items: IFhirResource[];
    inputItem: IFhirResource;
    action: any;
    dispatch: any;
};

export default class FhirResourceSelect extends React.Component<ISelectProps, any> {
    private renderItem: ItemRenderer<IFhirResource> = (item, {handleClick, modifiers, query}) => {
        return (
            <MenuItem
                key={item.resourceType}
                onClick={handleClick}
                text={item.resourceType}
            />
        );
    };

    private filterByName: ItemPredicate<IFhirResource> = (query, item) => {
        return `${item.resourceType.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
    };

    private displayItem = function(item: IFhirResource): string {
        return (item ? item.resourceType : "(No selection)");
    }

    public render () {
        const {items, inputItem, action, dispatch} = this.props;

        return (
            <div>
                <TSelect<IFhirResource>
                    renderItem={this.renderItem}
                    filterItems={this.filterByName}
                    displayItem={this.displayItem}
                    inputItem={inputItem}
                    items={items}
                    action={action}
                    dispatch={dispatch}
                />
            </div>
        )
    }
}

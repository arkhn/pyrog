import * as React from 'react'
import {Button, MenuItem} from "@blueprintjs/core";
import {Select, ItemPredicate, ItemRenderer} from "@blueprintjs/select";

import {changeCurrentFhirResource} from '../actions'
import {IFhirResource} from '../types'
import TSelect from './TSelect'

interface ISelectProps {
    items: IFhirResource[];
    inputItem: IFhirResource;
    dispatch: any;
};

export default class FhirResourceSelect extends React.Component<ISelectProps, any> {
    private renderItem: ItemRenderer<IFhirResource> = (resource, {handleClick, modifiers, query}) => {
        return (
            <MenuItem
                key={resource.resourceType}
                onClick={handleClick}
                text={resource.resourceType}
            />
        );
    };

    private filterByName: ItemPredicate<IFhirResource> = (query, resource) => {
        return `${resource.resourceType.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
    };

    private displayItem = function(resource: IFhirResource): string {
        return (resource ? resource.resourceType : "(No selection)");
    }

    public render () {
        const {items, inputItem, dispatch} = this.props;

        return (
            <div>
                <TSelect<IFhirResource>
                    renderItem={this.renderItem}
                    filterItems={this.filterByName}
                    displayItem={this.displayItem}
                    inputItem={inputItem}
                    items={items}
                    dispatch={dispatch}
                    action={changeCurrentFhirResource}
                />
            </div>
        )
    }
}

import * as React from 'react'
import {Button, MenuItem} from "@blueprintjs/core";
import {Select, ItemPredicate, ItemRenderer} from "@blueprintjs/select";

import {changeCurrentFhirResource} from '../actions'
import {IFhirResource} from '../types'

// FhirResources typing and utils

const renderResource: ItemRenderer<IFhirResource> = (resource, {handleClick, modifiers, query}) => {
    return (
        <MenuItem
            key={resource.resourceType}
            onClick={handleClick}
            text={resource.resourceType}
        />
    );
};

const filterByName: ItemPredicate<IFhirResource> = (query, resource) => {
    return `${resource.resourceType.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
};

// React object

const ResourceSelect = Select.ofType<IFhirResource>();

interface ISelectProps {
    items: IFhirResource[];
    resource: IFhirResource;
    dispatch: any;
};

interface ISelectState {

};

export default class FhirResourceSelect extends React.Component<ISelectProps, ISelectState> {
    private handleValueChange = (resource: IFhirResource) => this.props.dispatch(changeCurrentFhirResource(resource))

    public render () {
        const {items, resource} = this.props;

        return (
            <div>
                <ResourceSelect
                    items={items}
                    itemPredicate={filterByName}
                    itemRenderer={renderResource}
                    noResults={<MenuItem disabled={true} text="No results." />}
                    onItemSelect={this.handleValueChange}
                >
                    <Button
                        icon="diagram-tree"
                        rightIcon="caret-down"
                        text={resource ? resource.resourceType : "(No selection)"}
                    />
                </ResourceSelect>
            </div>
        )
    }
}

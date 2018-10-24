import * as React from 'react'
import {Button, MenuItem} from "@blueprintjs/core";
import {Select, ItemPredicate, ItemRenderer} from "@blueprintjs/select";

// FhirResources typing and utils

interface IFhirResource {
    name: string;
}

const FhirResources: IFhirResource[] = [
    {name: 'Patient'},
    {name: 'Practitionner'},
    {name: 'Medication'}
]

const renderResource: ItemRenderer<IFhirResource> = (resource, { handleClick, modifiers, query }) => {
    return (
        <MenuItem
            key={resource.name}
            onClick={handleClick}
            text={resource.name}
        />
    );
};

const filterByName: ItemPredicate<IFhirResource> = (query, resource) => {
    return `${resource.name.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
};

const fhirResourcesSelectProps = {
    itemPredicate: filterByName,
    itemRenderer: renderResource,
    items: FhirResources,
};

// React object

const ResourceSelect = Select.ofType<IFhirResource>();

export interface ISelectState {
    resource: IFhirResource;
};

export default class FhirResourceSelect extends React.Component<any, ISelectState> {
    public state: ISelectState = {
        resource: FhirResources[0],
    };

    private handleValueChange = (resource: IFhirResource) => this.setState({
        resource
    });

    render () {
        const {resource} = this.state;

        return (
            <div>
                <ResourceSelect
                    items={fhirResourcesSelectProps.items}
                    itemPredicate={fhirResourcesSelectProps.itemPredicate}
                    itemRenderer={fhirResourcesSelectProps.itemRenderer}
                    noResults={<MenuItem disabled={true} text="No results." />}
                    onItemSelect={this.handleValueChange}
                >
                    <Button
                        icon="diagram-tree"
                        rightIcon="caret-down"
                        text={resource ? resource.name : "(No selection)"}
                    />
                </ResourceSelect>
            </div>
        )
    }
}

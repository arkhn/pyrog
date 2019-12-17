import * as React from "react";
import { Intent, MenuItem, Position } from "@blueprintjs/core";
import {
  ItemPredicate,
  ItemRenderer,
} from "@blueprintjs/select";
import { IconName } from "@blueprintjs/icons";

import TSelect from "./TSelect";

interface IFhirResource {
  type: string;
  subtype: string;
  name: string;
}

interface ISelectProps {
  disabled?: boolean;
  icon?: IconName;
  inputItem: IFhirResource;
  intent?: Intent;
  items: IFhirResource[];
  loading?: boolean;
  onChange: any;
  popoverProps?: any;
}

export default class AddResourceSelect extends React.Component<
  ISelectProps,
  any
> {
  private renderItem: ItemRenderer<IFhirResource> = (
    resource: IFhirResource,
    { handleClick, modifiers, query }
  ) => {
    return (
      <MenuItem
        key={resource.name}
        onClick={handleClick}
        text={
          <span>
            {resource.type} > {resource.subtype} >{" "}
            <strong>{resource.name}</strong>
          </span>
        }
      />
    );
  };

  private filterByName: ItemPredicate<IFhirResource> = (
    query,
    resource: IFhirResource
  ) => {
    return [resource.type, resource.subtype, resource.name].some(
      (s: string) => `${s.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0
    );
  };

  private sortAlphabetically = (item1: string, item2: string): number => {
    const name1 = item1.toLowerCase();
    const name2 = item2.toLowerCase();
    if (name1 < name2) return -1;
    if (name1 > name2) return 1;
    return 0;
  };

  private sortItems = (
    resources: IFhirResource[]
  ) => {
    resources.sort((r1, r2) => {
      let sortResult;
      sortResult = this.sortAlphabetically(r1.type, r2.type);
      if (sortResult !== 0) return sortResult;
      sortResult = this.sortAlphabetically(r1.subtype, r2.subtype);
      if (sortResult !== 0) return sortResult;
      return this.sortAlphabetically(r1.name, r2.name);
    });
    return resources;
  };

  private displayItem = function(resource: IFhirResource): string {
    return resource.name ? resource.name : "None";
  };

  public render() {
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
      <TSelect<IFhirResource>
        disabled={disabled}
        displayItem={this.displayItem}
        filterItems={this.filterByName}
        loading={loading}
        icon={icon}
        inputItem={inputItem}
        intent={intent}
        items={this.sortItems(items)}
        onChange={onChange}
        popoverProps={{
          autoFocus: true,
          boundary: "viewport",
          canEscapeKeyClose: true,
          lazy: true,
          position: Position.RIGHT_TOP,
          usePortal: true
        }}
        renderItem={this.renderItem}
      />
    );
  }
}

import * as React from "react";
import { Intent, MenuItem, Position } from "@blueprintjs/core";
import {
  ItemPredicate,
  ItemRenderer,
} from "@blueprintjs/select";
import { IconName } from "@blueprintjs/icons";

import TSelect from "./TSelect";


interface ISelectProps {
  disabled?: boolean;
  icon?: IconName;
  inputItem: string;
  intent?: Intent;
  items?: string[];
  loading?: boolean;
  onChange: any;
  popoverProps?: any;
}

export default class AddResourceSelect extends React.Component<
  ISelectProps,
  any
  > {
  private renderItem: ItemRenderer<string> = (
    resource: string,
    { handleClick, modifiers, query }
  ) => {
    return (
      <MenuItem
        key={resource}
        onClick={handleClick}
        text={
          <span>
            <strong>{resource}</strong>
          </span>
        }
      />
    );
  };

  private filterByName: ItemPredicate<string> = (
    query,
    resource: string
  ) => {
    return resource.toLowerCase().indexOf(query.toLowerCase()) >= 0
  };

  private sortAlphabetically = (item1: string, item2: string): number => {
    const name1 = item1.toLowerCase();
    const name2 = item2.toLowerCase();
    if (name1 < name2) return -1;
    if (name1 > name2) return 1;
    return 0;
  };

  private sortItems = (
    resources: string[]
  ) => {
    const { loading } = this.props
    if (loading) {
      return []
    }

    resources.sort((r1, r2) => this.sortAlphabetically(r1, r2)
    );
    return resources;
  };

  private displayItem = function (resource: string): string {
    return resource
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
      <TSelect<string>
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

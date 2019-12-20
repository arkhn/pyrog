import * as React from "react";
import { MenuItem, Intent, IPopoverProps } from "@blueprintjs/core";

import {
  Select,
  ItemPredicate,
  ItemRenderer,
  ItemListPredicate
} from "@blueprintjs/select";
import { IconName } from "@blueprintjs/icons";

import TSelect from "./TSelect";

interface ISelectProps {
  disabled?: boolean;
  icon?: IconName;
  inputItem: string;
  intent?: Intent;
  items: string[];
  loading?: boolean;
  filterable?: boolean;
  onChange: any;
  popoverProps?: IPopoverProps;
}

export default class StringSelect extends React.Component<ISelectProps, any> {
  private renderItem: ItemRenderer<string> = (
    item,
    { handleClick, modifiers, query }
  ) => {
    return <MenuItem key={item} onClick={handleClick} text={item} />;
  };

  private filterByName: ItemPredicate<string> = (query, item) => {
    return `${item.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
  };

  private sortItems = (resources: string[]) => {
    resources.sort((s1, s2) => {
      const name1 = s1.toLowerCase();
      const name2 = s2.toLowerCase();
      if (name1 < name2) return -1;
      if (name1 > name2) return 1;
      return 0;
    });
    return resources;
  };

  private displayItem = function(item: string): string {
    return item ? item : "None";
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
      filterable,
      popoverProps
    } = this.props;

    return (
      <TSelect<string>
        disabled={disabled}
        displayItem={this.displayItem}
        filterItems={this.filterByName}
        filterable={filterable}
        loading={loading}
        icon={icon}
        inputItem={inputItem}
        intent={intent}
        items={this.sortItems(items)}
        onChange={onChange}
        renderItem={this.renderItem}
        popoverProps={popoverProps}
      />
    );
  }
}

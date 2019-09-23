import * as React from "react";
import { Button, MenuItem, Intent } from "@blueprintjs/core";
import { Select, ItemPredicate, ItemRenderer } from "@blueprintjs/select";
import { IconName } from "@blueprintjs/icons";

import TSelect from "./TSelect";

interface ISource {
  id: string;
  name: string;
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
  private renderItem: ItemRenderer<ISource> = (
    source: ISource,
    { handleClick, modifiers, query }
  ) => {
    return (
      <MenuItem key={source.id} onClick={handleClick} text={source.name} />
    );
  };

  private filterByName: ItemPredicate<ISource> = (query, source: ISource) => {
    return `${source.name.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
  };

  private displayItem = function(source: ISource): string {
    return source.name ? source.name : "None";
  };

  public render() {
    const {
      disabled,
      icon,
      inputItem,
      intent,
      items,
      loading,
      onChange
    } = this.props;

    return (
      <TSelect<ISource>
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
    );
  }
}

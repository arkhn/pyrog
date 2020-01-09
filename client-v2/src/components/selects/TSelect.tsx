import { Button, Intent, MenuItem, IPopoverProps } from "@blueprintjs/core";
import { IconName } from "@blueprintjs/icons";
import {
  ItemPredicate,
  ItemRenderer,
  Select,
  ItemListPredicate
} from "@blueprintjs/select";
import * as React from "react";

interface ISelectProps<T> {
  disabled: boolean;
  displayItem: (item: any) => string;
  sortItems?: ItemListPredicate<T>;
  filterItems: ItemPredicate<T>;
  filterable?: boolean;
  items: T[];
  icon?: IconName;
  inputItem: T;
  intent?: Intent;
  loading?: boolean;
  onChange: any;
  popoverProps?: IPopoverProps;
  renderItem: ItemRenderer<T>;
}

export default class TSelect<T> extends React.Component<ISelectProps<T>, any> {
  constructor(props: ISelectProps<T>) {
    super(props);
  }

  private CustomSelect = Select.ofType<T>();

  private handleValueChange = (item: T) => {
    this.props.onChange(item);
  };

  public render() {
    const {
      disabled,
      displayItem,
      sortItems,
      filterItems,
      filterable,
      icon,
      inputItem,
      intent,
      items,
      loading,
      popoverProps,
      renderItem
    } = this.props;

    return (
      <this.CustomSelect
        disabled={disabled}
        filterable={filterable}
        items={items}
        itemListPredicate={sortItems}
        itemPredicate={filterItems}
        itemRenderer={renderItem}
        noResults={<MenuItem disabled={true} text="No results." />}
        onItemSelect={this.handleValueChange}
        popoverProps={popoverProps}
      >
        <Button
          disabled={disabled}
          icon={icon}
          intent={intent}
          loading={loading}
          rightIcon="caret-down"
          text={displayItem(inputItem)}
        />
      </this.CustomSelect>
    );
  }
}

import { Button, Intent, MenuItem, IPopoverProps } from '@blueprintjs/core';
import { IconName } from '@blueprintjs/icons';
import {
  ItemPredicate,
  ItemRenderer,
  Select,
  ItemListPredicate
} from '@blueprintjs/select';
import * as React from 'react';

interface ISelectProps<T> {
  disabled: boolean;
  displayItem: (item: any) => string;
  className?: string;
  rightIcon?: IconName;
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
  private CustomSelect = Select.ofType<T>();

  private handleValueChange = (item: T) => {
    this.props.onChange(item);
  };

  public render() {
    const {
      disabled,
      displayItem,
      className,
      rightIcon,
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
        className={className}
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
          fill={true}
          alignText={'left'}
          icon={icon}
          intent={intent}
          loading={loading}
          rightIcon={rightIcon || 'caret-down'}
          text={displayItem(inputItem)}
        />
      </this.CustomSelect>
    );
  }
}

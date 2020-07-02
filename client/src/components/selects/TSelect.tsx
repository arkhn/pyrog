import {
  Button,
  Intent,
  MenuItem,
  IPopoverProps,
  Icon
} from '@blueprintjs/core';
import { IconName } from '@blueprintjs/icons';
import {
  ItemPredicate,
  ItemListPredicate,
  ItemRenderer,
  ItemListRenderer,
  Select
} from '@blueprintjs/select';
import * as React from 'react';

interface ISelectProps<T> {
  createNewItemFromQuery?: (query: string) => T;
  createNewItemRenderer?: (
    query: string,
    active: boolean,
    handleClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  ) => JSX.Element | undefined;
  disabled: boolean;
  displayItem: (item: any) => string;
  isMenuItem?: boolean;
  className?: string;
  rightIcon?: IconName;
  filterItems?: ItemPredicate<T>;
  filterList?: ItemListPredicate<T>;
  filterable?: boolean;
  items: T[];
  itemDisabled?: (item: T, index: number) => boolean;
  icon?: IconName;
  inputItem: T;
  intent?: Intent;
  loading?: boolean;
  onChange: Function;
  popoverProps?: IPopoverProps;
  renderItem: ItemRenderer<T>;
  renderList?: ItemListRenderer<T>;
}

export default class TSelect<T> extends React.Component<ISelectProps<T>, any> {
  private CustomSelect = Select.ofType<T>();

  private handleValueChange = (item: T, e: any) => {
    this.props.onChange(item);
  };

  public render() {
    const {
      createNewItemFromQuery,
      createNewItemRenderer,
      disabled,
      displayItem,
      className,
      rightIcon,
      filterItems,
      filterList,
      filterable,
      isMenuItem,
      icon,
      inputItem,
      intent,
      items,
      itemDisabled,
      loading,
      popoverProps,
      renderItem,
      renderList
    } = this.props;

    const child = isMenuItem ? (
      <MenuItem
        labelElement={rightIcon || <Icon icon="caret-right" />}
        disabled={disabled}
        icon={icon}
        intent={intent}
        text={displayItem(inputItem)}
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
        }}
      />
    ) : (
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
    );

    return (
      <this.CustomSelect
        createNewItemFromQuery={createNewItemFromQuery}
        createNewItemRenderer={createNewItemRenderer}
        disabled={disabled}
        className={className}
        filterable={filterable}
        items={items}
        itemDisabled={itemDisabled}
        itemPredicate={filterItems}
        itemListPredicate={filterList}
        itemRenderer={renderItem}
        itemListRenderer={renderList}
        noResults={<MenuItem disabled={true} text="No results." />}
        onItemSelect={this.handleValueChange}
        popoverProps={popoverProps}
      >
        {child}
      </this.CustomSelect>
    );
  }
}

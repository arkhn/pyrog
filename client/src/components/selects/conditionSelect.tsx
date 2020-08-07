import React from 'react';
import { MenuItem, Intent, IPopoverProps } from '@blueprintjs/core';

import { ItemListPredicate, ItemRenderer } from '@blueprintjs/select';
import { IconName } from '@blueprintjs/icons';

import TSelect from './TSelect';

import { Condition } from 'types';

interface Props {
  disabled?: boolean;
  displayItem?: (item: string) => string;
  icon?: IconName;
  inputItem: Condition;
  intent?: Intent;
  items: Condition[];
  maxItems?: number;
  loading?: boolean;
  filterable?: boolean;
  itemToKey:  (condition: Condition) => string
  onChange: any;
  popoverProps?: IPopoverProps;
}

const ConditionSelect = ({
  disabled,
  icon,
  inputItem,
  intent,
  items,
  loading,
  onChange,
  filterable,
  itemToKey,
  popoverProps
}: Props) => {
  const renderItem: ItemRenderer<Condition> = (item, { handleClick }) => (
    <MenuItem
      key={itemToKey(item)}
      onClick={handleClick}
      text={itemToKey(item)}
    />
  );

  const filterList: ItemListPredicate<Condition> = (query, items) => {
    return items.filter(
      item =>
        `${itemToKey(item).toLowerCase()}`.indexOf(query.toLowerCase()) >=
        0
    );
  };

  return (
    <TSelect<Condition>
      disabled={!!disabled}
      displayItem={() => ''}
      filterList={filterList}
      filterable={filterable}
      loading={loading}
      icon={icon}
      inputItem={inputItem}
      intent={intent}
      items={items}
      onChange={onChange}
      renderItem={renderItem}
      popoverProps={popoverProps}
    />
  );
};

export default ConditionSelect;

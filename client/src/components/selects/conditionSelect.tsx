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
  popoverProps
}: Props) => {
  const conditionToName = (condition: Condition): string =>
    `${condition.action} ${condition.column.table} ${condition.column.column} ${condition.value}`;

  const renderItem: ItemRenderer<Condition> = (item, { handleClick }) => (
    <MenuItem
      key={conditionToName(item)}
      onClick={handleClick}
      text={conditionToName(item)}
    />
  );

  const filterList: ItemListPredicate<Condition> = (query, items) => {
    return items.filter(
      item =>
        `${conditionToName(item).toLowerCase()}`.indexOf(query.toLowerCase()) >=
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

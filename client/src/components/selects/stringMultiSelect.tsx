import { MenuItem } from '@blueprintjs/core';
import { ItemPredicate, MultiSelect } from '@blueprintjs/select';
import React from 'react';

interface Props {
  items: string[];
  selectedItems: string[];
  onItemSelect: (item: string) => void;
  onRemoveTag?: (item: string, ind: number) => void;
}

const StringMultiSelect = ({
  items,
  selectedItems,
  onItemSelect,
  onRemoveTag
}: Props): React.ReactElement => {
  const CustomSelect = MultiSelect.ofType<string>();

  const isItemSelected = (list: any[], item: any): boolean => {
    return list.includes(item);
  };

  const renderstring = (item: string, { handleClick }: any) => (
    <MenuItem
      key={item}
      text={item}
      icon={isItemSelected(selectedItems, item) ? 'tick' : 'blank'}
      onClick={handleClick}
      shouldDismissPopover={false}
    />
  );

  const filterItems: ItemPredicate<string> = (query, source) => {
    return source.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  };

  return (
    <CustomSelect
      items={items.length > 0 ? items : []}
      tagRenderer={item => item}
      tagInputProps={{
        onRemove: onRemoveTag as (value: React.ReactNode, index: number) => void
      }}
      itemRenderer={renderstring}
      itemPredicate={filterItems}
      onItemSelect={onItemSelect}
      resetOnSelect={true}
      selectedItems={selectedItems}
      fill={true}
      noResults={
        <MenuItem disabled={true} text="No items for the selected source." />
      }
    />
  );
};

export default StringMultiSelect;

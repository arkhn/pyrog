import { MenuItem } from '@blueprintjs/core';
import { ItemPredicate, MultiSelect } from '@blueprintjs/select';
import React from 'react';

interface Props {
  resources: Resource[];
  selectedResources: Resource[];
  onResourceSelect: (item: Resource) => void;
  onSelectAll: () => void;
  onRemoveTag?: (item: string, ind: number) => void;
}

interface Resource {
  id: string;
  label: string;
  definitionId: string;
}

const selectAllItem = {
  id: '__SELECT_ALL__',
  label: '',
  definitionId: ''
};

const ResourceMultiSelect = ({
  resources,
  selectedResources,
  onResourceSelect,
  onSelectAll,
  onRemoveTag
}: Props): React.ReactElement => {
  const CustomSelect = MultiSelect.ofType<Resource>();

  const isItemSelected = (list: any[], item: any): boolean => {
    return list.includes(item);
  };

  const renderResource = (resource: Resource, { handleClick }: any) =>
    resource.id === '__SELECT_ALL__' ? (
      <MenuItem
        key={resource.id}
        text={
          selectedResources.length === resources.length ? (
            <strong>Deselect all</strong>
          ) : (
            <strong>Select all</strong>
          )
        }
        icon={selectedResources.length === resources.length ? 'tick' : 'blank'}
        onClick={onSelectAll}
        shouldDismissPopover={false}
      />
    ) : (
      <MenuItem
        key={resource.id}
        text={resource.definitionId}
        label={resource.label}
        icon={isItemSelected(selectedResources, resource) ? 'tick' : 'blank'}
        onClick={handleClick}
        shouldDismissPopover={false}
      />
    );

  const filterResources: ItemPredicate<Resource> = (query, source) => {
    return source.definitionId.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  };

  return (
    <CustomSelect
      items={resources.length > 0 ? [selectAllItem, ...resources] : []}
      tagRenderer={resource => resource.definitionId}
      tagInputProps={{
        onRemove: onRemoveTag
      }}
      itemRenderer={renderResource}
      itemPredicate={filterResources}
      onItemSelect={onResourceSelect}
      resetOnSelect={true}
      selectedItems={selectedResources}
      itemsEqual="id"
      fill={true}
      noResults={
        <MenuItem
          disabled={true}
          text="No resources for the selected source."
        />
      }
    />
  );
};

export default ResourceMultiSelect;

import { MenuItem } from '@blueprintjs/core';
import { ItemPredicate, MultiSelect } from '@blueprintjs/select';
import React from 'react';

interface Props {
  resources: Resource[];
  selectedResources: Resource[];
  onResourceSelect: (item: Resource) => void;
  onRemoveTag?: (item: string, ind: number) => void;
}

interface Resource {
  id: string;
  label: string;
  definitionId: string;
}

const ResourceMultiSelect = ({
  resources,
  selectedResources,
  onResourceSelect,
  onRemoveTag
}: Props): React.ReactElement => {
  const CustomSelect = MultiSelect.ofType<Resource>();

  const isItemSelected = (list: any[], item: any): boolean => {
    return list.includes(item);
  };

  const renderResource = (resource: Resource, { handleClick }: any) => (
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
      items={resources}
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

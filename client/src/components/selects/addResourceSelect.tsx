import * as React from 'react';
import { Intent, MenuItem, Position } from '@blueprintjs/core';
import { ItemPredicate, ItemRenderer } from '@blueprintjs/select';
import { IconName } from '@blueprintjs/icons';

import TSelect from './TSelect';

interface Props {
  disabled?: boolean;
  icon?: IconName;
  inputItem?: Resource;
  intent?: Intent;
  items?: Resource[];
  loading?: boolean;
  onChange: any;
  popoverProps?: any;
}

interface Profile {
  id: string;
  name: string;
  type: string;
}
interface Resource {
  id: string;
  name: string;
  type: string;
  profiles: Profile[];
}

const AddResourceSelect = ({
  disabled,
  icon,
  inputItem,
  intent,
  items,
  loading,
  onChange
}: Props) => {
  const renderMenuItem: ItemRenderer<Profile> = (
    profile: Profile,
    { handleClick, modifiers, query }
  ) => {
    return (
      <MenuItem
        key={profile.id}
        onClick={handleClick}
        label={profile.id === profile.type ? 'Default' : ''}
        text={
          <span>
            <strong>{profile.name}</strong>
          </span>
        }
      />
    );
  };

  const renderItem: ItemRenderer<Resource> = (
    resource: Resource,
    { handleClick, modifiers, query }
  ) => {
    return (
      <TSelect<Profile>
        key={resource.id}
        disabled={false}
        displayItem={(p: Profile) => p.name}
        className="column-menu-item"
        rightIcon="caret-right"
        filterItems={filterByName}
        inputItem={resource}
        items={sortItems(resource.profiles || [], resource.id)}
        onChange={onChange}
        popoverProps={{
          autoFocus: true,
          boundary: 'viewport',
          canEscapeKeyClose: true,
          lazy: true,
          position: Position.RIGHT_TOP,
          usePortal: true
        }}
        renderItem={renderMenuItem}
      />
    );
  };

  const filterByName: ItemPredicate<Profile> = (query, resource: Profile) => {
    return resource.name.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  };

  const sortAlphabetically = (
    item1: Profile,
    item2: Profile,
    first: string | undefined
  ): number => {
    if (item1.id === first) return -1;
    if (item2.id === first) return 1;

    const name1 = item1.name.toLowerCase();
    const name2 = item2.name.toLowerCase();

    if (name1 < name2) return -1;
    if (name1 > name2) return 1;
    return 0;
  };

  // If the second argument is provided, the sort funcion puts
  // the resource which id matches on top of the list.
  const sortItems = (
    profiles: Profile[],
    first: string | undefined = undefined
  ): Profile[] => {
    if (loading) {
      return [];
    }

    return profiles.sort((p1, p2) => sortAlphabetically(p1, p2, first));
  };

  return (
    <TSelect<Resource>
      disabled={!!disabled}
      displayItem={(resource: Resource) => resource.name}
      filterItems={filterByName}
      loading={loading}
      icon={icon}
      inputItem={inputItem || ({ name: 'Select a resource' } as Resource)}
      intent={intent}
      items={sortItems(items || []) as Resource[]}
      onChange={onChange}
      popoverProps={{
        autoFocus: true,
        boundary: 'viewport',
        canEscapeKeyClose: true,
        lazy: true,
        position: Position.RIGHT_TOP,
        usePortal: true
      }}
      renderItem={renderItem}
    />
  );
};

export default AddResourceSelect;

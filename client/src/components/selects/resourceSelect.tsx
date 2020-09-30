import * as React from 'react';
import { MenuItem, Intent, Position } from '@blueprintjs/core';
import {ItemListPredicate, ItemPredicate, ItemRenderer} from '@blueprintjs/select';
import { IconName } from '@blueprintjs/icons';

import TSelect from './TSelect';
import { Resource } from 'types';

interface SelectProps {
  disabled?: boolean;
  icon?: IconName;
  inputItem: Resource;
  intent?: Intent;
  items: Resource[];
  loading?: boolean;
  onChange: any;
}

export default class ResourceSelect extends React.Component<SelectProps, any> {
  private renderItem: ItemRenderer<Resource> = (
    resource: Resource,
    { handleClick, modifiers, query }
  ) => {
    return (
      <MenuItem
        key={resource.id}
        onClick={handleClick}
        text={resource.definition.name}
        label={resource.label}
      />
    );
  };

  private filterList: ItemListPredicate<Resource> = (query, items) => {
    const stringSet = new Set(
      items.filter(
        item =>
          item.definition.name?.toLowerCase().startsWith(query.toLowerCase()) ||
          item.label?.toLowerCase().startsWith(query.toLowerCase())
      )
    );
    items
      .filter(
        item =>
          item.definition.name?.toLowerCase().indexOf(query.toLowerCase()) >=
            0 || item.label?.toLowerCase().indexOf(query.toLowerCase()) >= 0
      )
      .forEach(e => stringSet.add(e));
    return [...stringSet];
  };

  private sortItems = (resources: Resource[]): Resource[] =>
    resources.sort((r1: Resource, r2: Resource): number =>
      r1.definition.name.localeCompare(r2.definition.name)
    );

  private displayItem = (resource: Resource): string =>
    resource.definition ? resource.definition.name : '(Select a resource)';

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
      <TSelect<Resource>
        disabled={!!disabled}
        displayItem={this.displayItem}
        filterList={this.filterList}
        loading={loading}
        icon={icon}
        inputItem={inputItem}
        intent={intent}
        items={items ? this.sortItems(items) : []}
        onChange={onChange}
        popoverProps={{
          autoFocus: true,
          boundary: 'viewport',
          canEscapeKeyClose: true,
          lazy: true,
          position: Position.RIGHT_BOTTOM,
          usePortal: true
        }}
        renderItem={this.renderItem}
      />
    );
  }
}

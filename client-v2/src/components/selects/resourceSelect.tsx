import * as React from 'react';
import { MenuItem, Intent, Position } from '@blueprintjs/core';
import {
  ItemPredicate,
  ItemListPredicate,
  ItemRenderer
} from '@blueprintjs/select';
import { IconName } from '@blueprintjs/icons';

import TSelect from './TSelect';

interface IResource {
  id: string;
  label: string;
  fhirType: string;
}

interface ISelectProps {
  disabled?: boolean;
  icon?: IconName;
  inputItem: IResource;
  intent?: Intent;
  items: IResource[];
  loading?: boolean;
  onChange: any;
}

export default class ResourceSelect extends React.Component<ISelectProps, any> {
  private renderItem: ItemRenderer<IResource> = (
    resource: IResource,
    { handleClick, modifiers, query }
  ) => {
    return (
      <MenuItem
        key={resource.id}
        onClick={handleClick}
        text={resource.fhirType}
        label={resource.label}
      />
    );
  };

  private filterByName: ItemPredicate<IResource> = (
    query,
    resource: IResource
  ) => {
    return (
      `${resource.fhirType.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0
    );
  };

  private sortItems: ItemListPredicate<IResource> = (
    query,
    resources: IResource[]
  ) => {
    resources.sort((r1, r2) => {
      const name1 = r1.fhirType.toLowerCase();
      const name2 = r2.fhirType.toLowerCase();
      if (name1 < name2) return -1;
      if (name1 > name2) return 1;
      return 0;
    });
    return resources;
  };

  private displayItem = function(resource: IResource): string {
    return resource ? resource.fhirType : 'None';
  };

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
      <TSelect<IResource>
        disabled={!!disabled}
        displayItem={this.displayItem}
        filterItems={this.filterByName}
        sortItems={this.sortItems}
        loading={loading}
        icon={icon}
        inputItem={inputItem}
        intent={intent}
        items={items}
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

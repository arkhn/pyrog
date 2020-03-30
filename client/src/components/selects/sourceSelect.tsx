import * as React from 'react';
import { MenuItem, Intent } from '@blueprintjs/core';
import { ItemPredicate, ItemRenderer } from '@blueprintjs/select';
import { IconName } from '@blueprintjs/icons';

import TSelect from './TSelect';

interface Source {
  id: string;
  name: string;
  template: {
    name: string;
  };
}

interface SelectProps {
  disabled?: boolean;
  icon?: IconName;
  inputItem: Source;
  intent?: Intent;
  items: Source[];
  loading?: boolean;
  onChange: any;
}

export default class SourceSelect extends React.Component<SelectProps, any> {
  private renderItem: ItemRenderer<Source> = (
    source: Source,
    { handleClick }
  ) => {
    return (
      <MenuItem
        key={source.id}
        onClick={handleClick}
        text={source.name}
        label={source.template.name}
      />
    );
  };

  private filterByName: ItemPredicate<Source> = (query, source: Source) => {
    return `${source.name.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
  };

  private displayItem = function(source: Source): string {
    return source.name ? source.name : '(Select a source)';
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
      <TSelect<Source>
        disabled={!!disabled}
        displayItem={this.displayItem}
        filterItems={this.filterByName}
        loading={loading}
        icon={icon}
        inputItem={inputItem}
        intent={intent}
        items={items}
        onChange={onChange}
        renderItem={this.renderItem}
      />
    );
  }
}

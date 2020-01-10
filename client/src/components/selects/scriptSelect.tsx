import {
  ItemListPredicate,
  ItemPredicate,
  ItemRenderer
} from '@blueprintjs/select';
import { MenuItem, Button, ButtonGroup } from '@blueprintjs/core';
import * as React from 'react';
import { loader } from 'graphql.macro';

import TSelect from './TSelect';
import { useQuery } from 'react-apollo';

const cleaningScripts = loader('src/graphql/queries/cleaningScripts.graphql');

interface IOnChange {
  (script: string): any;
}

interface IScript {
  name: string;
  description?: string;
}

interface IProps {
  selectedScript: string;
  loading?: boolean;
  onChange: IOnChange;
  onClear: Function;
}

const filterByName: ItemPredicate<IScript> = (query, item) => {
  return `${item.name.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
};

const sortItems: ItemListPredicate<IScript> = (query, resources: IScript[]) => {
  resources.sort((s1, s2) => {
    const name1 = s1.name.toLowerCase();
    const name2 = s2.name.toLowerCase();
    if (name1 < name2) return -1;
    if (name1 > name2) return 1;
    return 0;
  });
  return resources;
};

const renderItem: ItemRenderer<IScript> = (
  item,
  { handleClick, modifiers, query }
) => {
  return (
    <MenuItem
      key={item.name}
      onClick={handleClick}
      label={item.name}
      text={item.description}
    />
  );
};

const ScriptSelect = ({
  selectedScript,
  loading,
  onChange,
  onClear
}: IProps) => {
  const { loading: queryLoading, data } = useQuery(cleaningScripts);
  let items: IScript[] = [];
  if (data && data.cleaningScripts) {
    items = data.cleaningScripts.scripts;
  }
  return (
    <ButtonGroup>
      <TSelect<IScript>
        disabled={false}
        displayItem={({ name }: IScript) => {
          return name || 'None';
        }}
        sortItems={sortItems}
        filterItems={filterByName}
        loading={loading || queryLoading}
        inputItem={{ name: selectedScript }}
        items={items}
        onChange={(script: IScript) => onChange(script.name)}
        renderItem={renderItem}
      />
      <Button
        disabled={!selectedScript}
        loading={loading || queryLoading}
        icon={'cross'}
        minimal={true}
        onClick={() => onClear()}
      />
    </ButtonGroup>
  );
};

export default ScriptSelect;

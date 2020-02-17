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

interface OnChange {
  (script: string): any;
}

interface Script {
  name: string;
  description?: string;
}

interface Props {
  selectedScript: string;
  loading?: boolean;
  onChange: OnChange;
  onClear: Function;
}

const filterByName: ItemPredicate<Script> = (query, item) => {
  return `${item.name.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
};

const sortItems: ItemListPredicate<Script> = (query, resources: Script[]) => {
  resources.sort((s1, s2) => {
    const name1 = s1.name.toLowerCase();
    const name2 = s2.name.toLowerCase();
    if (name1 < name2) return -1;
    if (name1 > name2) return 1;
    return 0;
  });
  return resources;
};

const renderItem: ItemRenderer<Script> = (
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
}: Props) => {
  const { loading: queryLoading, data } = useQuery(cleaningScripts);
  let items: Script[] = [];
  if (data && data.cleaningScripts) {
    items = data.cleaningScripts.scripts;
  }
  return (
    <ButtonGroup>
      <TSelect<Script>
        disabled={false}
        displayItem={({ name }: Script): string => {
          return name || 'None';
        }}
        sortItems={sortItems}
        filterItems={filterByName}
        loading={loading || queryLoading}
        inputItem={{ name: selectedScript }}
        items={items}
        onChange={(script: Script): void => onChange(script.name)}
        renderItem={renderItem}
      />
      <Button
        className="delete-button"
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

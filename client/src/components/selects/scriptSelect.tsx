import {
  ItemListPredicate,
  ItemPredicate,
  ItemRenderer
} from '@blueprintjs/select';
import { MenuItem, Button, ButtonGroup, Position } from '@blueprintjs/core';
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

const filterByName: ItemPredicate<Script> = (query, item) =>
  item.name.toLowerCase().indexOf(query.toLowerCase()) >= 0;

const sortItems = (scripts: Script[]) =>
  scripts.sort((s1, s2) => {
    const name1 = s1.name.toLowerCase();
    const name2 = s2.name.toLowerCase();
    if (name1 < name2) return -1;
    if (name1 > name2) return 1;
    return 0;
  });

const renderItem: ItemRenderer<Script> = (item, { handleClick }) => {
  return (
    <MenuItem
      key={item.name}
      onClick={handleClick}
      label={item.description}
      text={item.name}
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
  const [items, setItems] = React.useState([] as Script[]);
  React.useEffect(() => {
    if (data && data.cleaningScripts) {
      setItems(data.cleaningScripts.scripts);
    }
  }, [data]);

  return (
    <ButtonGroup>
      <TSelect<Script>
        disabled={false}
        displayItem={({ name }: Script): string => {
          return name || 'None';
        }}
        filterItems={filterByName}
        loading={loading || queryLoading}
        inputItem={{ name: selectedScript }}
        items={sortItems(items)}
        onChange={(script: Script): void => onChange(script.name)}
        renderItem={renderItem}
        popoverProps={{
          autoFocus: true,
          boundary: 'viewport',
          canEscapeKeyClose: true,
          lazy: true,
          position: Position.RIGHT_TOP,
          usePortal: true
        }}
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

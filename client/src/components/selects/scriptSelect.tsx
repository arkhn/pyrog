import { ItemPredicate, ItemRenderer } from '@blueprintjs/select';
import { MenuItem, Button, ButtonGroup, Position } from '@blueprintjs/core';
import * as React from 'react';

import TSelect from './TSelect';
import { useSelector } from 'react-redux';
import { IReduxStore, Script } from 'types';

interface OnChange {
  (script: string): any;
}

interface Props {
  selectedScript: string;
  loading?: boolean;
  onChange: OnChange;
  onClear: Function;
}

const filterByName: ItemPredicate<Script> = (query, item) =>
  item.name.toLowerCase().startsWith(query.toLowerCase());

const sortItems = (scripts: Script[]): Script[] =>
  scripts.sort((s1: Script, s2: Script): number =>
    s1.name.localeCompare(s2.name)
  );

const renderItem: ItemRenderer<Script> = (item, { index, handleClick }) => (
  <MenuItem
    key={index}
    onClick={handleClick}
    label={item.description}
    text={item.name}
  />
);

const ScriptSelect = ({
  selectedScript,
  loading,
  onChange,
  onClear
}: Props) => {
  const scriptsList = useSelector(
    ({ scriptList }: IReduxStore) => scriptList.data
  );

  return (
    <ButtonGroup>
      <TSelect<Script>
        disabled={scriptsList.length === 0}
        displayItem={(script: Script | undefined): string => {
          return script?.name || 'None';
        }}
        filterItems={filterByName}
        loading={loading}
        inputItem={scriptsList.find(s => s.name === selectedScript)}
        items={sortItems(scriptsList)}
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
        loading={loading}
        icon={'cross'}
        minimal={true}
        onClick={() => onClear()}
      />
    </ButtonGroup>
  );
};

export default ScriptSelect;

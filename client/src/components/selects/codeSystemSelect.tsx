import { ItemPredicate, ItemRenderer } from '@blueprintjs/select';
import { MenuItem, Button, ButtonGroup } from '@blueprintjs/core';
import React from 'react';

import TSelect from './TSelect';

interface CodeSystem {
  name: string;
}

interface Props {
  systems: CodeSystem[];
  selectedSystem: string;
  onChange: Function;
  onClear: Function;
  allowCreate?: boolean;
}

const filterByName: ItemPredicate<CodeSystem> = (query, item) => {
  return `${item.name.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
};

const renderItem: ItemRenderer<CodeSystem> = (item, { handleClick }) => {
  return <MenuItem text={item.name} key={item.name} onClick={handleClick} />;
};

const CodeSystemSelect = ({
  systems,
  selectedSystem,
  onChange,
  onClear,
  allowCreate
}: Props) => {
  const createNewItemFromQuery = (name: string): CodeSystem => {
    return { name: name };
  };

  const createNewItemRenderer = (
    query: string,
    active: boolean,
    handleClick: React.MouseEventHandler<HTMLElement>
  ) => (
    <MenuItem
      icon="add"
      text={`Create "${query}"`}
      active={active}
      onClick={handleClick}
      shouldDismissPopover={false}
    />
  );
  return (
    <ButtonGroup>
      <TSelect<CodeSystem>
        disabled={false}
        displayItem={({ name }: CodeSystem) => {
          return name || 'None';
        }}
        filterItems={filterByName}
        inputItem={{ name: selectedSystem }}
        items={systems}
        onChange={(script: CodeSystem) => onChange(script.name)}
        renderItem={renderItem}
        createNewItemFromQuery={
          allowCreate ? createNewItemFromQuery : undefined
        }
        createNewItemRenderer={allowCreate ? createNewItemRenderer : undefined}
      />
      <Button
        disabled={!selectedSystem}
        icon={'cross'}
        minimal={true}
        onClick={() => onClear()}
      />
    </ButtonGroup>
  );
};

export default CodeSystemSelect;

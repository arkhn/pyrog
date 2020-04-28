import { ItemPredicate, ItemRenderer } from '@blueprintjs/select';
import { MenuItem, Button, ButtonGroup, Position } from '@blueprintjs/core';
import * as React from 'react';

import TSelect from './TSelect';

interface Code {
  value: string;
  system?: string;
}

interface Props {
  items: Code[];
  selectedCode?: Code;
  loading?: boolean;
  onChange: Function;
  onClear: Function;
}

const filterByName: ItemPredicate<Code> = (query, item) =>
  item.value.toLowerCase().indexOf(query.toLowerCase()) >= 0;

const renderItem: ItemRenderer<Code> = (item, { handleClick }) => {
  return (
    <MenuItem
      key={item.value}
      onClick={handleClick}
      label={item.system}
      text={item.value}
    />
  );
};

const CodeSelect = ({
  items,
  selectedCode,
  onChange,
  onClear
}: Props): React.ReactElement => {
  return (
    <ButtonGroup>
      <TSelect<Code>
        disabled={false}
        displayItem={({ value }: Code): string => {
          return value || 'None';
        }}
        filterItems={filterByName}
        inputItem={selectedCode || ({} as Code)}
        items={items}
        onChange={(code: Code): void => onChange(code)}
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
        disabled={!selectedCode}
        icon={'cross'}
        minimal={true}
        onClick={() => onClear()}
      />
    </ButtonGroup>
  );
};

export default CodeSelect;

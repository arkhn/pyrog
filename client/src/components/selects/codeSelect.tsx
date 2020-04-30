import { ItemPredicate, ItemRenderer } from '@blueprintjs/select';
import { Button, ButtonGroup, MenuItem, Position } from '@blueprintjs/core';
import React, { useState } from 'react';

import { Code, Terminology } from 'types';

import TSelect from './TSelect';

import './style.scss';

interface Props {
  terminology: Terminology;
  selectedCode?: Code;
  loading?: boolean;
  onChange: Function;
  onClear: Function;
  allowCreate?: boolean;
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
  terminology,
  selectedCode,
  onChange,
  onClear,
  allowCreate
}: Props): React.ReactElement => {
  const [creatingNewCode, setCreatingNewCode] = useState(false);
  const codes = terminology.codes;

  return (
    <ButtonGroup className="code-select-button-group">
      {codes.length === 0 || creatingNewCode ? (
        <div className="value-system-input">
          <input
            className="text-input"
            value={selectedCode?.system || ''}
            type="text"
            placeholder="system..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              onChange({
                system: e.target.value
              })
            }
          />
          <input
            className="text-input"
            value={selectedCode?.value || ''}
            type="text"
            placeholder="value..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              onChange({
                value: e.target.value
              })
            }
          />
        </div>
      ) : (
        <TSelect<Code>
          disabled={false}
          displayItem={({ value }: Code): string => {
            return value || 'None';
          }}
          filterItems={filterByName}
          inputItem={selectedCode || ({} as Code)}
          items={codes}
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
      )}
      {allowCreate && codes.length > 0 && (
        <Button
          icon={creatingNewCode ? 'properties' : 'new-text-box'}
          minimal={true}
          onClick={(): void => setCreatingNewCode(!creatingNewCode)}
        />
      )}
      <Button
        disabled={!selectedCode}
        icon={'cross'}
        minimal={true}
        onClick={(): void => onClear()}
      />
    </ButtonGroup>
  );
};

export default CodeSelect;

import { Menu, MenuItem, Button, ButtonGroup } from '@blueprintjs/core';
import {
  ItemPredicate,
  ItemRenderer,
  ItemListRenderer,
  IItemListRendererProps
} from '@blueprintjs/select';
import React from 'react';

import TSelect from './TSelect';

interface CodeSystem {
  title: string;
  name: string;
  concept: Concept[];
}

interface Concept {
  code: string;
}

interface Props {
  systems: CodeSystem[];
  selectedSystem: string;
  onChange: Function;
  onClear: Function;
  allowCreate?: boolean;
  itemDisabled?: (item: CodeSystem, index: number) => boolean;
  callbackCreatingNewSystem?: Function;
}

const filterByName: ItemPredicate<CodeSystem> = (query, item) => {
  return `${item.title.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
};

const renderItem: ItemRenderer<CodeSystem> = (
  item,
  { handleClick, modifiers }
) => {
  return (
    <MenuItem
      text={item.title || ''}
      key={item.title || ''}
      onClick={handleClick}
      disabled={modifiers.disabled}
    />
  );
};

const CodeSystemSelect = ({
  systems,
  selectedSystem,
  onChange,
  onClear,
  itemDisabled,
  callbackCreatingNewSystem,
  allowCreate
}: Props) => {
  const renderList: ItemListRenderer<CodeSystem> = ({
    items,
    itemsParentRef,
    renderItem
  }: IItemListRendererProps<CodeSystem>) => {
    const renderedItems = items.map(renderItem).filter(item => item != null);
    return (
      <Menu ulRef={itemsParentRef}>
        <MenuItem
          onClick={(): void =>
            callbackCreatingNewSystem ? callbackCreatingNewSystem() : null
          }
          icon={'plus'}
          text={
            <span>
              <strong>Create new code system</strong>
            </span>
          }
        />
        {renderedItems}
      </Menu>
    );
  };

  return (
    <ButtonGroup>
      <TSelect<CodeSystem>
        disabled={false}
        displayItem={({ title }: CodeSystem): string =>
          title || 'Choose a system'
        }
        filterItems={filterByName}
        inputItem={
          systems.find(s => s.title === selectedSystem) || ({} as CodeSystem)
        }
        items={systems}
        itemDisabled={itemDisabled}
        onChange={(s: CodeSystem) => onChange(s.title)}
        renderItem={renderItem}
        renderList={allowCreate ? renderList : undefined}
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

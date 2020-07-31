import * as React from 'react';
import {
  Button,
  ButtonGroup,
  Dialog,
  Intent,
  Menu,
  MenuItem,
  Position
} from '@blueprintjs/core';

import {
  ItemPredicate,
  ItemRenderer,
  ItemListRenderer
} from '@blueprintjs/select';
import { IconName } from '@blueprintjs/icons';

import TSelect from './TSelect';

import { Condition } from 'types';

interface Props {
  disabled?: boolean;
  icon?: IconName;
  inputItem?: Condition;
  intent?: Intent;
  items?: Condition[];
  loading?: boolean;
  onChange: any;
  onClear: any;
  popoverProps?: any;
}

interface CreateConditionProps {
  isOpen: boolean;
  onClose: any;
  onUpload: any;
}

const filterById: ItemPredicate<Condition> = (query, condition: Condition) => {
  return condition.id.toLowerCase().indexOf(query.toLowerCase()) >= 0;
};

const sortAlphabetically = (
  item1: Condition,
  item2: Condition,
  first: string | undefined
): number => {
  if (item1.id === first) return -1;
  if (item2.id === first) return 1;

  const name1 = item1.id.toLowerCase();
  const name2 = item2.id.toLowerCase();

  if (name1 < name2) return -1;
  if (name1 > name2) return 1;
  return 0;
};

// If the second argument is provided, the sort funcion puts
// the resource which id matches on top of the list.
const sortItems = (
  extensions: Condition[],
  first: string | undefined = undefined
): Condition[] =>
  extensions.sort((e1, e2) => sortAlphabetically(e1, e2, first));

const AddConditionSelect = ({
  disabled,
  icon,
  inputItem,
  intent,
  items,
  loading,
  onChange,
  onClear
}: Props) => {
  const [createConditionOpen, setCreateConditionOpen] = React.useState(false);

  const renderMenuItem: ItemRenderer<Condition> = (
    condition: Condition,
    { handleClick, modifiers, query }
  ) => (
    // TODO change display
    <MenuItem
      key={condition.id}
      onClick={handleClick}
      text={condition.id}
    />
  );

  const renderConditionList: ItemListRenderer<Condition> = ({
    itemsParentRef,
    renderItem,
    filteredItems
  }) => {
    const renderedItems = filteredItems.map(renderItem);
    return (
      <Menu ulRef={itemsParentRef}>
        <MenuItem
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            setCreateConditionOpen(true);
          }}
          icon={'plus'}
          text={
            <span>
              <strong>Create new condition</strong>
            </span>
          }
        />
        {renderedItems}
      </Menu>
    );
  };
  return (
    <React.Fragment>
      <CreateCondition
        isOpen={createConditionOpen}
        onClose={() => setCreateConditionOpen(false)}
        onUpload={onChange}
      />
      <ButtonGroup>
        <TSelect<Condition>
          disabled={false}
          displayItem={(c: Condition) => c.id}
          filterItems={filterById}
          loading={false}
          inputItem={inputItem || ({ id: 'None' } as Condition)}
          items={sortItems(items || []) as Condition[]}
          onChange={onChange}
          popoverProps={{
            autoFocus: true,
            boundary: 'viewport',
            canEscapeKeyClose: true,
            lazy: true,
            position: Position.RIGHT_TOP,
            usePortal: true
          }}
          renderItem={renderMenuItem}
          renderList={renderConditionList}
        />
        <Button
          className="delete-button"
          disabled={!inputItem}
          icon={'cross'}
          minimal={true}
          onClick={() => onClear()}
        />
      </ButtonGroup>
    </React.Fragment>
  );
};

const CreateCondition = ({
  isOpen,
  onClose,
  onUpload
}: CreateConditionProps) => {
  return (
    <Dialog className="dialog" isOpen={isOpen} title="Create a new extension">
      <Button className="uploadButton">Create extension</Button>
    </Dialog>
  );
};

export default AddConditionSelect;

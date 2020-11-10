import * as React from 'react';
import {
  MenuItem,
  Position,
  Menu,
  PopoverInteractionKind
} from '@blueprintjs/core';
import {
  ItemListRenderer,
  ItemPredicate,
  ItemRenderer
} from '@blueprintjs/select';

import TSelect from './TSelect';

interface Props {
  inputItem?: string;
  items?: string[];
  onChange: any;
  baseName?: string;
}

const filterByName: ItemPredicate<string> = (query, sliceName: string) => {
  return sliceName.toLowerCase().indexOf(query.toLowerCase()) >= 0;
};

const AddSliceSelect = ({ inputItem, items, onChange, baseName }: Props) => {
  const renderMenuItem: ItemRenderer<string> = (
    sliceName: string,
    { handleClick }
  ) => <MenuItem key={sliceName} onClick={handleClick} text={sliceName} />;

  const renderSliceList: ItemListRenderer<string> = ({
    itemsParentRef,
    renderItem,
    filteredItems
  }) => (
    <Menu ulRef={itemsParentRef}>
      <MenuItem onClick={onChange} text={baseName} label={'base element'} />
      {filteredItems.map(renderItem)}
    </Menu>
  );

  return (
    <React.Fragment>
      <TSelect<string>
        disabled={false}
        displayItem={(e: string) => e}
        className="column-menu-item"
        icon="add"
        filterItems={filterByName}
        inputItem={'Add a slice'}
        items={items as string[]}
        onChange={onChange}
        isMenuItem={true}
        popoverProps={{
          autoFocus: true,
          boundary: 'viewport',
          canEscapeKeyClose: true,
          lazy: true,
          position: Position.RIGHT_TOP,
          usePortal: true,
          interactionKind: PopoverInteractionKind.HOVER
        }}
        renderItem={renderMenuItem}
        renderList={renderSliceList}
      />
    </React.Fragment>
  );
};

export default AddSliceSelect;

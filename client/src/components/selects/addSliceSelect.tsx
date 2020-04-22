import * as React from 'react';
import { MenuItem, Position, Menu } from '@blueprintjs/core';
import {
  ItemPredicate,
  ItemRenderer,
  ItemListRenderer
} from '@blueprintjs/select';

import TSelect from './TSelect';

interface Props {
  inputItem?: string;
  items?: string[];
  onChange: any;
  popoverProps?: any;
}

const filterByName: ItemPredicate<string> = (query, sliceName: string) => {
  return sliceName.toLowerCase().indexOf(query.toLowerCase()) >= 0;
};

const AddSliceSelect = ({ inputItem, items, onChange }: Props) => {
  const renderMenuItem: ItemRenderer<string> = (
    sliceName: string,
    { handleClick }
  ) => <MenuItem key={sliceName} onClick={handleClick} text={sliceName} />;

  const renderExtensionList: ItemListRenderer<string> = ({
    itemsParentRef,
    renderItem,
    filteredItems
  }) => {
    const renderedItems = filteredItems.map(renderItem);
    return <Menu ulRef={itemsParentRef}>{renderedItems}</Menu>;
  };
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
          usePortal: true
        }}
        renderItem={renderMenuItem}
        renderList={renderExtensionList}
      />
    </React.Fragment>
  );
};

export default AddSliceSelect;

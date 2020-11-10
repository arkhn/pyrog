import * as React from 'react';
import { Intent, MenuItem, Position, Menu, PopoverInteractionKind } from '@blueprintjs/core';
import {
  ItemPredicate,
  ItemRenderer,
  ItemListRenderer
} from '@blueprintjs/select';
import { IconName } from '@blueprintjs/icons';

import UploadExtension from 'components/uploads/uploadExtension';
import TSelect from './TSelect';

interface Props {
  disabled?: boolean;
  icon?: IconName;
  inputItem?: Extension;
  intent?: Intent;
  items?: Extension[];
  loading?: boolean;
  onChange: any;
  popoverProps?: any;
}

interface Extension {
  id: string;
  name: string;
  type: string;
  publisher?: string;
}

const filterByName: ItemPredicate<Extension> = (query, resource: Extension) => {
  return resource.name.toLowerCase().indexOf(query.toLowerCase()) >= 0;
};

const sortAlphabetically = (
  item1: Extension,
  item2: Extension,
  first: string | undefined
): number => {
  if (item1.id === first) return -1;
  if (item2.id === first) return 1;

  const name1 = item1.name.toLowerCase();
  const name2 = item2.name.toLowerCase();

  if (name1 < name2) return -1;
  if (name1 > name2) return 1;
  return 0;
};

// If the second argument is provided, the sort funcion puts
// the resource which id matches on top of the list.
const sortItems = (
  extensions: Extension[],
  first: string | undefined = undefined
): Extension[] =>
  extensions.sort((e1, e2) => sortAlphabetically(e1, e2, first));

const AddExtensionSelect = ({
  disabled,
  icon,
  inputItem,
  intent,
  items,
  loading,
  onChange
}: Props) => {
  const [uploadExtensionOpen, setUploadExtensionOpen] = React.useState(false);

  const renderMenuItem: ItemRenderer<Extension> = (
    extension: Extension,
    { handleClick, modifiers, query }
  ) => {
    const publisher =
      extension.publisher && extension.publisher.length > 20
        ? `${extension.publisher?.substr(0, 20)}...`
        : extension.publisher;
    return (
      <MenuItem
        key={extension.id}
        onClick={handleClick}
        label={extension.id === extension.type ? 'Default' : publisher}
        text={
          <span>
            <strong>{extension.name}</strong>
          </span>
        }
      />
    );
  };

  const renderExtensionList: ItemListRenderer<Extension> = ({
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
            setUploadExtensionOpen(true);
          }}
          icon={'plus'}
          text={
            <span>
              <strong>Create new extension</strong>
            </span>
          }
        />
        {renderedItems}
      </Menu>
    );
  };
  return (
    <React.Fragment>
      <UploadExtension
        isOpen={uploadExtensionOpen}
        onClose={() => setUploadExtensionOpen(false)}
        onUpload={onChange}
      />
      <TSelect<Extension>
        disabled={false}
        displayItem={(e: Extension) => e.name}
        className="column-menu-item"
        icon="add"
        filterItems={filterByName}
        inputItem={inputItem || ({ name: 'Add an extension' } as Extension)}
        items={sortItems(items || []) as Extension[]}
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
        renderList={renderExtensionList}
      />
    </React.Fragment>
  );
};

export default AddExtensionSelect;

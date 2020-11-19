import * as React from 'react';
import { ResourceDefinition } from '@arkhn/fhir.ts';
import {
  MenuItem,
  Position,
  Menu,
  Spinner
} from '@blueprintjs/core';
import {
  ItemListRenderer,
  ItemPredicate,
  ItemRenderer
} from '@blueprintjs/select';

import TSelect from './TSelect';

interface Props {
  onChange: any;
  definition: ResourceDefinition;
  openUploadProfile: (r: ResourceDefinition) => void;
  fetchProfiles: (r: ResourceDefinition) => Promise<ResourceDefinition[]>
}

const sortItems = (definitions: ResourceDefinition[], first: string): ResourceDefinition[] =>
definitions.sort((d1: ResourceDefinition, d2: ResourceDefinition): number =>
  d1.id === first ? 1 : ( d2.id === first ? -1 : d1.name.localeCompare(d2.name))
);

const filterByName: ItemPredicate<ResourceDefinition> = (query, definition: ResourceDefinition) => {
  return definition.name.toLowerCase().indexOf(query.toLowerCase()) >= 0;
};

const AddProfileSelect = ({
  onChange,
  definition,
  openUploadProfile,
  fetchProfiles
}: Props) => {
  const [items, setItems] = React.useState(null as ResourceDefinition[] | null);
  const [doFetchProfiles, setDoFetchProfiles] = React.useState(false);

  const renderMenuItem: ItemRenderer<ResourceDefinition> = (
    definition: ResourceDefinition,
    { handleClick }
  ) => {
    const publisher =
      definition.publisher && definition.publisher.length > 20
        ? `${definition.publisher?.substr(0, 20)}...`
        : definition.publisher;
    return (
      <MenuItem
        key={definition.id}
        onClick={handleClick}
        label={definition.id === definition.type ? 'Default' : publisher}
        text={
          <span>
            <strong>{definition.name}</strong>
          </span>
        }
      />
    );
  };

  const renderProfileList = (
    definition: ResourceDefinition
  ): ItemListRenderer<ResourceDefinition> => ({
    itemsParentRef,
    renderItem,
    filteredItems
  }) => {
    const renderedItems = filteredItems.map(renderItem);
    return (
      <Menu ulRef={itemsParentRef}>
        <MenuItem
          onClick={() => openUploadProfile(definition)}
          icon={'plus'}
          text={
            <span>
              <strong>Create new profile</strong>
            </span>
          }
        />
        {doFetchProfiles && <Spinner/>}
        {renderedItems}
      </Menu>
    );
  };

  React.useEffect(() => {
    if (doFetchProfiles) {
      fetchProfiles(definition).then(definitions => {
        setItems(definitions);
      });
      setDoFetchProfiles(false);
    }
  },[doFetchProfiles, fetchProfiles, definition]);

  return (
    <div onClick={() => setDoFetchProfiles(true)}>
      <TSelect<ResourceDefinition>
        key={definition.id}
        disabled={false}
        displayItem={(p: ResourceDefinition) => p.name}
        className="column-menu-item"
        rightIcon="caret-right"
        filterItems={filterByName}
        inputItem={definition}
        items={sortItems(items || [], definition.id)}
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
        renderList={renderProfileList(definition)}
      />
    </div>
  );
};

export default AddProfileSelect;

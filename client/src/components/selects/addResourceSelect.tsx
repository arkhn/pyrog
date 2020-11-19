import * as React from 'react';
import {ResourceDefinition} from'@arkhn/fhir.ts'
import { Intent, Position } from '@blueprintjs/core';
import { ItemPredicate, ItemRenderer } from '@blueprintjs/select';
import { IconName } from '@blueprintjs/icons';

import UploadProfile from 'components/uploads/uploadProfile';
import TSelect from './TSelect';
import AddProfileSelect from './addProfileSelect';

interface Props {
  disabled?: boolean;
  icon?: IconName;
  inputItem?: ResourceDefinition;
  intent?: Intent;
  items?: ResourceDefinition[];
  loading?: boolean;
  onChange: any;
  popoverProps?: any;
  fetchProfiles: (r: ResourceDefinition) => Promise<ResourceDefinition[]>;
}

const filterByName: ItemPredicate<ResourceDefinition> = (query, definition: ResourceDefinition) => {
  return definition.name.toLowerCase().indexOf(query.toLowerCase()) >= 0;
};

const sortItems = (resources: ResourceDefinition[]): ResourceDefinition[] =>
resources.sort((r1: ResourceDefinition, r2: ResourceDefinition): number =>
  r1.name.localeCompare(r2.name)
);

const AddResourceSelect = ({
  disabled,
  icon,
  inputItem,
  intent,
  items,
  loading,
  onChange,
  fetchProfiles
}: Props) => {
  const [uploadProfileOpen, setUploadProfileOpen] = React.useState(
    undefined as ResourceDefinition | undefined
  );

  const renderItem: ItemRenderer<ResourceDefinition> = (definition: ResourceDefinition) => {
    return (
      <AddProfileSelect
        key={definition.id}
        definition={definition}
        onChange={onChange}
        fetchProfiles={fetchProfiles}
        openUploadProfile={((r: ResourceDefinition) => setUploadProfileOpen(r)) as any}
      />
    );
  };

  return (
    <React.Fragment>
      <UploadProfile
        isOpen={!!uploadProfileOpen}
        resource={uploadProfileOpen}
        onClose={() => setUploadProfileOpen(undefined)}
        onUpload={onChange}
      />
      <TSelect<ResourceDefinition>
        disabled={!!disabled}
        displayItem={(definition: ResourceDefinition) => definition.name}
        filterItems={filterByName}
        loading={loading}
        icon={icon}
        inputItem={inputItem || ({ name: 'Create a resource' } as ResourceDefinition)}
        intent={intent}
        items={sortItems(items || []) as ResourceDefinition[]}
        onChange={onChange}
        popoverProps={{
          autoFocus: true,
          boundary: 'viewport',
          canEscapeKeyClose: true,
          lazy: true,
          position: Position.RIGHT_TOP,
          usePortal: true
        }}
        renderItem={renderItem}
      />
    </React.Fragment>
  );
};

export default AddResourceSelect;

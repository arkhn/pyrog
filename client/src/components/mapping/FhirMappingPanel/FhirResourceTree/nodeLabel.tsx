import React from 'react';
import { Menu, MenuItem, ContextMenu, Tooltip } from '@blueprintjs/core';
import { Attribute, ResourceDefinition } from '@arkhn/fhir.ts';

import AddExtensionSelect from 'components/selects/addExtensionSelect';
import AddSliceSelect from 'components/selects/addSliceSelect';
import { ApolloProvider, useApolloClient } from 'react-apollo';

interface NodeLabelProps {
  attribute: Attribute;
  resourceExtensions: ResourceDefinition[];
  addNodeCallback: any;
  addSliceCallback: any;
  addExtensionCallback: any;
  deleteNodeCallback: any;
}

export const NodeLabel = ({
  attribute: {
    types,
    definition,
    id,
    isArray,
    isItem,
    isSlice,
    slices,
    extensions,
    parent,
    isExtension
  },
  resourceExtensions,
  addNodeCallback,
  addSliceCallback,
  addExtensionCallback,
  deleteNodeCallback
}: NodeLabelProps): React.ReactElement => {
  const client = useApolloClient();

  const renderAddItem = () => (
    <MenuItem icon={'add'} onClick={addNodeCallback} text={'Ajouter un item'} />
  );

  const renderAddSlice = () => {
    const sliceNames = slices
      .map(s => s.definition.sliceName)
      .filter(Boolean) as string[];
    return (
      <AddSliceSelect
        items={[...sliceNames]}
        onChange={(selected: string): void =>
          selected === id ? addNodeCallback() : addSliceCallback(selected)
        }
        baseName={id}
      />
    );
  };

  const renderAddExtension = (selectedExtensions?: ResourceDefinition[]) => (
    <AddExtensionSelect
      loading={false}
      disabled={false}
      items={selectedExtensions}
      onChange={addExtensionCallback}
    />
  );

  const renderRemoveItem = () => (
    <MenuItem
      icon={'delete'}
      onClick={deleteNodeCallback}
      text={`Supprimer ${isSlice ? 'la slice' : "l'item"}`}
    />
  );

  const showContextMenu = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const hasAllowedExtensions =
      !isArray && !!extensions && extensions.length > 0;
    const isRootExtensions = !parent && isExtension;

    const menu = (
      <ApolloProvider client={client}>
        <Menu>
          {isArray && !isExtension && slices.length === 0 && renderAddItem()}
          {isArray && slices.length > 0 && renderAddSlice()}
          {isItem && renderRemoveItem()}
          {hasAllowedExtensions && renderAddExtension(extensions)}
          {isRootExtensions && renderAddExtension(resourceExtensions)}
        </Menu>
      </ApolloProvider>
    );

    if (
      (isArray && !isExtension) ||
      (isArray && slices.length > 0) ||
      isItem ||
      hasAllowedExtensions ||
      isRootExtensions
    ) {
      ContextMenu.show(menu, { left: e.clientX, top: e.clientY });
    }
  };

  const label = (
    <div className={'node-label'} onContextMenu={showContextMenu}>
      <div>{id}</div>
      <div className={'node-type'}>{types.join(' | ')}</div>
    </div>
  );

  if (!definition.definition) return label;
  return (
    <Tooltip boundary={'viewport'} content={definition.definition}>
      {label}
    </Tooltip>
  );
};

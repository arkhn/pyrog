import React from 'react';
import { Menu, MenuItem, ContextMenu, Tooltip } from '@blueprintjs/core';
import { Attribute } from '@arkhn/fhir.ts';

interface NodeLabelProps {
  attribute: Attribute;
  addNodeCallback: any;
  deleteNodeCallback: any;
}

export const NodeLabel = ({
  attribute: { types, definition, id, isArray, isItem },
  addNodeCallback,
  deleteNodeCallback
}: NodeLabelProps) => {
  const showContextMenu = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const menu = isArray ? (
      <Menu>
        <MenuItem
          icon={'add'}
          onClick={addNodeCallback}
          text={'Ajouter un item'}
        />
      </Menu>
    ) : isItem ? (
      <Menu>
        <MenuItem
          icon={'delete'}
          onClick={deleteNodeCallback}
          text={"Supprimer l'item"}
        />
      </Menu>
    ) : null;

    if (menu) {
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

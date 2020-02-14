import React from 'react';
import { Menu, MenuItem, ContextMenu } from '@blueprintjs/core';

interface NodeLabelProps {
  name: string;
  type: any;
  addNodeCallback: any;
  deleteNodeCallback: any;
}

export const NodeLabel = ({
  name,
  type,
  addNodeCallback,
  deleteNodeCallback
}: NodeLabelProps) => {
  const showContextMenu = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const menu = addNodeCallback ? (
      <Menu>
        <MenuItem
          icon={'add'}
          onClick={addNodeCallback}
          text={'Ajouter un item'}
        />
      </Menu>
    ) : deleteNodeCallback ? (
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

  // TODO what if several types?
  return (
    <div className={'node-label'} onContextMenu={showContextMenu}>
      <div>{name}</div>
      <div className={'node-type'}>{type}</div>
    </div>
  );
};

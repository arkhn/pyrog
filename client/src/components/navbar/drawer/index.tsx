import { Classes, Drawer as BPDrawer } from '@blueprintjs/core';
import * as React from 'react';

import UpdateDatabaseCredentials from 'components/database/update';

import './style.scss';

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const Drawer = ({ title, isOpen, onClose }: Props): React.ReactElement => {
  return (
    <BPDrawer
      className="drawer"
      icon="properties"
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      size={BPDrawer.SIZE_SMALL}
    >
      <div className={Classes.DRAWER_BODY}>
        <UpdateDatabaseCredentials />
      </div>
    </BPDrawer>
  );
};

export default Drawer;

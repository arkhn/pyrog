import {
  Alignment,
  Button,
  Menu,
  MenuItem,
  Navbar as BPNavbar,
  Popover,
  Position
} from '@blueprintjs/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useReactRouter from 'use-react-router';

import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/react-hooks';

import Drawer from './drawer';
import Header from './header';

import { logout } from 'services/user/actions';

import { IReduxStore } from 'types';
import { AUTH_TOKEN } from '../../constants';

import './style.scss';
import { deselectSource } from 'services/selectedNode/actions';

interface Props {
  exportMapping?: (includeComments?: boolean) => void;
}

// Graphql
const meQuery = loader('src/graphql/queries/me.graphql');

const Navbar = ({ exportMapping }: Props) => {
  const { history } = useReactRouter();
  const dispatch = useDispatch();
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const user = useSelector((state: IReduxStore) => state.user);

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = React.useState(false);

  const { data } = useQuery(meQuery);
  const isAdmin = data && data.me.role === 'ADMIN';

  const renderExportMenu = (
    <Menu>
      <MenuItem
        text="Export without comments"
        onClick={() => exportMapping!(false)}
      />
    </Menu>
  );

  const renderSourceContext = () => {
    return (
      <BPNavbar.Group align={Alignment.LEFT}>
        <BPNavbar.Divider />
        {selectedNode.source.name}
        <BPNavbar.Divider />
        <Button
          icon="more"
          minimal={true}
          onClick={() => setIsDrawerOpen(true)}
          text="Database"
        />
        <Button
          icon="export"
          minimal={true}
          onClick={() => exportMapping!()}
          text="Export mapping"
        >
          <Popover
            content={renderExportMenu}
            position={Position.BOTTOM_RIGHT}
            isOpen={isExportMenuOpen}
            onInteraction={(
              nextOpenState: boolean,
              e?: React.SyntheticEvent<HTMLElement>
            ): void => {
              setIsExportMenuOpen(nextOpenState);
              e?.stopPropagation();
            }}
          >
            <Button icon="caret-down" minimal={true} />
          </Popover>
        </Button>
        {isAdmin && (
          <Button
            icon="flame"
            minimal={true}
            onClick={() => {
              history.push('/fhirpipe');
            }}
            text="Run fhir-pipe"
          />
        )}
        <Drawer
          title={selectedNode.source ? selectedNode.source.name : ''}
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
          }}
        />
      </BPNavbar.Group>
    );
  };

  return (
    <BPNavbar id="navbar" className="bp3-dark">
      <BPNavbar.Group align={Alignment.LEFT}>
        <BPNavbar.Heading
          onClick={() => {
            dispatch(deselectSource());
            history.push('/');
          }}
        >
          <img src="arkhn_logo_only_white.svg" alt="Arkhn" />
          <h2>PYROG</h2>
        </BPNavbar.Heading>
        <Header />
      </BPNavbar.Group>

      {selectedNode.source && renderSourceContext()}

      {user.id && (
        <BPNavbar.Group align={Alignment.RIGHT}>
          {user.name}
          <BPNavbar.Divider />
          <Button
            className="bp3-minimal"
            icon="log-out"
            onClick={() => {
              localStorage.removeItem(AUTH_TOKEN);
              dispatch(logout());
              history.push('/login');
            }}
            text="Se déconnecter"
          />
        </BPNavbar.Group>
      )}
    </BPNavbar>
  );
};

export default Navbar;

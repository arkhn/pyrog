import { Alignment, Button, Navbar as BPNavbar } from '@blueprintjs/core';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useReactRouter from 'use-react-router';

import Drawer from './drawer';
import Header from './header';

import { logout } from 'services/user/actions';

import { IReduxStore } from 'types';
import { AUTH_TOKEN } from '../../constants';

import './style.scss';

// Logo

const Navbar = () => {
  const dispatch = useDispatch();
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const user = useSelector((state: IReduxStore) => state.user);
  const { history } = useReactRouter();
  const [drawerIsOpen, setDrawerIsOpen] = React.useState(false);

  return (
    <BPNavbar id="navbar" className="bp3-dark">
      <BPNavbar.Group align={Alignment.LEFT}>
        <BPNavbar.Heading
          onClick={() => {
            history.push('/');
          }}
        >
          <img src="arkhn_logo_only_white.svg" alt="Arkhn" />
          <h2>PYROG</h2>
        </BPNavbar.Heading>
        <Header
          openDrawer={() => {
            setDrawerIsOpen(true);
          }}
        />
      </BPNavbar.Group>

      {selectedNode.source.id && (
        <Drawer
          title={selectedNode.source ? selectedNode.source.name : ''}
          isOpen={drawerIsOpen}
          onClose={() => {
            setDrawerIsOpen(false);
          }}
        />
      )}

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

import { useApolloClient } from '@apollo/react-hooks';
import {
  Alignment,
  Button,
  Navbar as BPNavbar,
  Spinner
} from '@blueprintjs/core';
import * as QueryString from 'query-string';
import * as React from 'react';
import { Query } from 'react-apollo';
import { useDispatch, useSelector } from 'react-redux';
import useReactRouter from 'use-react-router';

import Drawer from './components/Drawer';
import Header from './components/Header';

import { changeNode } from '../../services/selectedNode/actions';
import { login, logout } from '../../services/user/actions';

import { IReduxStore, IView } from '../../types';

import './style.less';

// Logo
const arkhnLogoWhite = require('../../assets/img/arkhn_logo_only_white.svg');

// Graphql
const me = require('../../graphql/queries/me.graphql');

const Navbar = () => {
  const client = useApolloClient();
  const dispatch = useDispatch();
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const user = useSelector((state: IReduxStore) => state.user);
  const { history, location } = useReactRouter();
  const [drawerIsOpen, setDrawerIsOpen] = React.useState(false);

  React.useEffect(() => {
    // Check if user is authentified and redirect accordingly.
    client
      .query({
        query: me,
        // This query should not use the cache,
        // or else users can't log in and out.
        fetchPolicy: 'network-only'
      })
      .then((response: any) => {
        if (response.data.me) {
          if (location.pathname == '/mapping' && !selectedNode.source.id) {
            // Load arguments given through our URL...
            const args = QueryString.parse(location.search);

            // and update redux state accordingly.
            dispatch(
              changeNode(args.sourceId, args.resourceId, args.attributeId)
            );
          }
          if (['/', '/signin'].indexOf(location.pathname) >= 0) {
            history.push('/sources');
          }
        } else if (location.pathname != '/signin') {
          history.push('/signin');
        }
      })
      .catch((error: any) => {
        console.log(error);
        throw new Error(error);
      });
  }, [dispatch]);

  return (
    <BPNavbar id="navbar" className="bp3-dark">
      <BPNavbar.Group align={Alignment.LEFT}>
        <BPNavbar.Heading
          onClick={() => {
            history.push('/');
          }}
        >
          <span dangerouslySetInnerHTML={{ __html: arkhnLogoWhite }} />
          <h2>PYROG</h2>
        </BPNavbar.Heading>
        <Header
          openDrawer={() => {
            setDrawerIsOpen(true);
          }}
        />
      </BPNavbar.Group>

      <Drawer
        title={
          selectedNode && selectedNode.source.name
            ? selectedNode.source.name
            : ''
        }
        isOpen={drawerIsOpen}
        onClose={() => {
          setDrawerIsOpen(false);
        }}
      />

      <Query
        onCompleted={(data: any) => {
          if (data && data.me && user.id === null) {
            dispatch(login(data.me.id, data.me.name, data.me.email));
          }
        }}
        query={me}
        skip={user.id !== null}
      >
        {({ data, loading }: any) => {
          return loading ? (
            <BPNavbar.Group align={Alignment.RIGHT}>
              <Spinner size={15} />
            </BPNavbar.Group>
          ) : user.id ? (
            <BPNavbar.Group align={Alignment.RIGHT}>
              {user.name}
              <BPNavbar.Divider />
              <Button
                className="bp3-minimal"
                icon="log-out"
                onClick={() => {
                  localStorage.removeItem(process.env.AUTH_TOKEN);
                  dispatch(logout());
                  history.push('/signin');
                }}
                text="Se déconnecter"
              />
            </BPNavbar.Group>
          ) : null;
        }}
      </Query>
    </BPNavbar>
  );
};

export default Navbar;

import {
  Alignment,
  Button,
  Divider,
  Menu,
  MenuItem,
  Navbar as BPNavbar,
  Popover,
  Position,
  Icon
} from '@blueprintjs/core';
import React from 'react';
import { useMutation } from 'react-apollo';
import { useDispatch, useSelector } from 'react-redux';
import useReactRouter from 'use-react-router';
import { loader } from 'graphql.macro';
import { useApolloClient } from '@apollo/react-hooks';

import Drawer from './drawer';
import Header from './header';

import { logout as logoutAction } from 'services/user/actions';
import { deselectSource } from 'services/selectedNode/actions';
import { getIdToken, removeTokens, revokeToken } from 'oauth/tokenManager';
import { IReduxStore } from 'types';
import { LOGOUT_URL, LOGOUT_REDIRECT_URL } from '../../constants';

import './style.scss';

interface Props {
  exportMapping?: (includeComments?: boolean) => void;
  exportAdditionalResource?: (
    conceptMapIds: string[],
    profileIds: string[]
  ) => void;
}

// Graphql
const qUsedConceptMapIds = loader(
  'src/graphql/queries/usedConceptMapIds.graphql'
);
const qUsedProfileIds = loader('src/graphql/queries/usedProfileIds.graphql');
const mLogout = loader('src/graphql/mutations/logout.graphql');

const Navbar = ({ exportMapping, exportAdditionalResource }: Props) => {
  const { history } = useReactRouter();
  const client = useApolloClient();
  const dispatch = useDispatch();
  const { source } = useSelector((state: IReduxStore) => state.selectedNode);
  const user = useSelector((state: IReduxStore) => state.user);

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = React.useState(false);
  const [exportComments, setExportComments] = React.useState(false);
  const [exportConceptMaps, setExportConceptMaps] = React.useState(false);
  const [exportProfiles, setExportProfiles] = React.useState(false);

  const [logout] = useMutation(mLogout);

  const isAdmin = user && user.role === 'ADMIN';
  const isWriter =
    source &&
    source.accessControls.filter(
      acl => acl.role === 'WRITER' && acl.user.id === user.id
    ).length > 0;

  const customExport = async () => {
    exportMapping!(exportComments);

    let conceptMapsToFetch = [];
    if (exportConceptMaps) {
      const { data } = await client.query({
        query: qUsedConceptMapIds,
        variables: {
          sourceId: source.id
        },
        fetchPolicy: 'network-only'
      });
      conceptMapsToFetch = data.source.usedConceptMapIds;
    }

    let profilesToFetch = [];
    if (exportProfiles) {
      const { data } = await client.query({
        query: qUsedProfileIds,
        variables: {
          sourceId: source.id
        },
        fetchPolicy: 'network-only'
      });
      profilesToFetch = data.source.usedProfileIds;
    }

    exportAdditionalResource!(conceptMapsToFetch, profilesToFetch);
  };

  const exportMenuItem = (text: string, stateGetter: any, stateSetter: any) => (
    <MenuItem
      text={
        <div>
          <input
            type="checkbox"
            checked={stateGetter}
            onChange={() => stateSetter(!stateGetter)}
            onClick={e => {
              e.stopPropagation();
              stateSetter(!stateGetter);
            }}
          />
          {text}
        </div>
      }
      onClick={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
        stateSetter(!stateGetter);
      }}
    />
  );

  const renderExportMenu = (
    <Menu>
      {exportMenuItem('Comments', exportComments, setExportComments)}
      {exportMenuItem('Concept maps', exportConceptMaps, setExportConceptMaps)}
      {exportMenuItem('Profiles', exportProfiles, setExportProfiles)}
      <Divider />
      <MenuItem text="Export" onClick={() => customExport()} />
    </Menu>
  );

  const renderSourceContext = () => {
    return (
      <BPNavbar.Group align={Alignment.LEFT}>
        <BPNavbar.Divider />
        {source.name}
        {(isAdmin || isWriter) && (
          <React.Fragment>
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
                <Icon className="icon-caret-down" icon="caret-down" />
              </Popover>
            </Button>
          </React.Fragment>
        )}
        {isAdmin && (
          <Button
            icon="flame"
            minimal={true}
            onClick={() => {
              history.push('/fhir-river');
            }}
            text="ETL Pipeline"
          />
        )}
        <Drawer
          title={source ? source.name : ''}
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

      {source && renderSourceContext()}

      {user.id && (
        <BPNavbar.Group align={Alignment.RIGHT}>
          {user.name}
          <BPNavbar.Divider />
          <Button
            className="bp3-minimal"
            icon="log-out"
            onClick={() => {
              const idToken = getIdToken();
              if (!idToken)
                throw new Error("Can't logout, id token not found.");
              const logoutUrl = `${LOGOUT_URL}?id_token_hint=${idToken}&post_logout_redirect_uri=${LOGOUT_REDIRECT_URL}`;
              revokeToken();
              removeTokens();
              logout();
              dispatch(logoutAction());
              dispatch(deselectSource());
              window.location.assign(logoutUrl);
            }}
            text="Se déconnecter"
          />
        </BPNavbar.Group>
      )}
    </BPNavbar>
  );
};

export default Navbar;

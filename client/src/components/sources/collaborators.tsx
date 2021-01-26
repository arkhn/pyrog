import React from 'react';
import {
  Dialog,
  HTMLTable,
  Button,
  Intent,
  InputGroup
} from '@blueprintjs/core';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';
import { useSnackbar } from 'notistack';

import { ISelectedSource, IAccessControl } from 'types';
import StringSelect from 'components/selects/stringSelect';

interface Props {
  isOpen: boolean;
  onClose: Function;
  onUpdate: (cache: any, source: ISelectedSource) => void;
  source: ISelectedSource;
}

const meQuery = loader('src/graphql/queries/me.graphql');
const mCreatePermission = loader(
  'src/graphql/mutations/createPermission.graphql'
);
const mDeletePermission = loader(
  'src/graphql/mutations/deletePermission.graphql'
);

export const CollaboratorsDialog = ({
  source,
  onClose,
  onUpdate,
  isOpen
}: Props): React.ReactElement => {
  const { data, loading } = useQuery(meQuery);
  const { enqueueSnackbar } = useSnackbar();
  const [role, setRole] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [creatingPermission, setCreatingPermission] = React.useState(false);
  const [removingCollaborator, setRemovingCollaborator] = React.useState('');
  const client = useApolloClient();

  const renderAclRow = (acl: IAccessControl) => (
    <tr key={acl.id} className="collaboratorsRow">
      <td>{acl.user.email}</td>
      <td>{acl.role}</td>
      {acl.user.id !== data.me.id && (
        <td>
          <Button
            icon={'delete'}
            loading={removingCollaborator === acl.id}
            minimal={true}
            intent={Intent.DANGER}
            onClick={async () => {
              setRemovingCollaborator(acl.id);
              try {
                await client.mutate({
                  mutation: mDeletePermission,
                  update: removeCollaborator,
                  variables: {
                    accessControlId: acl.id
                  }
                });
              } catch (err) {
                enqueueSnackbar(
                  `Could not remove collaborator from source: ${err}`,
                  { variant: 'error' }
                );
              }
              setRemovingCollaborator('');
            }}
          >
            Remove collaborator
          </Button>
        </td>
      )}
    </tr>
  );

  const addCollaboratorRow = () => {
    return (
      <tr key="new" className="collaboratorsRow">
        <td>
          <InputGroup
            value={email}
            onChange={(event: any): void => {
              setEmail(event.target.value);
            }}
            placeholder="User email"
          />
        </td>
        <td>
          <StringSelect
            filterable={false}
            items={['WRITER', 'READER']}
            inputItem={role!}
            onChange={(item: string): void => {
              setRole(item);
            }}
          />
        </td>
        <td>
          <Button
            icon="plus"
            loading={creatingPermission}
            minimal={true}
            disabled={!email || !role}
            intent={Intent.SUCCESS}
            onClick={async (e: React.MouseEvent) => {
              setCreatingPermission(true);
              try {
                await client.mutate({
                  mutation: mCreatePermission,
                  update: addCollaborator,
                  variables: {
                    userEmail: email,
                    sourceId: source.id,
                    role
                  }
                });
                setRole('');
                setEmail('');
              } catch (err) {
                enqueueSnackbar(
                  `Could not add collaborator for source: ${err}`,
                  { variant: 'error' }
                );
              }
              setCreatingPermission(false);
            }}
          />
        </td>
      </tr>
    );
  };

  const addCollaborator = (
    cache: any,
    {
      data: {
        createAccessControl: { id, role, user, __typename }
      }
    }: any
  ): void =>
    onUpdate(cache, {
      ...source,
      accessControls: [...source.accessControls, { id, role, user, __typename }]
    });

  const removeCollaborator = (
    cache: any,
    { data: { deleteAccessControl } }: any
  ): void =>
    onUpdate(cache, {
      ...source,
      accessControls: source.accessControls.filter(
        acl => acl.id !== deleteAccessControl.id
      )
    });

  return !data || loading ? (
    <></>
  ) : (
    <Dialog
      className="collaboratorsTable"
      isOpen={isOpen}
      title={`Manage collaborators of ${source.template.name} - ${source.name}`}
      onClose={() => onClose()}
    >
      <HTMLTable>
        <thead>
          <tr>
            <th className="head-col">User</th>
            <th className="source-col">role</th>
          </tr>
        </thead>
        <tbody>
          {[...source.accessControls.map(renderAclRow), addCollaboratorRow()]}
        </tbody>
      </HTMLTable>
    </Dialog>
  );
};

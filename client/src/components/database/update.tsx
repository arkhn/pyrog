import {
  Button,
  Classes,
  H3,
  Icon,
  InputGroup,
  FormGroup,
  Spinner
} from '@blueprintjs/core';
import * as React from 'react';
import { useQuery, useMutation } from 'react-apollo';
import { useSelector, useDispatch } from 'react-redux';
import { loader } from 'graphql.macro';

import StringSelect from 'components/selects/stringSelect';
import { onError } from 'services/apollo';
import { IReduxStore, Owner } from 'types';
import { updateSelectedSource } from 'services/selectedNode/actions';
import { PAGAI_URL } from '../../constants';
import axios from 'axios';
import StringMultiSelect from 'components/selects/stringMultiSelect';

const qCredentialForSource = loader(
  'src/graphql/queries/credentialForSource.graphql'
);
const mUpsertCredential = loader(
  'src/graphql/mutations/upsertCredential.graphql'
);

const UpdateDatabaseCredentials = (): React.ReactElement => {
  const models = ['POSTGRES', 'ORACLE', 'MSSQL'];

  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);

  const dispatch = useDispatch();
  const [host, setHost] = React.useState('');
  const [port, setPort] = React.useState('');
  const [login, setLogin] = React.useState('');
  const [owners, setOwners] = React.useState([] as string[]);
  const [password, setPassword] = React.useState('');
  const [database, setDatabase] = React.useState('');
  const [model, setModel] = React.useState(models[0]);
  const [hasChanged, setHasChanged] = React.useState(false);
  const [hasSuccessfullyChanged, setHasSuccessfullyChanged] = React.useState(
    false
  );

  const [availableOwners, setAvailableOwners] = React.useState(
    null as string[] | null
  );

  const { data, loading } = useQuery(qCredentialForSource, {
    skip: !selectedNode.source,
    variables: {
      sourceId: selectedNode.source?.id
    }
  });

  const fetchAvailableOwners = async (credentials: {
    model: string;
    host: string;
    port: string;
    database: string;
    login: string;
    password: string;
  }) => {
    try {
      const { data } = await axios.post(`${PAGAI_URL}/get_owners`, credentials);
      setAvailableOwners(data);
    } catch (err) {
      setAvailableOwners(null);
      toaster.show({
        message: `Could not fetch available database owners: ${
          err.response ? err.response.data.error : err.message
        }`,
        intent: 'danger',
        icon: 'warning-sign',
        timeout: 5000
      });
    }
  };

  const onUpsertCompleted = (data: any) => {
    setHasChanged(false);
    setHasSuccessfullyChanged(true);
    fetchAvailableOwners({ model, host, port, database, login, password });
    dispatch(
      updateSelectedSource({
        ...selectedNode.source,
        credential: {
          ...data.upsertCredential
        }
      })
    );
  };

  const [upsertCredential] = useMutation(mUpsertCredential, {
    onCompleted: onUpsertCompleted,
    onError: onError(toaster)
  });

  const handleOwnerSelect = (owner: string): void => {
    if (!owners.includes(owner)) {
      setOwners([...owners, owner]);
    } else {
      owners.splice(owners.indexOf(owner), 1);
      setOwners([...owners]);
    }
  };

  const handleTagRemove = (_value: string, index: number): void => {
    owners.splice(index, 1);
    setOwners([...owners]);
  };

  React.useEffect(() => {
    if (!loading && data && data.source && data.source.credential) {
      const {
        host,
        port,
        login,
        owners,
        decryptedPassword: password,
        database,
        model
      } = data.source.credential;
      setHost(host);
      setPort(port);
      setLogin(login);
      setOwners(owners.map((o: Owner) => o.name));
      setPassword(password);
      setDatabase(database);
      setModel(model);
    }
  }, [loading, selectedNode, data]);

  React.useEffect(() => {
    if (
      !availableOwners &&
      host &&
      port &&
      database &&
      login &&
      password &&
      model
    ) {
      fetchAvailableOwners({ model, host, port, database, login, password });
    }
  });

  return (
    <div className={Classes.DIALOG_BODY}>
      <H3 className="inline-title">
        <span>Database credentials</span>
        <span>{loading && <Spinner size={15} />}</span>
      </H3>
      <form
        onSubmit={(e: any): void => {
          e.preventDefault();
          upsertCredential({
            variables: {
              host,
              port,
              login,
              database,
              owners,
              password,
              model,
              sourceId: selectedNode.source.id
            }
          });
        }}
      >
        <FormGroup label="Host">
          <InputGroup
            value={host}
            disabled={loading}
            leftIcon={'desktop'}
            onChange={(event: any): void => {
              setHost(event.target.value);
              setHasChanged(true);
            }}
            placeholder={'Host'}
          />
        </FormGroup>
        <FormGroup label="Port">
          <InputGroup
            value={port}
            disabled={loading}
            leftIcon={'numerical'}
            onChange={(event: any): void => {
              setPort(event.target.value);
              setHasChanged(true);
            }}
            placeholder={'Port'}
          />
        </FormGroup>
        <FormGroup label="Database name">
          <InputGroup
            value={database}
            disabled={loading}
            leftIcon={'database'}
            onChange={(event: any): void => {
              setDatabase(event.target.value);
              setHasChanged(true);
            }}
            placeholder={'Database name'}
          />
        </FormGroup>
        <FormGroup label="Login">
          <InputGroup
            value={login}
            disabled={loading}
            leftIcon={'user'}
            onChange={(event: any): void => {
              setLogin(event.target.value);
              setHasChanged(true);
            }}
            placeholder={'Login'}
          />
        </FormGroup>
        <FormGroup label="Password">
          <InputGroup
            value={password}
            disabled={loading}
            leftIcon={'key'}
            onChange={(event: any): void => {
              setPassword(event.target.value);
              setHasChanged(true);
            }}
            placeholder={'Password'}
            type={'password'}
          />
        </FormGroup>
        <FormGroup label="Owners">
          <StringMultiSelect
            items={availableOwners || []}
            selectedItems={owners}
            onItemSelect={(item: string): void => {
              setHasChanged(true);
              handleOwnerSelect(item);
            }}
            onRemoveTag={handleTagRemove}
          />
        </FormGroup>
        <FormGroup label="Type">
          <StringSelect
            filterable={false}
            items={models}
            disabled={loading}
            inputItem={model}
            onChange={(item: string): void => {
              setHasChanged(true);
              setModel(item);
            }}
          />
        </FormGroup>
        <Button
          intent={hasSuccessfullyChanged && !hasChanged ? 'success' : 'primary'}
          disabled={(hasSuccessfullyChanged && !hasChanged) || !hasChanged}
          loading={loading}
          icon={
            hasSuccessfullyChanged &&
            !hasChanged && <Icon intent={'success'} icon={'tick'} />
          }
          type={'submit'}
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default UpdateDatabaseCredentials;

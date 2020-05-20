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
import { IReduxStore } from 'types';
import { updateSelectedSource } from 'services/selectedNode/actions';
import { PAGAI_URL } from '../../constants';
import axios from 'axios';

import './style.scss';

const mUpsertCredential = loader(
  'src/graphql/mutations/upsertCredential.graphql'
);

const NewDatabaseCredentials = (): React.ReactElement => {
  const models = ['POSTGRES', 'ORACLE'];

  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);

  const dispatch = useDispatch();
  const [host, setHost] = React.useState('');
  const [port, setPort] = React.useState('');
  const [login, setLogin] = React.useState('');
  const [owner, setOwner] = React.useState('');
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

  const fetchAvailableOwners = async (credentials: {
    model: string;
    host: string;
    port: string;
    database: string;
    login: string;
    password: string;
  }) => {
    // Fetch concept maps
    try {
      const { data } = await axios.post(`${PAGAI_URL}/get_owners`, credentials);
      setAvailableOwners(data.owners);
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
        credential: data.upsertCredential
      })
    );
  };

  const submitCredentials = async () => {
    await upsertCredential({
      variables: {
        host,
        port,
        login,
        database,
        owner,
        password,
        model,
        sourceId: selectedNode.source.id
      }
    });
  };

  const [upsertCredential] = useMutation(mUpsertCredential, {
    onCompleted: onUpsertCompleted,
    onError: onError(toaster)
  });

  return (
    <>
      <h1>Database Credentials</h1>
      <div>
        <FormGroup label="Host">
          <InputGroup
            value={host}
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
            leftIcon={'key'}
            onChange={(event: any): void => {
              setPassword(event.target.value);
              setHasChanged(true);
            }}
            placeholder={'Password'}
            type={'password'}
          />
        </FormGroup>
        <FormGroup label="Owner">
          <StringSelect
            filterable={false}
            items={availableOwners || []}
            disabled={!availableOwners}
            inputItem={owner}
            onChange={(item: string): void => {
              setHasChanged(true);
              setOwner(item);
            }}
          />
        </FormGroup>
        <FormGroup label="Type">
          <StringSelect
            filterable={false}
            items={models}
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
          icon={
            hasSuccessfullyChanged &&
            !hasChanged && <Icon intent={'success'} icon={'tick'} />
          }
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default NewDatabaseCredentials;

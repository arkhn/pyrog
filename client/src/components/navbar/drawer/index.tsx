import {
  Button,
  Classes,
  Drawer as BPDrawer,
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
import './style.scss';
import { updateSelectedSource } from 'services/selectedNode/actions';

const qCredentialForSource = loader(
  'src/graphql/queries/credentialForSource.graphql'
);
const mUpsertCredential = loader(
  'src/graphql/mutations/upsertCredential.graphql'
);

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const Drawer = ({ title, isOpen, onClose }: Props): React.ReactElement => {
  const models = ['POSTGRES', 'ORACLE'];

  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);

  const dispatch = useDispatch();
  const [host, setHost] = React.useState('');
  const [port, setPort] = React.useState('');
  const [login, setLogin] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [database, setDatabase] = React.useState('');
  const [model, setModel] = React.useState(models[0]);
  const [hasChanged, setHasChanged] = React.useState(false);
  const [hasSuccessfullyChanged, setHasSuccessfullyChanged] = React.useState(
    false
  );

  const { data, loading } = useQuery(qCredentialForSource, {
    variables: {
      sourceId: selectedNode.source.id
    }
  });

  const onUpsertCompleted = (data: any) => {
    setHasChanged(false);
    setHasSuccessfullyChanged(true);
    dispatch(
      updateSelectedSource({
        ...selectedNode.source,
        credential: data.upsertCredential
      })
    );
  };

  const [upsertCredential] = useMutation(mUpsertCredential, {
    onCompleted: onUpsertCompleted,
    onError: onError(toaster)
  });

  React.useEffect(() => {
    if (!loading && data && data.source && data.source.credential) {
      const c = data.source.credential;
      setHost(c.host);
      setPort(c.port);
      setLogin(c.login);
      setPassword(c.password);
      setDatabase(c.database);
    }
  }, [loading, selectedNode, data]);

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
              intent={
                hasSuccessfullyChanged && !hasChanged ? 'success' : 'primary'
              }
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
      </div>
    </BPDrawer>
  );
};

export default Drawer;

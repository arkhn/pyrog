import {
  Button,
  Card,
  ControlGroup,
  Elevation,
  InputGroup,
  Position
} from '@blueprintjs/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';
import { ResourceDefinition } from '@arkhn/fhir.ts';

import { onError as onApolloError } from 'services/apollo';
import { IInput, IReduxStore } from 'types';

import StringSelect from 'components/selects/stringSelect';
import IdentifierSystemInput from './IdentifierSystemInput';

// GRAPHQL
const qSourcesAndResources = loader(
  'src/graphql/queries/sourcesAndResources.graphql'
);
const mCreateStaticInput = loader(
  'src/graphql/mutations/createStaticInput.graphql'
);
const mUpdateStaticInput = loader(
  'src/graphql/mutations/updateStaticInput.graphql'
);
const mDeleteInput = loader('src/graphql/mutations/deleteInput.graphql');

interface Props {
  input: IInput;
}

const InputStatic = ({ input }: Props): React.ReactElement => {
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const onError = onApolloError(toaster);

  const { attribute } = useSelector((state: IReduxStore) => state.selectedNode);
  const { availableResources } = useSelector(
    (state: IReduxStore) => state.fhir
  );

  const [staticValue, setStaticValue] = useState(input.staticValue);

  const { data: dataSources } = useQuery(qSourcesAndResources, {
    fetchPolicy: 'no-cache'
  });
  const [deleteInput, { loading: loadDelInput }] = useMutation(mDeleteInput, {
    onError
  });

  const onClickDelete = () => {
    // Mutation to remove from DB
    deleteInput({
      variables: {
        inputGroupId: input.inputGroupId,
        inputId: input.id
      }
    });
  };

  const sources = dataSources ? dataSources.sources : [];

  useEffect(() => {
    // TODO we should use attribute.isReferenceType here but Attribute objects
    // lose their accessors in Redux
    if (attribute.definition.id === 'Reference.type') {
      setStaticValue('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attribute]);

  useEffect(() => {
    setStaticValue(input.staticValue);
  }, [input]);

  const [
    createStaticInput,
    { loading: creatingStaticInput }
  ] = useMutation(mCreateStaticInput, { onError });
  const [updateStaticInput] = useMutation(mUpdateStaticInput, { onError });

  const addStaticValue = async (value: string): Promise<void> => {
    createStaticInput({
      variables: {
        inputGroupId: input.inputGroupId,
        staticValue: value
      }
    });
  };

  const renderReferenceTypeDropDown = (): React.ReactElement => (
    <React.Fragment>
      <StringSelect
        items={availableResources.map((t: ResourceDefinition) => t.name)}
        onChange={setStaticValue}
        inputItem={staticValue}
        popoverProps={{
          autoFocus: true,
          boundary: 'viewport',
          canEscapeKeyClose: true,
          lazy: true,
          position: Position.LEFT_TOP,
          usePortal: true
        }}
      />
    </React.Fragment>
  );

  const renderTextInput = (): React.ReactElement => (
    <React.Fragment>
      <InputGroup
        value={staticValue}
        placeholder="Static input"
        onChange={(event: React.FormEvent<HTMLElement>): void => {
          const target = event.target as HTMLInputElement;
          setStaticValue(target.value);
        }}
        onBlur={(): void => {
          updateStaticInput({
            variables: {
              inputId: input.id,
              value: staticValue
            }
          });
        }}
      />
    </React.Fragment>
  );

  return (
    <div className="input-static">
      <div className="input-card">
        <Card elevation={Elevation.ONE}>
          <div className="card-absolute">
            <div className="card-flex">
              <div className="card-tag">Static</div>
            </div>
          </div>
          <div className="static-input-form">
            <ControlGroup>
              {attribute.definition.id === 'Reference.type' ? (
                renderReferenceTypeDropDown()
              ) : attribute.definition.id === 'Identifier.system' ? (
                <IdentifierSystemInput
                  attribute={attribute}
                  sources={sources}
                  creatingStaticInput={creatingStaticInput}
                  addStaticValue={addStaticValue}
                />
              ) : (
                renderTextInput()
              )}
            </ControlGroup>
          </div>
        </Card>
        <Button
          icon={'trash'}
          loading={loadDelInput}
          minimal={true}
          onClick={onClickDelete}
        />
      </div>
    </div>
  );
};

export default InputStatic;

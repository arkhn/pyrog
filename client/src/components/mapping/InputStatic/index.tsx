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
  const [updateStaticInput] = useMutation(mUpdateStaticInput, { onError });
  const [deleteInput, { loading: loadDelInput }] = useMutation(mDeleteInput, {
    onError
  });

  const sources = dataSources ? dataSources.sources : [];

  useEffect(() => {
    setStaticValue(input.staticValue);
  }, [input]);

  const onUpdate = (value: string): void => {
    updateStaticInput({
      variables: {
        inputId: input.id,
        value: value
      }
    });
  };

  const onClickDelete = () => {
    deleteInput({
      variables: {
        inputGroupId: input.inputGroupId,
        inputId: input.id
      }
    });
  };

  const renderReferenceTypeDropDown = (): React.ReactElement => (
    <StringSelect
      items={availableResources.map((t: ResourceDefinition) => t.name)}
      onChange={onUpdate}
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
  );

  const renderTextInput = (): React.ReactElement => (
    <InputGroup
      value={staticValue}
      placeholder="Static input"
      onChange={(event: React.FormEvent<HTMLElement>): void => {
        const target = event.target as HTMLInputElement;
        setStaticValue(target.value);
      }}
      onBlur={() => onUpdate(staticValue)}
    />
  );

  const renderIdentifierSystemInput = (): React.ReactElement => (
    <IdentifierSystemInput
      value={input.staticValue}
      attribute={attribute}
      sources={sources}
      onUpdate={onUpdate}
    />
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
              {attribute.definition.id === 'Reference.type'
                ? renderReferenceTypeDropDown()
                : attribute.definition.id === 'Identifier.system'
                ? renderIdentifierSystemInput()
                : renderTextInput()}
            </ControlGroup>
          </div>
        </Card>
        <Button
          icon={'cross'}
          loading={loadDelInput}
          minimal={true}
          onClick={onClickDelete}
        />
      </div>
    </div>
  );
};

export default InputStatic;

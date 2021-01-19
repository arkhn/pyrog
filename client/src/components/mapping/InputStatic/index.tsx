import {
  Button,
  Card,
  ControlGroup,
  Elevation,
  InputGroup,
  Position
} from '@blueprintjs/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';
import { ResourceDefinition } from '@arkhn/fhir.ts';
import { useSnackbar } from 'notistack';

import { onError } from 'services/apollo';
import { setAttributeInMap } from 'services/resourceAttributes/actions';
import { IAttribute, IInput, IReduxStore } from 'types';

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
  attribute: IAttribute;
  input: IInput;
}

const InputStatic = ({ attribute, input }: Props): React.ReactElement => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { attribute: selectedAttribute } = useSelector(
    (state: IReduxStore) => state.selectedNode
  );
  const { availableResources } = useSelector(
    (state: IReduxStore) => state.fhir
  );

  const [staticValue, setStaticValue] = useState(input.staticValue);

  const { data: dataSources } = useQuery(qSourcesAndResources, {
    fetchPolicy: 'no-cache'
  });
  const [updateStaticInput] = useMutation(mUpdateStaticInput, {
    onError: onError(enqueueSnackbar)
  });
  const [deleteInput, { loading: loadDelInput }] = useMutation(mDeleteInput, {
    onError: onError(enqueueSnackbar)
  });

  const sources = dataSources ? dataSources.sources : [];

  useEffect(() => {
    setStaticValue(input.staticValue || '');
  }, [input]);

  const onUpdate = (value: string): void => {
    updateStaticInput({
      variables: {
        inputId: input.id,
        value: value
      }
    });
  };

  const onClickDelete = async () => {
    const { data } = await deleteInput({
      variables: {
        inputGroupId: input.inputGroupId,
        inputId: input.id
      }
    });
    attribute.inputGroups.forEach((group, ind) => {
      if (group.id === input.inputGroupId)
        attribute.inputGroups[ind] = data.deleteInput;
    });

    dispatch(setAttributeInMap(attribute.path, attribute));
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
      attribute={selectedAttribute}
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
              {selectedAttribute.definition.id === 'Reference.type'
                ? renderReferenceTypeDropDown()
                : selectedAttribute.definition.id === 'Identifier.system'
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

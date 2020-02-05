import {
  Button,
  Card,
  ControlGroup,
  InputGroup,
  FormGroup,
  Elevation
} from '@blueprintjs/core';
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';

import { IReduxStore } from 'types';

import { setAttributeInMap } from 'services/resourceInputs/actions';

// GRAPHQL
const qInputsForAttribute = loader(
  'src/graphql/queries/inputsForAttribute.graphql'
);
const mCreateAttribute = loader(
  'src/graphql/mutations/createAttribute.graphql'
);
const mCreateStaticInput = loader(
  'src/graphql/mutations/createStaticInput.graphql'
);

interface IProps {
  attribute: {
    path: string;
  };
}

const StaticValueForm = ({ attribute }: IProps) => {
  const dispatch = useDispatch();

  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const path = selectedNode.attribute.path;

  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );
  let attributeId = attributesForResource[path]
    ? attributesForResource[path].id
    : null;

  const [staticValue, setStaticValue] = React.useState('');

  const addInputToCache = (cache: any, { data: { createInput } }: any) => {
    try {
      const { attribute: dataAttribute } = cache.readQuery({
        query: qInputsForAttribute,
        variables: {
          attributeId
        }
      });
      cache.writeQuery({
        query: qInputsForAttribute,
        variables: {
          attributeId
        },
        data: {
          attribute: {
            ...dataAttribute,
            inputs: [...dataAttribute.inputs, createInput]
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [createAttribute] = useMutation(mCreateAttribute);
  const [
    createStaticInput,
    { loading: creatingStaticInput }
  ] = useMutation(mCreateStaticInput, { update: addInputToCache });

  const onAddStaticValue = async (): Promise<void> => {
    if (!attributeId) {
      // First, we create the attribute if it doesn't exist
      const { data: attr } = await createAttribute({
        variables: {
          resourceId: selectedNode.resource.id,
          path
        }
      });
      attributeId = attr.createAttribute.id;
      dispatch(setAttributeInMap(path, attr.createAttribute));
    }
    createStaticInput({
      variables: {
        attributeId,
        staticValue
      }
    });
  };

  return (
    <Card elevation={Elevation.ONE}>
      <div className="card-tag">Static</div>
      <FormGroup labelFor="text-input" inline={true}>
        <ControlGroup>
          <InputGroup
            id="static-value-input"
            onChange={(event: React.FormEvent<HTMLElement>) => {
              const target = event.target as HTMLInputElement;
              setStaticValue(target.value);
            }}
            placeholder="Column static value"
            value={staticValue}
          />
          <Button
            disabled={!attribute || staticValue.length === 0}
            icon={'add'}
            loading={creatingStaticInput}
            onClick={onAddStaticValue}
          />
        </ControlGroup>
      </FormGroup>
    </Card>
  );
};

export default StaticValueForm;

import {
  Button,
  Card,
  ControlGroup,
  InputGroup,
  FormGroup,
  Elevation
} from '@blueprintjs/core';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';
import { Node } from '../../FhirMappingPanel/FhirResourceTree/node';
import { IReduxStore, SelectedAttribute } from 'types';

import { setAttributeInMap } from 'services/resourceInputs/actions';
import StringSelect from 'components/selects/stringSelect';

// GRAPHQL
const qBasicFhirTypes = loader('src/graphql/queries/basicFhirTypes.graphql');
const qInputsForAttribute = loader(
  'src/graphql/queries/inputsForAttribute.graphql'
);
const mCreateAttribute = loader(
  'src/graphql/mutations/createAttribute.graphql'
);
const mCreateStaticInput = loader(
  'src/graphql/mutations/createStaticInput.graphql'
);

interface Props {
  attribute: SelectedAttribute;
}

const StaticValueForm = ({ attribute }: Props) => {
  const dispatch = useDispatch();

  const { resource } = useSelector((state: IReduxStore) => state.selectedNode);
  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );

  const [
    getFhirTypes,
    { data: dataFhirTypes, loading: loadingFhirTypes }
  ] = useLazyQuery(qBasicFhirTypes, {
    fetchPolicy: 'cache-first'
  });

  const [staticValue, setStaticValue] = React.useState('');

  const path = attribute.path;
  let attributeId = attributesForResource[path]
    ? attributesForResource[path].id
    : null;

  useEffect(() => {
    if (attribute.isReferenceType) {
      setStaticValue('');
      getFhirTypes();
    }
  }, [attribute]);

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
          resourceId: resource.id,
          definitionId: attribute.types[0],
          path
        }
      });
      attributeId = attr.createAttribute.id;
      dispatch(setAttributeInMap(path, attr.createAttribute));
    }
    // Also, we create the parent attributes if they don't exist
    let curNode = attribute as Node;
    while (curNode.parent) {
      curNode = curNode.parent;
      const parentPath = curNode.path;
      if (
        !attributesForResource[parentPath] &&
        !(curNode.parent && curNode.parent.isArray) &&
        !(curNode.types.length > 1)
      ) {
        const { data: attr } = await createAttribute({
          variables: {
            resourceId: resource.id,
            definitionId: curNode.types[0],
            path: parentPath
          }
        });
        dispatch(setAttributeInMap(parentPath, attr.createAttribute));
      }
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
      <div className="card-absolute">
        <div className="card-flex">
          <div className="card-tag">Static</div>
        </div>
      </div>
      <FormGroup labelFor="text-input" inline={true}>
        <ControlGroup>
          {attribute.isReferenceType ? (
            <>
              <StringSelect
                items={
                  loadingFhirTypes || !dataFhirTypes
                    ? []
                    : dataFhirTypes.structureDefinitions.map((t: any) => t.name)
                }
                onChange={setStaticValue}
                loading={loadingFhirTypes}
                inputItem={staticValue}
              />
            </>
          ) : (
            <InputGroup
              id="static-value-input"
              onChange={(event: React.FormEvent<HTMLElement>) => {
                const target = event.target as HTMLInputElement;
                setStaticValue(target.value);
              }}
              placeholder="Static input"
              value={staticValue}
            />
          )}
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

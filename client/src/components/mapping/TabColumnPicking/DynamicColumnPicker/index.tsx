import {
  Card,
  Elevation,
  FormGroup,
  ControlGroup,
  Button,
  Position
} from '@blueprintjs/core';
import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import { loader } from 'graphql.macro';
import { Attribute } from '@arkhn/fhir.ts';

import ColumnSelect from 'components/selects/columnSelect';
import TableViewer from 'components/mapping/TableViewer';

import { onError } from 'services/apollo';
import { IReduxStore, ISelectedSource, Join } from 'types';

import { setAttributeInMap } from 'services/resourceInputs/actions';

// GRAPHQL
const mCreateAttribute = loader(
  'src/graphql/mutations/createAttribute.graphql'
);
const mCreateInputGroup = loader(
  'src/graphql/mutations/createInputGroup.graphql'
);
const mCreateSQLInput = loader('src/graphql/mutations/createSQLInput.graphql');

interface Props {
  attribute: Attribute;
  schema: any;
  source: ISelectedSource;
}

const DynamicColumnPicker = ({ attribute, schema, source }: Props) => {
  const dispatch = useDispatch();
  const toaster = useSelector((state: IReduxStore) => state.toaster);

  const { resource, selectedInputGroup } = useSelector(
    (state: IReduxStore) => state.selectedNode
  );
  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );

  const path = attribute.path;
  let attributeId = attributesForResource[path]
    ? attributesForResource[path].id
    : null;
  // The id of the input group in which we want to put the new input.
  // If it is null, it means that we'll need to create a new input group first.
  let inputGroupId =
    selectedInputGroup === null ||
    !attributesForResource[path] ||
    selectedInputGroup >= attributesForResource[path].inputGroups.length
      ? null
      : attributesForResource[path].inputGroups[selectedInputGroup].id;

  const [table, setTable] = useState(resource.primaryKeyTable);
  const [column, setColumn] = useState('');
  const [joins, setJoins] = useState([] as Join[]);

  const [createAttribute] = useMutation(mCreateAttribute, {
    onError: onError(toaster)
  });
  const [createInputGroup] = useMutation(mCreateInputGroup, {
    onError: onError(toaster)
  });
  const [
    createSQLInput,
    { loading: creatingSQLInput }
  ] = useMutation(mCreateSQLInput, { onError: onError(toaster) });

  const createInput = async (): Promise<void> => {
    try {
      // First, we create the attribute if it doesn't exist
      if (!attributeId) {
        const { data: attr } = await createAttribute({
          variables: {
            resourceId: resource.id,
            definitionId: attribute.types[0],
            path,
            sliceName: attribute.definition.sliceName
          }
        });
        attributeId = attr.createAttribute.id;
      }
      // Then, we create the inputGroup if needed
      if (
        selectedInputGroup === null ||
        !attributesForResource[path] ||
        selectedInputGroup >= attributesForResource[path].inputGroups.length
      ) {
        const { data: group } = await createInputGroup({
          variables: {
            attributeId
          }
        });
        inputGroupId = group.createInputGroup.id;
      }
      // Also, we create the parent attributes if they don't exist
      let currentAttribute = attribute;
      while (currentAttribute.parent) {
        currentAttribute = currentAttribute.parent;
        const parentPath = currentAttribute.path;
        if (
          !attributesForResource[parentPath] &&
          !currentAttribute.isArray &&
          currentAttribute.types.length <= 1
        ) {
          const { data: attr } = await createAttribute({
            variables: {
              resourceId: resource.id,
              definitionId: currentAttribute.types[0],
              path: parentPath,
              sliceName: currentAttribute.definition.sliceName
            }
          });
          dispatch(setAttributeInMap(parentPath, attr.createAttribute));
        }
      }
      const { data } = await createSQLInput({
        variables: {
          inputGroupId,
          columnInput: {
            table: table,
            column: column,
            joins: joins
          }
        }
      });
      dispatch(setAttributeInMap(path, data.createInput.inputGroup.attribute));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Card elevation={Elevation.ONE}>
      <div className="card-absolute">
        <div className="card-flex">
          <div className="card-tag">Dynamic</div>
          {!source.credential && (
            <div className="card-credentials-missing">
              Database credentials missing
            </div>
          )}
        </div>
      </div>
      <FormGroup labelFor="text-input" inline={true}>
        <ControlGroup>
          <ColumnSelect
            tableChangeCallback={(e: string) => {
              setTable(e);
              setColumn('');
            }}
            columnChangeCallback={(e: string) => {
              setColumn(e);
            }}
            joinsChangeCallback={(joins: Join[]): void => {
              setJoins(joins);
            }}
            initialTable={table}
            sourceSchema={schema}
            withJoins={false}  // TODO change if we want to select joins in Dynamic div
            popoverProps={{
              autoFocus: true,
              boundary: 'viewport',
              canEscapeKeyClose: true,
              lazy: true,
              position: Position.TOP,
              usePortal: true
            }}
          />
          <Button
            disabled={!attribute || !column}
            icon={'add'}
            loading={creatingSQLInput}
            onClick={createInput}
          />
        </ControlGroup>
      </FormGroup>
      <TableViewer table={table} />
    </Card>
  );
};

export default DynamicColumnPicker;

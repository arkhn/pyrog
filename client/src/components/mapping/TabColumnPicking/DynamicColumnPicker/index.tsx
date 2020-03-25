import axios from 'axios';
import {
  Card,
  Elevation,
  FormGroup,
  ControlGroup,
  Button
} from '@blueprintjs/core';
import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import { loader } from 'graphql.macro';
import { Attribute } from '@arkhn/fhir.ts';

import ColumnPicker from '../../ColumnPicker';
import TableViewer from './TableViewer';
import FhirPreview from './FhirPreview';

import { onError } from 'services/apollo';
import { IReduxStore, ISelectedSource } from 'types';
import { PAGAI_URL } from '../../../../constants';

import { setAttributeInMap } from 'services/resourceInputs/actions';

// GRAPHQL
const qInputsForAttribute = loader(
  'src/graphql/queries/inputsForAttribute.graphql'
);
const mCreateAttribute = loader(
  'src/graphql/mutations/createAttribute.graphql'
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

  const { resource } = useSelector((state: IReduxStore) => state.selectedNode);
  const path = attribute.path;

  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );
  let attributeId = attributesForResource[path]
    ? attributesForResource[path].id
    : null;

  const [owner, setOwner] = React.useState('');
  const [table, setTable] = React.useState('');
  const [column, setColumn] = React.useState('');
  const [isTableLoading, setIsTableLoading] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [fields, setFields] = React.useState([]);
  const [fhirPreviewEnabled, setFhirPreviewEnabled] = React.useState(false);
  const [fhirPreviewRowId, setFhirPreviewRowId] = React.useState(
    undefined as number | undefined
  );

  const [createAttribute] = useMutation(mCreateAttribute, {
    onError: onError(toaster)
  });
  const [
    createSQLInput,
    { loading: creatingSQLInput }
  ] = useMutation(mCreateSQLInput, { onError: onError(toaster) });

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

  const createInput = async (): Promise<void> => {
    try {
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
      let currentAttribute = attribute;
      while (currentAttribute.parent) {
        currentAttribute = currentAttribute.parent;
        const parentPath = currentAttribute.path;
        if (
          !attributesForResource[parentPath] &&
          !currentAttribute.isArray &&
          !(currentAttribute.types.length > 1)
        ) {
          const { data: attr } = await createAttribute({
            variables: {
              resourceId: resource.id,
              definitionId: currentAttribute.types[0],
              path: parentPath
            }
          });
          attributeId = attr.createAttribute.id;
          dispatch(setAttributeInMap(path, attr.createAttribute));
        }
      }
      await createSQLInput({
        variables: {
          attributeId,
          columnInput: {
            owner: owner || '',
            table: table,
            column: column
          }
        },
        update: addInputToCache
      });
    } catch (e) {
      console.log(e);
    }
  };

  const previewFhirObject = (rowId: number) => {
    setFhirPreviewRowId(rowId);
    setFhirPreviewEnabled(true);
  };

  React.useEffect(() => {
    if (source && source.credential && table) {
      setIsTableLoading(true);
      axios
        .get(`${PAGAI_URL}/explore/${source.credential.id}/${table}`, {
          params: { schema: owner }
        })
        .then((res: any) => {
          setIsTableLoading(false);
          setRows(res.data.rows);
          setFields(res.data.fields);
        })
        .catch((err: any) => {
          setIsTableLoading(false);
          const { error } = err.response.data;
          toaster.show({
            message: error || err.response.statusText,
            intent: 'danger',
            icon: 'properties',
            timeout: 10000
          });
        });
    }
  }, [source, owner, table, toaster]);

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
          <ColumnPicker
            hasOwner={source.hasOwner}
            ownerChangeCallback={(e: string) => {
              setOwner(e);
              setTable('');
              setColumn('');
              setFhirPreviewEnabled(false);
            }}
            tableChangeCallback={(e: string) => {
              setTable(e);
              setColumn('');
              setFhirPreviewEnabled(false);
            }}
            columnChangeCallback={(e: string) => {
              setColumn(e);
            }}
            sourceSchema={schema}
          />
          <Button
            disabled={!attribute || !column}
            icon={'add'}
            loading={creatingSQLInput}
            onClick={createInput}
          />
        </ControlGroup>
      </FormGroup>
      <TableViewer
        selectedTable={table}
        fields={fields}
        rows={rows}
        isTableLoading={isTableLoading}
        previewFhirObject={previewFhirObject}
      />
      {fhirPreviewEnabled && <FhirPreview rowId={fhirPreviewRowId!} />}
    </Card>
  );
};

export default DynamicColumnPicker;

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

import ColumnPicker from '../../ColumnPicker';
import TableViewer from '../TableViewer';

import { IReduxStore } from 'types';
import { loader } from 'graphql.macro';
import { HTTP_BACKEND_URL } from '../../../../constants';

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
  attribute: {
    path: string;
  };
  schema: any;
  source: any;
}

const DynamicColumnPicker = ({ attribute, schema, source }: Props) => {
  const dispatch = useDispatch();

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
  const [tableIsLoading, setTableIsLoading] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [fields, setFields] = React.useState([]);

  const [createAttribute] = useMutation(mCreateAttribute);
  const [createSQLInput, { loading: creatingSQLInput }] = useMutation(
    mCreateSQLInput
  );

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
            inputs: dataAttribute.inputs.concat([createInput])
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createInput = async (): Promise<void> => {
    if (!attributeId) {
      // First, we create the attribute if it doesn't exist
      const { data: attr } = await createAttribute({
        variables: {
          resourceId: resource.id,
          path
        }
      });
      attributeId = attr.createAttribute.id;
      dispatch(setAttributeInMap(path, attr.createAttribute));
    }
    createSQLInput({
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
  };

  React.useEffect(() => {
    if (source && source.id && table) {
      setTableIsLoading(true);
      axios
        .get(
          `${HTTP_BACKEND_URL}/tableview/${source.id}/${
            owner ? owner + '.' : ''
          }${table}`
        )
        .then((res: any) => {
          setTableIsLoading(false);
          setRows(res.data.rows);
          setFields(res.data.fields.map((field: any) => field.name));
        })
        .catch((err: any) => {
          setTableIsLoading(false);
          console.log(err);
        });
    }
  }, [source, owner, table]);

  return (
    <Card elevation={Elevation.ONE}>
      <div className="card-tag">Dynamic</div>
      <FormGroup labelFor="text-input" inline={true}>
        <ControlGroup>
          <ColumnPicker
            hasOwner={source.hasOwner}
            ownerChangeCallback={(e: string) => {
              setOwner(e);
              setTable('');
              setColumn('');
            }}
            tableChangeCallback={(e: string) => {
              setTable(e);
              setColumn('');
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
      <TableViewer fields={fields} rows={rows} isLoading={tableIsLoading} />
    </Card>
  );
};

export default DynamicColumnPicker;

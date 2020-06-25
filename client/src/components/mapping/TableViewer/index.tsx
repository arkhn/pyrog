import {
  Table,
  Column,
  Cell,
  TableLoadingOption,
  RowHeaderCell,
  SelectionModes,
  IRegion
} from '@blueprintjs/table';
import * as React from 'react';
import axios from 'axios';

import './style.scss';
import { Icon } from '@blueprintjs/core';
import { useSelector } from 'react-redux';
import { IReduxStore } from 'types';
import { PAGAI_URL } from '../../../constants';
import FhirPreview from './FhirPreview';

interface IProps {
  table: string;
}

const TableViewer = ({ table }: IProps) => {
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const {
    resource,
    source: { credential }
  } = useSelector((state: IReduxStore) => state.selectedNode);

  const [compatiblePreview, setCompatiblePreview] = React.useState(false);
  const [fhirPreviewEnabled, setFhirPreviewEnabled] = React.useState(false);
  const [fhirPreviewRowId, setFhirPreviewRowId] = React.useState(
    undefined as number | undefined
  );

  const [columns, setColumns] = React.useState([] as React.ReactElement[]);
  const [loading, setLoading] = React.useState(false);
  const [fields, setFields] = React.useState([] as string[]);
  const [rows, setRows] = React.useState([]);

  const onSelection = (regions: IRegion[]) => {
    if (!compatiblePreview) return;
    if (regions.length === 0) return;

    const [{ rows: selectedRows }] = regions;
    if (!selectedRows) return;

    const [rowIndex] = selectedRows;

    setFhirPreviewRowId(
      rows[rowIndex][fields.indexOf(resource.primaryKeyColumn)]
    );
    setFhirPreviewEnabled(true);
  };

  const renderRowHeader = (index: number) => (
    <RowHeaderCell
      className="previewButton"
      nameRenderer={() => <Icon icon="flame" />}
    />
  );

  React.useEffect(() => {
    setColumns(
      fields.map((field: string, index: number) => {
        return (
          <Column
            key={index}
            name={field}
            cellRenderer={(i: number) => <Cell>{rows[i][index]}</Cell>}
          />
        );
      })
    );
  }, [rows, fields]);

  React.useEffect(() => {
    setFhirPreviewEnabled(false);
    table === resource.primaryKeyTable
      ? setCompatiblePreview(true)
      : setCompatiblePreview(false);
  }, [table, resource]);

  React.useEffect(() => {
    if (resource && table) {
      setLoading(true);
      axios
        .get(`${PAGAI_URL}/explore/${resource.id}/${table}`)
        .then((res: any) => {
          setLoading(false);
          setRows(res.data.rows);
          setFields(res.data.fields);
        })
        .catch((err: any) => {
          setLoading(false);
          const { error } = err.response.data;
          toaster.show({
            message: error || err.response.statusText,
            intent: 'danger',
            icon: 'properties',
            timeout: 10000
          });
        });
    }
  }, [resource, credential.owner, table, toaster]);

  return (
    <React.Fragment>
      <Table
        numRows={rows.length}
        enableColumnReordering={false}
        enableRowResizing={false}
        rowHeaderCellRenderer={compatiblePreview ? renderRowHeader : undefined}
        enableMultipleSelection={false}
        onSelection={onSelection}
        selectionModes={SelectionModes.ROWS_ONLY}
        loadingOptions={
          loading
            ? [
                TableLoadingOption.CELLS,
                TableLoadingOption.COLUMN_HEADERS,
                TableLoadingOption.ROW_HEADERS
              ]
            : []
        }
      >
        {columns}
      </Table>
      {fhirPreviewEnabled && <FhirPreview rowId={fhirPreviewRowId!} />}
    </React.Fragment>
  );
};

export default TableViewer;

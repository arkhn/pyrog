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
import { PAGAI_URL, RIVER_URL } from '../../../constants';
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

  const [columns, setColumns] = React.useState([] as React.ReactElement[]);
  const [loadingTable, setLoadingTable] = React.useState(false);
  const [fields, setFields] = React.useState([] as string[]);
  const [rows, setRows] = React.useState([]);

  const [previewData, setPreviewData] = React.useState(undefined as any);
  const [loadingPreview, setLoadingPreview] = React.useState(false);

  const fetchPreview = React.useCallback(
    async selectedRows => {
      setLoadingPreview(true);
      setPreviewData(undefined);
      try {
        const res = await axios.post(
          `${RIVER_URL}/preview`,
          {
            resource_id: resource.id,
            primary_key_values: [
              rows[selectedRows][fields.indexOf(resource.primaryKeyColumn)]
            ]
          },
          { headers: { 'Content-Type': 'application/json' } }
        );
        setPreviewData(res.data);
      } catch (err) {
        toaster.show({
          message: err.response ? err.response.data : err.message,
          intent: 'danger',
          icon: 'warning-sign',
          timeout: 6000
        });
      }
      setLoadingPreview(false);
    },
    [fields, rows, resource, toaster]
  );

  const onSelection = (regions: IRegion[]) => {
    if (!compatiblePreview) return;
    if (regions.length === 0) return;

    const [{ rows: selectedRows }] = regions;
    if (!selectedRows) return;

    const [rowIndex] = selectedRows;
    fetchPreview(rowIndex);
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
    table === resource.primaryKeyTable
      ? setCompatiblePreview(true)
      : setCompatiblePreview(false);
  }, [table, resource]);

  React.useEffect(() => {
    if (resource && table) {
      setLoadingTable(true);
      axios
        .get(`${PAGAI_URL}/explore/${resource.id}/${table}`)
        .then((res: any) => {
          setLoadingTable(false);
          setRows(res.data.rows);
          setFields(res.data.fields);
        })
        .catch((err: any) => {
          setLoadingTable(false);
          toaster.show({
            message: err.response ? err.response.data : err.message,
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
          loadingTable
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
      <FhirPreview previewData={previewData} loading={loadingPreview} />
    </React.Fragment>
  );
};

export default TableViewer;

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

import './style.scss';
import { Icon } from '@blueprintjs/core';
import { useSelector } from 'react-redux';
import { IReduxStore } from 'types';

interface IProps {
  selectedTable: string;
  fields: string[];
  rows: any[];
  isTableLoading: boolean;
  previewFhirObject: (rowId: number) => void;
}

const TableViewer = ({
  selectedTable,
  rows,
  fields,
  isTableLoading,
  previewFhirObject
}: IProps) => {
  const [columns, setColumns] = React.useState([] as React.ReactElement[]);
  const [compatiblePreview, setCompatiblePreview] = React.useState(false);
  const { resource } = useSelector((state: IReduxStore) => state.selectedNode);

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
    selectedTable === resource.primaryKeyTable
      ? setCompatiblePreview(true)
      : setCompatiblePreview(false);
  }, [selectedTable, resource]);

  const onSelection = (regions: IRegion[]) => {
    if (!compatiblePreview) return;
    if (regions.length === 0) return;

    const [{ rows: selectedRows }] = regions;
    if (!selectedRows) return;

    const [rowIndex] = selectedRows;

    previewFhirObject(
      rows[rowIndex][fields.indexOf(resource.primaryKeyColumn)]
    );
  };

  const renderRowHeader = (index: number) => (
    <RowHeaderCell
      className="previewButton"
      nameRenderer={() => <Icon icon="flame" />}
    />
  );

  return (
    <Table
      numRows={rows.length}
      enableColumnReordering={false}
      enableRowResizing={false}
      rowHeaderCellRenderer={compatiblePreview ? renderRowHeader : undefined}
      enableMultipleSelection={false}
      onSelection={onSelection}
      selectionModes={SelectionModes.ROWS_ONLY}
      loadingOptions={
        isTableLoading
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
  );
};

export default TableViewer;

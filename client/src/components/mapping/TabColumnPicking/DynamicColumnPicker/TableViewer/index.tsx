import {
  Table,
  Column,
  Cell,
  Utils,
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
  isLoading: boolean;
  previewFhirObject: (rowId: number) => void;
}

const TableViewer = ({
  selectedTable,
  rows,
  fields,
  isLoading,
  previewFhirObject
}: IProps) => {
  const [columns, setColumns] = React.useState([] as React.ReactElement[]);
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

  const onSelection = (regions: IRegion[]) => {
    if (regions.length === 0) return;

    const [{ rows: selectedRows }] = regions;
    if (!selectedRows) return;

    const [rowIndex] = selectedRows;
    if (selectedTable !== resource.primaryKeyTable) {
      console.error('not running fhir-pipe: wrong table');
      return;
    }

    previewFhirObject(
      rows[rowIndex][fields.indexOf(resource.primaryKeyColumn)]
    );
  };

  const handleColumnsReordered = (
    oldIndex: number,
    newIndex: number,
    length: number
  ) => {
    if (oldIndex === newIndex) {
      return;
    }
    const nextChildren = Utils.reorderArray(
      columns,
      oldIndex,
      newIndex,
      length
    );
    setColumns(nextChildren);
  };

  const renderRowHeader = (index: number) => (
    <RowHeaderCell>
      <Icon icon="flame" />
    </RowHeaderCell>
  );

  return (
    <Table
      numRows={rows.length}
      enableColumnReordering={true}
      onColumnsReordered={handleColumnsReordered}
      rowHeaderCellRenderer={renderRowHeader}
      enableMultipleSelection={false}
      onSelection={onSelection}
      selectionModes={SelectionModes.ROWS_ONLY}
      loadingOptions={
        isLoading
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

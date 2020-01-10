import {
  Table,
  Column,
  Cell,
  Utils,
  TableLoadingOption
} from '@blueprintjs/table';
import * as React from 'react';

import './style.scss';

interface IProps {
  fields: string[];
  rows: any[];
  isLoading: boolean;
}

const TableViewer = ({ rows, fields, isLoading }: IProps) => {
  const [columns, setColumns] = React.useState([] as React.ReactElement[]);

  React.useEffect(() => {
    setColumns(
      fields.map((field: string, index: number) => {
        return (
          <Column
            key={index}
            name={field}
            cellRenderer={(i: number) => <Cell>{rows[i][field]}</Cell>}
          />
        );
      })
    );
  }, [rows, fields]);

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

  return (
    <Table
      numRows={rows.length}
      enableColumnReordering={true}
      onColumnsReordered={handleColumnsReordered}
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

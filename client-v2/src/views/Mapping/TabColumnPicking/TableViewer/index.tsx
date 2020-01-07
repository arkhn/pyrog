import {
  Table,
  Column,
  Cell,
  Utils,
  TableLoadingOption
} from "@blueprintjs/table";
import * as React from "react";

import "./style.less";

interface IProps {
  fields: string[];
  rows: any[];
  isLoading: boolean;
}

const TableViewer = ({ rows, fields, isLoading }: IProps) => {
  const getCellRenderer = (fieldName: string) => {
    return (rowIndex: number) => {
      return <Cell>{rows[rowIndex][fieldName]}</Cell>;
    };
  };

  const [columns, setColumns] = React.useState([]);

  React.useEffect(() => {
    setColumns(
      fields.map((field: string, index: number) => {
        return (
          <Column
            key={index}
            name={field}
            cellRenderer={getCellRenderer(field)}
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

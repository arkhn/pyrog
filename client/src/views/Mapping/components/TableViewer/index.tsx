import { Table, Column, Cell, Utils } from "@blueprintjs/table";
import * as React from "react";

import "./style.less";

interface IProps {
  headers: string[];
  rows: any[];
}

const TableViewer = ({ rows, headers }: IProps) => {
  const getCellRenderer = (index: number) => {
    return (rowIndex: number) => {
      return <Cell>{rows[rowIndex][index]}</Cell>;
    };
  };

  const [columns, setColumns] = React.useState(
    rows.map((row: any, index: number) => {
      return (
        <Column
          key={index}
          name={headers[index]}
          cellRenderer={getCellRenderer(index)}
        />
      );
    })
  );

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
    >
      {columns}
    </Table>
  );
};

export default TableViewer;

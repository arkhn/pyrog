import {
  Card,
  ControlGroup,
  Elevation,
  FormGroup,
  Breadcrumbs,
  Tag,
  IBreadcrumbProps
} from "@blueprintjs/core";
import * as React from "react";

const sqlParser = require("js-sql-parser");

import SQLRequestParser from "../SQLRequestParser";

const TabSQLParser = () => {
  const [table, setTable] = React.useState(null);
  const [columns, setColumns] = React.useState([]);

  return (
    <div id="sql-request-parser">
      <Card elevation={Elevation.ONE}>
        <FormGroup label={<h3>SQL Request</h3>} labelFor="text-input">
          <ControlGroup fill={true}>
            <SQLRequestParser
              onChangeCallback={(e: string) => {
                const result = parse(e);
                if (result) {
                  setColumns(result.columns);
                  setTable(result.table);
                  console.log("Im here");
                  console.log(result);
                }
              }}
            />
          </ControlGroup>
        </FormGroup>
      </Card>

      {columns.map((column: any, index: number) => {
        return inputColumnComponent(column, table, index);
      })}
    </div>
  );
};

const parse = (request: string) => {
  let table = null;
  let columns = null;

  try {
    const ast = sqlParser.parse(request);
    columns = ast.value.selectItems.value;
    table = ast.value.from.value[0].value.value.value;
    return {
      table: table,
      columns: columns
    };
  } catch (err) {
    console.log(err);
    return;
  }
};

const inputColumnComponent = (column: any, table: any, index: number) => (
  <div key={index}>
    <Card elevation={Elevation.ONE} className="input-column-info">
      <div>
        <div className="input-column-name">
          <Breadcrumbs
            breadcrumbRenderer={(item: IBreadcrumbProps) => {
              return <div>{item.text}</div>;
            }}
            items={[
              {
                text: (
                  <div className="stacked-tags">
                    <Tag minimal={true}>TABLE</Tag>
                    <Tag intent={"success"} large={true}>
                      {table}
                    </Tag>
                  </div>
                )
              },
              {
                text: (
                  <div className="stacked-tags">
                    <Tag minimal={true}>COLUMN</Tag>
                    <Tag intent={"success"} large={true}>
                      {column.value}
                    </Tag>
                  </div>
                )
              }
            ]}
          />
        </div>
      </div>
    </Card>
  </div>
);

export default TabSQLParser;

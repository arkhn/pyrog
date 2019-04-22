import { Card, ControlGroup, Elevation, FormGroup } from "@blueprintjs/core";
import * as React from "react";

const sqlParser = require("js-sql-parser");

import SqlRequestParser from "../sqlRequestParser";

import { ISelectedSource } from "../../types";

interface IProps {
  selectedSource: ISelectedSource;
}

const SQLRequestParserTab = ({ selectedSource }: IProps) => {
  // Hook React
  const [table, setTable] = React.useState(null);
  const [column, setColumn] = React.useState(null);

  return (
    <div id="sql-request-parser">
      <Card elevation={Elevation.ONE}>
        <FormGroup label={<h3>SQL Request</h3>} labelFor="text-input">
          <ControlGroup fill={true}>
            <SqlRequestParser
              onChangeCallback={(e: string) => {
                const result = parse(e);
                if (result) {
                  setTable(result.table);
                  setColumn(result.column);
                }
              }}
            />
          </ControlGroup>
        </FormGroup>
      </Card>
      <Card elevation={Elevation.ONE}>
        <FormGroup
          label={<h4>{`Table: ${table} Column: ${column}`}</h4>}
          labelFor="text-input"
          inline={true}
        />
      </Card>
    </div>
  );
};

const parse = (request: string) => {
  let column = null;
  let table = null;

  try {
    const ast = sqlParser.parse(request);
    column = ast.value.selectItems.value[0].value;
    table = ast.value.from.value[0].value.value.value;
  } catch (err) {
    console.log(err);
    return;
  }

  return {
    table: table,
    column: column
  };
};

export default SQLRequestParserTab;

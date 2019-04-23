import { Button, ControlGroup } from "@blueprintjs/core";
import * as React from "react";

// Import custom components
import ColumnPicker from "./columnPicker";
import StringSelect from "./selects/stringSelect";

// Import custom types
import { ISourceSchema, IInputColumn, IFhirIntegrationSpec } from "../types";

export interface IProps {
  hasOwner: boolean;
  inputColumns: any;
  sourceSchema: ISourceSchema;
}

export interface IState {}

export default class InputColumnsTable extends React.Component<IProps, IState> {
  public render() {
    let { hasOwner, inputColumns, sourceSchema } = this.props;

    let rows = inputColumns
      ? inputColumns.map((column: IInputColumn, index: number) => (
          <tr key={index}>
            <td>
              <Button icon={"delete"} minimal={true} />
            </td>
            <td>{`${column.owner} > ${column.table} > ${column.column}`}</td>
            {column.join ? (
              <td>
                <Button icon={"delete"} minimal={true} />
              </td>
            ) : (
              <td colSpan={3}>
                <Button icon={"add"} minimal={true} />
              </td>
            )}
            {column.join ? (
              <td>
                <StringSelect
                  icon={"column-layout"}
                  inputItem={column.join.sourceColumn}
                  items={
                    (sourceSchema[column.owner] as { [key: string]: string[] })[
                      column.table
                    ]
                  }
                  onChange={null}
                />
              </td>
            ) : null}
            {column.join ? (
              <td>
                <ColumnPicker hasOwner={hasOwner} sourceSchema={sourceSchema} />
              </td>
            ) : null}
            <td>
              <StringSelect
                icon={"function"}
                inputItem={column.script}
                items={[]}
                onChange={null}
              />
            </td>
            {inputColumns.length > 1 ? (
              index == 0 ? (
                <td rowSpan={inputColumns.length}>
                  <StringSelect
                    icon={"function"}
                    inputItem={inputColumns.mergingScript}
                    items={[]}
                    onChange={null}
                  />
                </td>
              ) : null
            ) : null}
          </tr>
        ))
      : [];

    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th />
              <th>Column Path</th>
              <th colSpan={3}>Join</th>
              <th>Column Script</th>
              {inputColumns.length > 1 ? <th>Final Script</th> : null}
            </tr>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
}

import { ControlGroup, FormGroup, InputGroup, Switch } from "@blueprintjs/core";
import * as React from "react";

import StringSelect from "../../../../components/selects/stringSelect";
import { ISourceColumn, ISourceSchema } from "../../../../types";

export interface IProps {
  ownerChangeCallback?: any;
  tableChangeCallback?: any;
  columnChangeCallback?: any;
  hasOwner?: boolean;
  initialColumn?: {
    owner?: string;
    table: string;
    column: string;
  };
  sourceSchema: ISourceSchema;
  label?: string;
  vertical?: boolean;
}

export interface IState {
  owner?: string;
  table: string;
  column: string;
}

export default class ColumnPicker extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      owner: null,
      table: null,
      column: null
    };
  }

  static defaultProps = () => {
    hasOwner: true;
  };

  private changeOwner = (e: string) => {
    this.setState({
      owner: e,
      table: null,
      column: null
    });

    if (this.props.ownerChangeCallback) {
      this.props.ownerChangeCallback(e);
    }
  };

  private changeTable = (e: string) => {
    this.setState({
      table: e,
      column: null
    });

    if (this.props.tableChangeCallback) {
      this.props.tableChangeCallback(e);
    }
  };

  private changeColumn = (e: string) => {
    this.setState({
      column: e
    });

    if (this.props.columnChangeCallback) {
      this.props.columnChangeCallback(e);
    }
  };

  private static getDerivedStateFromProps(props: IProps, state: IState) {
    if (props.initialColumn) {
      return {
        owner: props.initialColumn.owner,
        table: props.initialColumn.table,
        column: props.initialColumn.column
      };
    }

    return state;
  }

  public render() {
    let { hasOwner, sourceSchema, label, vertical } = this.props;

    let { owner, table, column } = this.state;

    let owners = Object.keys(sourceSchema);

    let tables = hasOwner
      ? owner
        ? Object.keys(sourceSchema[owner])
        : []
      : Object.keys(sourceSchema);

    let columns = table
      ? ((hasOwner
          ? ((sourceSchema[owner] as { [key: string]: string[] })[
              table
            ] as string[])
          : (sourceSchema[table] as string[])) as any)
      : [];

    let controlGroup = (
      <ControlGroup fill={false} vertical={vertical || false}>
        {hasOwner ? (
          <StringSelect
            icon={"group-objects"}
            inputItem={owner}
            items={owners}
            onChange={this.changeOwner}
          />
        ) : null}
        <StringSelect
          disabled={hasOwner && !owner}
          icon={"th"}
          inputItem={table}
          items={tables}
          onChange={this.changeTable}
        />
        <StringSelect
          disabled={!table}
          icon={"column-layout"}
          inputItem={column}
          items={columns}
          onChange={this.changeColumn}
        />
      </ControlGroup>
    );

    return label ? (
      <FormGroup label={label} labelFor="text-input" inline={true}>
        {controlGroup}
      </FormGroup>
    ) : (
      controlGroup
    );
  }
}

import { ControlGroup, FormGroup, IPopoverProps } from '@blueprintjs/core';
import * as React from 'react';

import StringSelect from 'src/components/selects/stringSelect';
import { ISourceSchema } from 'src/types';

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
  fill?: boolean;
  popoverProps?: IPopoverProps;
  disabled?: boolean;
}

export interface IState {
  owner?: string;
  table?: string;
  column?: string;
}

export default class ColumnPicker extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      owner: undefined,
      table: undefined,
      column: undefined
    };
  }

  static defaultProps = () => ({
    hasOwner: true
  });

  private changeOwner = (e: string) => {
    this.setState({
      owner: e,
      table: undefined,
      column: undefined
    });

    if (this.props.ownerChangeCallback) {
      this.props.ownerChangeCallback(e);
    }
  };

  private changeTable = (e: string) => {
    this.setState({
      table: e,
      column: undefined
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
    const {
      hasOwner,
      sourceSchema,
      label,
      vertical,
      fill,
      popoverProps,
      disabled
    } = this.props;

    const { owner, table, column } = this.state;

    const owners = Object.keys(sourceSchema);

    const tables = hasOwner
      ? owner
        ? Object.keys(sourceSchema[owner])
        : []
      : Object.keys(sourceSchema);

    const columns = table
      ? ((hasOwner
          ? ((sourceSchema[owner!] as { [key: string]: string[] })[
              table
            ] as string[])
          : (sourceSchema[table] as string[])) as any)
      : [];

    const controlGroup = (
      <ControlGroup vertical={vertical || false} fill={fill || false}>
        {hasOwner ? (
          <StringSelect
            icon={'group-objects'}
            inputItem={owner!}
            items={owners}
            onChange={this.changeOwner}
            popoverProps={popoverProps || {}}
            disabled={disabled}
          />
        ) : null}
        <StringSelect
          disabled={disabled || (hasOwner && !owner)}
          icon={'th'}
          inputItem={table!}
          items={tables}
          onChange={this.changeTable}
          popoverProps={popoverProps || {}}
        />
        <StringSelect
          disabled={disabled || !table}
          icon={'column-layout'}
          inputItem={column!}
          items={columns}
          onChange={this.changeColumn}
          popoverProps={popoverProps || {}}
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

import { ControlGroup, FormGroup, IPopoverProps } from '@blueprintjs/core';
import React, { useState } from 'react';

import StringSelect from 'components/selects/stringSelect';
import { ISourceSchema } from 'types';

export interface Props {
  ownerChangeCallback?: Function;
  tableChangeCallback?: Function;
  columnChangeCallback?: Function;
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

const ColumnSelect = ({
  ownerChangeCallback,
  tableChangeCallback,
  columnChangeCallback,
  hasOwner,
  initialColumn,
  sourceSchema,
  label,
  vertical,
  fill,
  popoverProps,
  disabled
}: Props): React.ReactElement => {
  const [owner, setOwner] = useState(
    initialColumn ? initialColumn.owner : undefined
  );
  const [table, setTable] = useState(
    initialColumn ? initialColumn.table : undefined
  );
  const [column, setColumn] = useState(
    initialColumn ? initialColumn.column : undefined
  );

  const changeOwner = (e: string): void => {
    setOwner(e);
    setTable(undefined);
    setColumn(undefined);

    if (ownerChangeCallback) {
      ownerChangeCallback(e);
    }
  };

  const changeTable = (e: string): void => {
    setTable(e);
    setColumn(undefined);

    if (tableChangeCallback) {
      tableChangeCallback(e);
    }
  };

  const changeColumn = (e: string): void => {
    setColumn(e);

    if (columnChangeCallback) {
      columnChangeCallback(e);
    }
  };

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
          onChange={changeOwner}
          popoverProps={popoverProps || {}}
          disabled={disabled}
        />
      ) : null}
      <StringSelect
        disabled={disabled || (hasOwner && !owner)}
        icon={'th'}
        inputItem={table!}
        items={tables}
        onChange={changeTable}
        popoverProps={popoverProps || {}}
      />
      <StringSelect
        disabled={disabled || !table}
        icon={'column-layout'}
        inputItem={column!}
        items={columns}
        onChange={changeColumn}
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
};

export default ColumnSelect;

import { ControlGroup, FormGroup, IPopoverProps } from '@blueprintjs/core';
import React, { useState, useEffect } from 'react';

import StringSelect from 'components/selects/stringSelect';
import { ISourceSchema } from 'types';

export interface Props {
  tableChangeCallback?: Function;
  columnChangeCallback?: Function;
  initialTable?: string;
  initialColumn?: string;
  sourceSchema: ISourceSchema;
  label?: string;
  vertical?: boolean;
  fill?: boolean;
  popoverProps?: IPopoverProps;
  disabled?: boolean;
}

const ColumnSelect = ({
  tableChangeCallback,
  columnChangeCallback,
  initialTable,
  initialColumn,
  sourceSchema,
  label,
  vertical,
  fill,
  popoverProps,
  disabled
}: Props): React.ReactElement => {
  const [table, setTable] = useState(initialTable);
  const [column, setColumn] = useState(initialColumn);

  useEffect(() => {
    setTable(initialTable);
    setColumn(initialColumn);
  }, [initialTable, initialColumn]);

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

  const tables = Object.keys(sourceSchema);

  const columns = table ? ((sourceSchema[table] as string[]) as any) : [];

  const controlGroup = (
    <ControlGroup vertical={vertical || false} fill={fill || false}>
      <StringSelect
        disabled={disabled}
        icon={'th'}
        inputItem={table!}
        items={tables}
        maxItems={100}
        onChange={changeTable}
        popoverProps={popoverProps || {}}
      />
      <StringSelect
        disabled={disabled || !table}
        icon={'column-layout'}
        inputItem={column!}
        items={columns}
        maxItems={100}
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

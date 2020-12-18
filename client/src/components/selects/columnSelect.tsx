import { Button, ControlGroup, IPopoverProps } from '@blueprintjs/core';
import React, { useState, useEffect } from 'react';

import JoinSelect from './joinSelect';
import StringSelect from 'components/selects/stringSelect';
import { ISourceSchema, Join } from 'types';

export interface Props {
  tableChangeCallback?: Function;
  columnChangeCallback?: Function;
  allJoinsChangeCallback?: Function;
  joinChangeCallback?: Function;
  addJoinCallback?: Function;
  deleteJoinCallback?: Function;
  initialTable?: string;
  initialColumn?: string;
  sourceSchema: ISourceSchema;
  vertical?: boolean;
  fill?: boolean;
  initialJoins?: Join[];
  primaryKeyTable?: string;
  popoverProps?: IPopoverProps;
  disabled?: boolean;
}

const ColumnSelect = ({
  tableChangeCallback,
  columnChangeCallback,
  allJoinsChangeCallback,
  joinChangeCallback,
  addJoinCallback,
  deleteJoinCallback,
  initialTable,
  initialColumn,
  sourceSchema,
  vertical,
  fill,
  initialJoins,
  primaryKeyTable,
  popoverProps,
  disabled
}: Props): React.ReactElement => {
  const [table, setTable] = useState(initialTable);
  const [column, setColumn] = useState(initialColumn);
  const [joins, setJoins] = useState(initialJoins || []);

  useEffect(() => {
    setTable(initialTable);
    setColumn(initialColumn);
    setJoins(initialJoins || []);
  }, [initialTable, initialColumn, initialJoins]);

  useEffect(() => {
    if (allJoinsChangeCallback) allJoinsChangeCallback(joins);
  }, [joins]);

  const changeTable = (e: string): void => {
    setTable(e);
    setColumn(undefined);
    // TODO update joins mutation?
    setJoins([]);

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

  const columns = table ? sourceSchema[table] : [];
  const withJoins = table && primaryKeyTable && primaryKeyTable !== table;

  return (
    <div className={vertical ? 'column-select-vertical' : 'column-select'}>
      <div className="column-select-input">
        <ControlGroup fill={fill || false}>
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
          {withJoins && (
            <Button
              icon={'left-join'}
              onClick={() => {
                const emptyJoin = {
                  tables: [
                    { table: '', column: '' },
                    { table: '', column: '' }
                  ]
                };

                if (addJoinCallback) {
                  addJoinCallback(emptyJoin);
                } else {
                  setJoins([...joins, emptyJoin]);
                }
              }}
            />
          )}
        </ControlGroup>
      </div>
      <div className="column-select-joins">
        {withJoins &&
          joins.map((join, index) => (
            <ControlGroup key={index}>
              <Button
                icon="trash"
                onClick={() => {
                  joins.splice(index, 1);

                  if (deleteJoinCallback) {
                    deleteJoinCallback(join.id);
                  } else {
                    setJoins([...joins]);
                  }
                }}
              />
              <JoinSelect
                join={join}
                updateJoin={(
                  sourceTable: string,
                  sourceColumn: string,
                  targetTable: string,
                  targetColumn: string
                ) => {
                  const newJoin = {
                    tables: [
                      { table: sourceTable, column: sourceColumn },
                      { table: targetTable, column: targetColumn }
                    ]
                  };
                  joins[index] = newJoin;

                  if (joinChangeCallback) {
                    joinChangeCallback(join.id, newJoin);
                  } else {
                    setJoins([...joins]);
                  }
                }}
              />
            </ControlGroup>
          ))}
      </div>
    </div>
  );
};

export default ColumnSelect;

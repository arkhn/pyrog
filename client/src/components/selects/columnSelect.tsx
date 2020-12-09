import { Button, ControlGroup, Icon, IPopoverProps } from '@blueprintjs/core';
import React, { useState, useEffect } from 'react';

import JoinColumns from 'components/mapping/JoinColumns';
import StringSelect from 'components/selects/stringSelect';
import { ISourceSchema, Join } from 'types';

export interface Props {
  tableChangeCallback?: Function;
  columnChangeCallback?: Function;
  joinsChangeCallback?: Function;
  initialTable?: string;
  initialColumn?: string;
  sourceSchema: ISourceSchema;
  vertical?: boolean;
  fill?: boolean;
  withJoins?: boolean;
  initialJoins?: Join[];
  primaryKeyTable?: string;
  popoverProps?: IPopoverProps;
  disabled?: boolean;
}

const ColumnSelect = ({
  tableChangeCallback,
  columnChangeCallback,
  joinsChangeCallback,
  initialTable,
  initialColumn,
  sourceSchema,
  vertical,
  fill,
  withJoins,
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

  const changeTable = (e: string): void => {
    setTable(e);
    setColumn(undefined);
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

  const changeJoins = (
    sourceTable: string,
    sourceColumn: string,
    targetTable: string,
    targetColumn: string,
    index?: number
  ): void => {
    const newJoin = {
      tables: [
        { table: sourceTable, column: sourceColumn },
        { table: targetTable, column: targetColumn }
      ]
    };
    if (index !== undefined) {
      joins![index] = newJoin;
      setJoins([...joins!]);
    } else {
      setJoins([...joins!, newJoin]);
    }

    if (joinsChangeCallback) {
      joinsChangeCallback(joins);
    }
  };

  const tables = Object.keys(sourceSchema);

  const columns = table ? sourceSchema[table] : [];

  return (
    <ControlGroup vertical={true}>
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
        {withJoins && (
          <Button
            icon={'left-join'}
            onClick={() => {
              // addJoinToColumn({
              //   variables: {
              //     columnId: input.sqlValue.id,
              //     join: {
              //       source: {
              //         table: resource.primaryKeyTable
              //       },
              //       target: {
              //         table: input.sqlValue.table
              //       }
              //     }
              //   }
              // });
            }}
          />
        )}
      </ControlGroup>
      {withJoins &&
        joins!.map((join, index) => (
          <ControlGroup key={index} fill={fill || false}>
            <Icon icon="trash" />
            <JoinColumns
              join={join}
              updateJoin={(
                sourceTable: string,
                sourceColumn: string,
                targetTable: string,
                targetColumn: string
              ) =>
                changeJoins(
                  sourceTable,
                  sourceColumn,
                  targetTable,
                  targetColumn,
                  index
                )
              }
            />
          </ControlGroup>
        ))}
      {withJoins && joins!.length === 0 && table && table !== primaryKeyTable && (
        <ControlGroup fill={fill || false}>
          <Icon icon="trash" />
          <JoinColumns
            updateJoin={(
              sourceTable: string,
              sourceColumn: string,
              targetTable: string,
              targetColumn: string
            ) =>
              changeJoins(sourceTable, sourceColumn, targetTable, targetColumn)
            }
          />
          {/* TODO add join */}
        </ControlGroup>
      )}
    </ControlGroup>
  );
};

export default ColumnSelect;

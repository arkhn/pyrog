import { Button, ControlGroup, IPopoverProps } from '@blueprintjs/core';
import React, { useState, useEffect } from 'react';

import JoinSelect from './joinSelect';
import StringSelect from 'components/selects/stringSelect';
import { Owner, Join, ISourceSchema } from 'types';

export interface Props {
  ownerChangeCallback?: Function;
  tableChangeCallback?: Function;
  columnChangeCallback?: Function;
  allJoinsChangeCallback?: Function;
  joinChangeCallback?: Function;
  addJoinCallback?: Function;
  deleteJoinCallback?: Function;
  initialOwner?: Owner;
  initialTable?: string;
  initialColumn?: string;
  sourceOwners: Owner[];
  vertical?: boolean;
  fill?: boolean;
  initialJoins?: Join[];
  primaryKeyTable?: string;
  popoverProps?: IPopoverProps;
  disabled?: boolean;
}

const ColumnSelect = ({
  ownerChangeCallback,
  tableChangeCallback,
  columnChangeCallback,
  allJoinsChangeCallback,
  joinChangeCallback,
  addJoinCallback,
  deleteJoinCallback,
  initialOwner,
  initialTable,
  initialColumn,
  sourceOwners,
  vertical,
  fill,
  initialJoins,
  primaryKeyTable,
  popoverProps,
  disabled
}: Props): React.ReactElement => {
  const [owner, setOwner] = useState(initialOwner);
  const [table, setTable] = useState(initialTable);
  const [column, setColumn] = useState(initialColumn);
  const [joins, setJoins] = useState(initialJoins || []);

  useEffect(() => {
    setOwner(initialOwner);
    setTable(initialTable);
    setColumn(initialColumn);
    setJoins(initialJoins || []);
  }, [initialOwner, initialTable, initialColumn, initialJoins]);

  const changeOwner = (e: string): void => {
    const _owner = sourceOwners.find(o => o.name === e);
    if (ownerChangeCallback) {
      ownerChangeCallback(_owner);
    } else {
      setOwner(_owner);
      setTable(undefined);
      setColumn(undefined);
    }
  };

  const changeTable = (e: string): void => {
    if (tableChangeCallback) {
      tableChangeCallback(e);
    } else {
      setTable(e);
      setColumn(undefined);
    }

    // Update joins
    if (deleteJoinCallback) {
      joins.forEach(join => deleteJoinCallback(join.id));
    } else if (allJoinsChangeCallback) {
      allJoinsChangeCallback([]);
    }
  };

  const changeColumn = (e: string): void => {
    setColumn(e);

    if (columnChangeCallback) {
      columnChangeCallback(e);
    }
  };

  const owners = sourceOwners.map((o: Owner) => o.name);
  const tables = owner
    ? Object.keys(
        sourceOwners.find((o: Owner) => owner && o.name === owner.name)
          ?.schema as ISourceSchema
      )
    : [];
  const columns = table
    ? (sourceOwners.find((o: Owner) => owner && o.name === owner.name)?.schema[
        table
      ] as string[])
    : [];
  const withJoins = table && primaryKeyTable && primaryKeyTable !== table;

  return (
    <div className={vertical ? 'column-select-vertical' : 'column-select'}>
      <div className="column-select-input">
        <ControlGroup fill={fill || false}>
          <StringSelect
            disabled={disabled}
            icon={'th'}
            inputItem={owner?.name || ''}
            items={owners}
            maxItems={100}
            onChange={changeOwner}
            popoverProps={popoverProps || {}}
          />
          <StringSelect
            disabled={disabled}
            icon={'th'}
            inputItem={table || ''}
            items={tables}
            maxItems={100}
            onChange={changeTable}
            popoverProps={popoverProps || {}}
          />
          <StringSelect
            disabled={disabled || !table}
            icon={'column-layout'}
            inputItem={column || ''}
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

                addJoinCallback && addJoinCallback(emptyJoin);
                allJoinsChangeCallback &&
                  allJoinsChangeCallback([...joins, emptyJoin]);
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
                  deleteJoinCallback && deleteJoinCallback(join.id);
                  allJoinsChangeCallback && allJoinsChangeCallback(joins);
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

                  joinChangeCallback && joinChangeCallback(join.id, newJoin);
                  allJoinsChangeCallback && allJoinsChangeCallback(joins);
                }}
              />
            </ControlGroup>
          ))}
      </div>
    </div>
  );
};

export default ColumnSelect;

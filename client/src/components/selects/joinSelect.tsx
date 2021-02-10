import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import ColumnSelect from 'components/selects/columnSelect';

import { Column, IReduxStore, Owner } from 'types';

interface Props {
  join?: any;
  updateJoin: any;
}

const JoinSelect = ({ join, updateJoin }: Props): React.ReactElement => {
  const availableOwners = useSelector(
    (state: IReduxStore): Owner[] => state.selectedNode.source.credential.owners
  );

  const [sourceOwner, setSourceOwner] = useState(
    join?.tables && join.tables[0]?.owner
  );
  const [sourceTable, setSourceTable] = useState(
    join?.tables && join.tables[0]?.table
  );
  const [sourceColumn, setSourceColumn] = useState(
    join?.tables && join.tables[0]?.column
  );
  const [targetOwner, setTargetOwner] = useState(
    join?.tables && join.tables[1]?.owner
  );
  const [targetTable, setTargetTable] = useState(
    join?.tables && join.tables[1]?.table
  );
  const [targetColumn, setTargetColumn] = useState(
    join?.tables && join.tables[1]?.column
  );

  useEffect(() => {
    setSourceOwner(join?.tables && join.tables[0]?.owner);
    setSourceTable(join?.tables && join.tables[0]?.table);
    setSourceColumn(join?.tables && join.tables[0]?.column);
    setTargetOwner(join?.tables && join.tables[1]?.owner);
    setTargetTable(join?.tables && join.tables[1]?.table);
    setTargetColumn(join?.tables && join.tables[1]?.column);
  }, [join]);

  return (
    <div className="join-columns">
      <ColumnSelect
        columnChangeCallback={({ owner, table, column }: Column) => {
          setSourceOwner(owner);
          setSourceTable(table);
          setSourceColumn(column);
          updateJoin(
            owner,
            table,
            column,
            targetOwner,
            targetTable,
            targetColumn
          );
        }}
        initialOwner={sourceOwner}
        initialTable={sourceTable}
        initialColumn={sourceColumn}
        sourceOwners={availableOwners}
      />
      <ColumnSelect
        columnChangeCallback={({ owner, table, column }: Column) => {
          setTargetOwner(owner);
          setTargetTable(table);
          setTargetColumn(column);
          updateJoin(
            sourceOwner,
            sourceTable,
            sourceColumn,
            owner,
            table,
            column
          );
        }}
        initialOwner={targetOwner}
        initialTable={targetTable}
        initialColumn={targetColumn}
        sourceOwners={availableOwners}
      />
    </div>
  );
};

export default JoinSelect;

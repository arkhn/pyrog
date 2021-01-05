import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import ColumnSelect from 'components/selects/columnSelect';

import { IReduxStore, Owner } from 'types';

interface Props {
  join?: any;
  updateJoin: any;
}

const JoinSelect = ({ join, updateJoin }: Props): React.ReactElement => {
  const { source } = useSelector((state: IReduxStore) => state.selectedNode);

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
    setSourceTable(join?.tables && join.tables[0]?.table);
    setSourceColumn(join?.tables && join.tables[0]?.column);
    setTargetTable(join?.tables && join.tables[1]?.table);
    setTargetColumn(join?.tables && join.tables[1]?.column);
  }, [join]);

  return (
    <div className="join-columns">
      <ColumnSelect
        ownerChangeCallback={(o: Owner) => {
          setSourceOwner(o);
          updateJoin(o, '', '', targetOwner, targetTable, targetColumn);
        }}
        tableChangeCallback={(t: string) => {
          setSourceTable(t);
          updateJoin(
            sourceOwner,
            t,
            '',
            targetOwner,
            targetTable,
            targetColumn
          );
        }}
        columnChangeCallback={(c: string) => {
          setSourceColumn(c);
          updateJoin(
            sourceOwner,
            sourceTable,
            c,
            targetOwner,
            targetTable,
            targetColumn
          );
        }}
        initialTable={sourceTable}
        initialColumn={sourceColumn}
        sourceOwners={source.credential.owners}
      />
      <ColumnSelect
        ownerChangeCallback={(o: Owner) => {
          setTargetOwner(o);
          updateJoin(sourceOwner, sourceTable, sourceColumn, o, '', '');
        }}
        tableChangeCallback={(t: string) => {
          setTargetTable(t);
          updateJoin(
            sourceOwner,
            sourceTable,
            sourceColumn,
            targetOwner,
            t,
            ''
          );
        }}
        columnChangeCallback={(c: string) => {
          setTargetColumn(c);
          updateJoin(
            sourceOwner,
            sourceTable,
            sourceColumn,
            targetOwner,
            targetTable,
            c
          );
        }}
        initialTable={targetTable}
        initialColumn={targetColumn}
        sourceOwners={source.credential.owners}
      />
    </div>
  );
};

export default JoinSelect;

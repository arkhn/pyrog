import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import ColumnSelect from 'components/selects/columnSelect';

import { IReduxStore, ISourceSchema } from 'types';

interface Props {
  join?: any;
  updateJoin: any;
}

const JoinColumns = ({ join, updateJoin }: Props): React.ReactElement => {
  const { source } = useSelector((state: IReduxStore) => state.selectedNode);

  const [sourceTable, setSourceTable] = useState(join?.tables && join.tables[0]?.table);
  const [sourceColumn, setSourceColumn] = useState(join?.tables && join.tables[0]?.column);
  const [targetTable, setTargetTable] = useState(join?.tables && join.tables[1]?.table);
  const [targetColumn, setTargetColumn] = useState(join?.tables && join.tables[1]?.column);

  useEffect(() => {
    setSourceTable(join?.tables && join.tables[0]?.table)
    setSourceColumn(join?.tables && join.tables[0]?.column)
    setTargetTable(join?.tables && join.tables[1]?.table)
    setTargetColumn(join?.tables && join.tables[1]?.column)
  }, [join])

  useEffect(() => {
    updateJoin(sourceTable, sourceColumn, targetTable, targetColumn)
  }, [sourceTable, sourceColumn, targetTable, targetColumn])

  return (
    <div className="join-columns">
      <ColumnSelect
        tableChangeCallback={(e: string) => setSourceTable(e)}
        columnChangeCallback={(e: string) => setSourceColumn(e)}
        initialTable={sourceTable}
        initialColumn={sourceColumn}
        sourceSchema={source.credential.schema as ISourceSchema}
        />
      <ColumnSelect
        tableChangeCallback={(e: string) => setTargetTable(e)}
        columnChangeCallback={(e: string) => setTargetColumn(e)}
        initialTable={targetTable}
        initialColumn={targetColumn}
        sourceSchema={source.credential.schema as ISourceSchema}
      />
    </div>
  );
};

export default JoinColumns;

import React from 'react';
import { useSelector } from 'react-redux';

import ColumnSelect from 'components/selects/columnSelect';

import { IReduxStore, ISourceSchema } from 'types';

interface Props {
  join: any;
  updateJoin: any;
}

const JoinColumns = ({ join, updateJoin }: Props): React.ReactElement => {
  const { source } = useSelector(
    (state: IReduxStore) => state.selectedNode
  );

  return (
    <div className="join-columns">
      <ColumnSelect
        tableChangeCallback={(e: string) => {
          updateJoin({
            variables: {
              joinId: join.id,
              data: {
                source: {
                  table: e,
                  column: null
                }
              }
            }
          });
        }}
        columnChangeCallback={(e: string) => {
          updateJoin({
            variables: {
              joinId: join.id,
              data: {
                source: {
                  column: e
                }
              }
            }
          });
        }}
        initialTable={join.tables[0].table}
        initialColumn={join.tables[0].column}
        sourceSchema={source.credential.schema as ISourceSchema}
      />
      <ColumnSelect
        tableChangeCallback={(e: string) => {
          updateJoin({
            variables: {
              joinId: join.id,
              data: {
                target: {
                  table: e,
                  column: null
                }
              }
            }
          });
        }}
        columnChangeCallback={(e: string) => {
          updateJoin({
            variables: {
              joinId: join.id,
              data: {
                target: {
                  column: e
                }
              }
            }
          });
        }}
        initialTable={join.tables[1].table}
        initialColumn={join.tables[1].column}
        sourceSchema={source.credential.schema as ISourceSchema}
      />
    </div>
  );
};

export default JoinColumns;

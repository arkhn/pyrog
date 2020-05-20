import React from 'react';

import { ISelectedSource } from 'types';

// COMPONENTS
import ColumnSelect from 'components/selects/columnSelect';

interface Props {
  join: any;
  schema: any;
  source: ISelectedSource;
  updateJoin: any;
}

const JoinColumns = ({
  join,
  schema,
  source,
  updateJoin
}: Props): React.ReactElement => (
  <div className="join-columns">
    <ColumnSelect
      ownerChangeCallback={(e: string) => {
        updateJoin({
          variables: {
            joinId: join.id,
            data: {
              source: {
                owner: e,
                table: null,
                column: null
              }
            }
          }
        });
      }}
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
      initialOwner={join.tables[0].owner}
      initialTable={join.tables[0].table}
      initialColumn={join.tables[0].column}
      sourceSchema={schema}
    />
    <ColumnSelect
      ownerChangeCallback={(e: string) => {
        updateJoin({
          variables: {
            joinId: join.id,
            data: {
              target: {
                owner: e,
                table: null,
                column: null
              }
            }
          }
        });
      }}
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
      initialOwner={join.tables[1].owner}
      initialTable={join.tables[1].table}
      initialColumn={join.tables[1].column}
      sourceSchema={schema}
    />
  </div>
);

export default JoinColumns;

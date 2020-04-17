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
      hasOwner={source.hasOwner}
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
      initialColumn={{
        owner: join.tables[0].owner,
        table: join.tables[0].table,
        column: join.tables[0].column
      }}
      sourceSchema={schema}
    />
    <ColumnSelect
      hasOwner={source.hasOwner}
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
      initialColumn={{
        owner: join.tables[1].owner,
        table: join.tables[1].table,
        column: join.tables[1].column
      }}
      sourceSchema={schema}
    />
  </div>
);

export default JoinColumns;

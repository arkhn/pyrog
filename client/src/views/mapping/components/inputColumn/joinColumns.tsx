import * as React from "react";

import { ISelectedSource } from "../../../../types";

// COMPONENTS
import ColumnPicker from "../../../../components/columnPicker";

interface IProps {
  join: any;
  schema: any;
  source: ISelectedSource;
  updateJoin: any;
}

const JoinColumns = ({ join, schema, source, updateJoin }: IProps) => (
  <div className="join-columns">
    <ColumnPicker
      hasOwner={source.hasOwner}
      ownerChangeCallback={(e: string) => {
        updateJoin({
          variables: {
            id: join.id,
            data: {
              sourceOwner: e,
              sourceTable: null,
              sourceColumn: null
            }
          }
        });
      }}
      tableChangeCallback={(e: string) => {
        updateJoin({
          variables: {
            id: join.id,
            data: {
              sourceTable: e,
              sourceColumn: null
            }
          }
        });
      }}
      columnChangeCallback={(e: string) => {
        updateJoin({
          variables: {
            id: join.id,
            data: {
              sourceColumn: e
            }
          }
        });
      }}
      initialColumn={{
        owner: join.sourceOwner,
        table: join.sourceTable,
        column: join.sourceColumn
      }}
      sourceSchema={schema}
    />
    <ColumnPicker
      hasOwner={source.hasOwner}
      ownerChangeCallback={(e: string) => {
        updateJoin({
          variables: {
            id: join.id,
            data: {
              targetOwner: e,
              targetTable: null,
              targetColumn: null
            }
          }
        });
      }}
      tableChangeCallback={(e: string) => {
        updateJoin({
          variables: {
            id: join.id,
            data: {
              targetTable: e,
              targetColumn: null
            }
          }
        });
      }}
      columnChangeCallback={(e: string) => {
        updateJoin({
          variables: {
            id: join.id,
            data: {
              targetColumn: e
            }
          }
        });
      }}
      initialColumn={{
        owner: join.targetOwner,
        table: join.targetTable,
        column: join.targetColumn
      }}
      sourceSchema={schema}
    />
  </div>
);

export default JoinColumns;

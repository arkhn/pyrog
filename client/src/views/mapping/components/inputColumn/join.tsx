import { Button } from "@blueprintjs/core";
import * as React from "react";
import { Mutation, Subscription } from "react-apollo";

import { ISelectedSource } from "../../../../types";

// COMPONENTS
import JoinColumns from "./joinColumns";

// GRAPHQL
const deleteJoinAndUpdateInputColumn = require("../../../../graphql/mutations/deleteJoinAndUpdateInputColumn.graphql");
const updateJoin = require("../../../../graphql/mutations/updateJoin.graphql");
const subscribeJoin = require("../../../../graphql/subscriptions/join.graphql");

interface IProps {
  column: any;
  schema: any;
  source: ISelectedSource;
  join: any;
  joinIndex: any;
}

const Join = ({ column, schema, source, join, joinIndex }: IProps) => (
  <Subscription
    key={joinIndex}
    subscription={subscribeJoin}
    variables={{
      id: join.id
    }}
  >
    {({ data, loading }: any) => {
      const joinData =
        data && data.join && data.join.node ? data.join.node : join;

      return joinData ? (
        <div className={"join"}>
          <Mutation mutation={deleteJoinAndUpdateInputColumn}>
            {(deleteJoin: any, { data, loading }: any) => {
              return (
                <Button
                  icon={"trash"}
                  minimal={true}
                  loading={loading}
                  onClick={() => {
                    deleteJoin({
                      variables: {
                        inputColumnId: column.id,
                        joinId: joinData.id
                      }
                    });
                  }}
                />
              );
            }}
          </Mutation>
          <Mutation mutation={updateJoin}>
            {(updateJoin: any, { data, loading }: any) => {
              return (
                <JoinColumns
                  join={joinData}
                  updateJoin={updateJoin}
                  schema={schema}
                  source={source}
                />
              );
            }}
          </Mutation>
        </div>
      ) : null;
    }}
  </Subscription>
);

export default Join;

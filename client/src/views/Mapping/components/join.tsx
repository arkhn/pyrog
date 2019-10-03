import { Button } from "@blueprintjs/core";
import * as React from "react";
import { Mutation } from "react-apollo";

import { ISelectedSource } from "../../../types";

// COMPONENTS
import JoinColumns from "./joinColumns";

// GRAPHQL
const deleteJoinAndUpdateInputColumn = require("../../../graphql/mutations/deleteJoinAndUpdateInputColumn.graphql");
const updateJoin = require("../../../graphql/mutations/updateJoin.graphql");

interface IProps {
  column: any;
  joinData: any;
  schema: any;
  source: ISelectedSource;
}

const Join = ({ column, joinData, schema, source }: IProps) => (
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
);

export default Join;

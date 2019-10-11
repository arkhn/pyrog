import { Button } from "@blueprintjs/core";

import * as React from "react";

import { Mutation } from "react-apollo";

const createJoinAndUpdateInputColumn = require("../../../../graphql/mutations/createJoinAndUpdateInputColumn.graphql");

interface IProps {
  column: any;
}

const InputColumnAddJoin = ({ column }: IProps) => (
  <Mutation mutation={createJoinAndUpdateInputColumn}>
    {(createJoin: any, { data, loading }: any) => {
      return (
        <Button
          icon={"add"}
          loading={loading}
          onClick={() => {
            createJoin({
              variables: {
                inputColumnId: column.id,
                data: {}
              }
            });
          }}
        >
          Add Join
        </Button>
      );
    }}
  </Mutation>
);

export default InputColumnAddJoin;

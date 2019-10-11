import { Button } from "@blueprintjs/core";

import * as React from "react";
import { Mutation } from "react-apollo";

const deleteInputColumnAndUpdateAttribute = require("../../../../graphql/mutations/deleteInputColumnAndUpdateAttribute.graphql");

interface IProps {
  attribute: {
    id: string;
    name: string;
  };
  column: any;
}

const InputColumnDeleteButton = ({ attribute, column }: IProps) => {
  return (
    <Mutation mutation={deleteInputColumnAndUpdateAttribute}>
      {(deleteInputColumn: any, { data, loading, error }: any) => {
        return (
          <Button
            icon={"trash"}
            loading={loading}
            minimal={true}
            onClick={() => {
              deleteInputColumn({
                variables: {
                  attributeId: attribute.id,
                  inputColumnId: column.id
                }
              });
            }}
          />
        );
      }}
    </Mutation>
  );
};

export default InputColumnDeleteButton;

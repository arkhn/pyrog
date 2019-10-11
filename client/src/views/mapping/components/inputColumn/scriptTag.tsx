import { Tag } from "@blueprintjs/core";

import * as React from "react";

import { Mutation } from "react-apollo";

import StringSelect from "../../../../components/selects/stringSelect";

const updateInputColumn = require("../../../../graphql/mutations/updateInputColumn.graphql");

interface IProps {
  column: any;
}

const InputColumnScriptTag = ({ column }: IProps) => (
  <Mutation mutation={updateInputColumn}>
    {(updateInputColumn: any, { data, loading }: any) => {
      return (
        <div className="stacked-tags">
          <Tag>SCRIPT</Tag>
          <StringSelect
            disabled={true}
            inputItem={column.script}
            items={["script1.py", "script2.py"]}
            loading={loading}
            onChange={(e: string) => {
              updateInputColumn({
                variables: {
                  id: column.id,
                  data: {
                    script: e
                  }
                }
              });
            }}
          />
        </div>
      );
    }}
  </Mutation>
);

export default InputColumnScriptTag;

import { Tag } from "@blueprintjs/core";

import * as React from "react";

import { Mutation } from "react-apollo";

import ScriptSelect from "../../../../components/selects/scriptSelect";

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
          <ScriptSelect
            loading={loading}
            selectedScript={column.script}
            onChange={(script: string) => {
              updateInputColumn({
                variables: {
                  id: column.id,
                  data: { script }
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

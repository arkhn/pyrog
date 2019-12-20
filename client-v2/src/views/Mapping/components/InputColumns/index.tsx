import { Tag, Spinner } from "@blueprintjs/core";
import * as React from "react";
import { Mutation, Query } from "react-apollo";

import { ISelectedSource } from "src/types";

// COMPONENTS
import StringSelect from "src/components/selects/stringSelect";
import InputColumn from "./../InputColumn";

// GRAPHQL
const qInputsForAttribute = require("src/graphql/queries/inputsForAttribute.graphql");
const mUpdateAttribute = require("src/graphql/mutations/updateAttribute.graphql");

interface IProps {
  schema: any;
  selectedAttribute: {
    id: string;
    name: string;
  };
  source: ISelectedSource;
}

const InputColumns = ({ schema, selectedAttribute, source }: IProps) => {
  return (
    <Query
      query={qInputsForAttribute}
      variables={{ attributeId: selectedAttribute.id }}
      skip={!selectedAttribute.id}
    >
      {({ data, loading }: any) => {
        if (loading) {
          return <Spinner />;
        }
        const attribute = data && data.attribute
          ? data.attribute
          : null;
        const inputs = attribute && attribute.inputs
          ? attribute.inputs
          : [];
        return (
          <div id="input-columns">
            <div id="input-column-rows">
              {inputs.map((input: any, index: number) => {
                return input ? (
                  <InputColumn
                    key={index}
                    attribute={selectedAttribute}
                    input={input}
                    schema={schema}
                    source={source}
                  />
                ) : null;
              })}
            </div>
            {inputs.length > 1 ? (
              <div id="input-column-merging-script">
                <Mutation mutation={mUpdateAttribute}>
                  {(updateAttribute: any, { data, loading }: any) => {
                    return (
                      <div className="stacked-tags">
                        <Tag>SCRIPT</Tag>
                        <StringSelect
                          disabled={true}
                          inputItem={
                            attribute && attribute.mergingScript
                              ? attribute.mergingScript
                              : ""
                          }
                          items={["mergingScript.py"]}
                          loading={loading}
                          onChange={(e: string) => {
                            updateAttribute({
                              variables: {
                                id: selectedAttribute.id,
                                data: {
                                  mergingScript: e
                                }
                              }
                            });
                          }}
                        />
                      </div>
                    );
                  }}
                </Mutation>
              </div>
            ) : null}
          </div>
        );
      }}
    </Query>
  );
};

export default InputColumns;

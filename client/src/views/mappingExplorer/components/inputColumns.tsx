import { Tag, Spinner } from "@blueprintjs/core";
import * as React from "react";
import { Mutation, Query, Subscription } from "react-apollo";

import { ISelectedSource } from "../../../types";

// COMPONENTS
import StringSelect from "../../../components/selects/stringSelect";
import InputColumn from "./inputColumn";

// GRAPHQL
const inputColumns = require("../../../graphql/queries/inputColumns.graphql");
const updateAttribute = require("../../../graphql/mutations/updateAttribute.graphql");
const subscribeAttribute = require("../../../graphql/subscriptions/attribute.graphql");
const subscribeInputColumn = require("../../../graphql/subscriptions/inputColumn.graphql");

interface IProps {
  attribute: {
    id: string;
    name: string;
  };
  schema: any;
  source: ISelectedSource;
}

const InputColumns = ({ attribute, schema, source }: IProps) => {
  return (
    <Query
      query={inputColumns}
      variables={{ attributeId: attribute.id }}
      skip={!attribute.id}
    >
      {({ data, loading }: any) => {
        if (loading) {
          return <Spinner />;
        }
        let inputColumns = data && data.inputColumns ? data.inputColumns : [];

        return attribute.id ? (
          <Subscription
            subscription={subscribeAttribute}
            variables={{
              id: attribute.id
            }}
          >
            {({ data, loading, error }: any) => {
              const attribute =
                data && data.attribute && data.attribute.node
                  ? data.attribute.node
                  : null;

              inputColumns =
                attribute && attribute.inputColumns
                  ? attribute.inputColumns
                  : inputColumns;

              return (
                <div id="input-columns">
                  <div id="input-column-rows">
                    {inputColumns.map((inputColumn: any, index: number) => {
                      return (
                        <Subscription
                          key={index}
                          subscription={subscribeInputColumn}
                          variables={{
                            id: inputColumn.id
                          }}
                        >
                          {({ data, loading }: any) => {
                            const column =
                              data && data.inputColumn && data.inputColumn.node
                                ? data.inputColumn.node
                                : inputColumn;

                            return column ? (
                              <InputColumn
                                attribute={attribute}
                                column={column}
                                schema={schema}
                                source={source}
                              />
                            ) : null;
                          }}
                        </Subscription>
                      );
                    })}
                  </div>
                  {inputColumns.length > 1 ? (
                    <div id="input-column-merging-script">
                      <Mutation mutation={updateAttribute}>
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
                                      id: attribute.id,
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
          </Subscription>
        ) : null;
      }}
    </Query>
  );
};

export default InputColumns;

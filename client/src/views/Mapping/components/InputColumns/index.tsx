import { Tag, Spinner } from "@blueprintjs/core";
import * as React from "react";
import { Mutation, Query } from "react-apollo";

import { ISelectedSource } from "src/types";

// COMPONENTS
import ScriptSelect from "src/components/selects/scriptSelect";
import InputColumn from "./../InputColumn";

// GRAPHQL
const inputColumns = require("src/graphql/queries/inputColumns.graphql");
const updateAttribute = require("src/graphql/mutations/updateAttribute.graphql");
const attributeInfo = require("src/graphql/queries/attributeInfo.graphql");

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
      query={inputColumns}
      variables={{ attributeId: selectedAttribute.id }}
      skip={!selectedAttribute.id}
    >
      {({ data, loading }: any) => {
        if (loading) {
          return <Spinner />;
        }
        let inputColumns = data && data.inputColumns ? data.inputColumns : [];

        return selectedAttribute.id ? (
          <Query
            query={attributeInfo}
            variables={{
              attributeId: selectedAttribute.id
            }}
          >
            {({ data, loading, error }: any) => {
              const attribute =
                data && data.attributeInfo
                  ? data.attributeInfo
                  : null;

              return (
                <div id="input-columns">
                  <div id="input-column-rows">
                    {inputColumns.map((inputColumn: any, index: number) => {
                      return (
                        <InputColumn
                          key={index}
                          attribute={selectedAttribute}
                          column={inputColumn}
                          schema={schema}
                          source={source}
                        />
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
                              <ScriptSelect
                                loading={loading}
                                selectedScript={attribute.mergingScript}
                                onChange={(script: string) =>
                                  updateAttribute({
                                    variables: {
                                      id: attribute.id,
                                      data: {
                                        mergingScript: script
                                      },
                                    }
                                  })
                                }
                                onClear={(): any =>
                                  updateAttribute({
                                    variables: {
                                      id: attribute.id,
                                      data: {
                                        mergingScript: null
                                      },
                                    }
                                  })
                                }
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
        ) : null;
      }}
    </Query>
  );
};

export default InputColumns;

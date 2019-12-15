import { Tag, Spinner } from "@blueprintjs/core";
import * as React from "react";
import { Mutation, Query, Subscription } from "react-apollo";

import { ISelectedSource } from "src/types";

// COMPONENTS
import StringSelect from "src/components/selects/stringSelect";
import InputColumn from "./../InputColumn";

// GRAPHQL
const qInputsForAttribute = require("src/graphql/queries/inputsForAttribute.graphql");
const updateAttribute = require("src/graphql/mutations/updateAttribute.graphql");
// const subscribeAttribute = require("src/graphql/subscriptions/attribute.graphql");
// const subscribeInputColumn = require("src/graphql/subscriptions/inputColumn.graphql");

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

        // return selectedAttribute.id ? (
        //   <Subscription
        //     subscription={subscribeAttribute}
        //     variables={{
        //       id: selectedAttribute.id
        //     }}
        //   >
        //     {({ data, loading, error }: any) => {
        //       const attribute =
        //         data && data.attribute && data.attribute.node
        //           ? data.attribute.node
        //           : null;

        //       inputColumns =
        //         attribute && attribute.inputColumns
        //           ? attribute.inputColumns
        //           : inputColumns;

        //       return (
        //         <div id="input-columns">
        //           <div id="input-column-rows">
        //             {inputColumns.map((inputColumn: any, index: number) => {
        //               return (
        //                 <Subscription
        //                   key={index}
        //                   subscription={subscribeInputColumn}
        //                   variables={{
        //                     id: inputColumn.id
        //                   }}
        //                 >
        //                   {({ data, loading }: any) => {
        //                     const column =
        //                       data && data.inputColumn && data.inputColumn.node
        //                         ? data.inputColumn.node
        //                         : inputColumn;

        //                     return column ? (
        //                       <InputColumn
        //                         attribute={selectedAttribute}
        //                         column={column}
        //                         schema={schema}
        //                         source={source}
        //                       />
        //                     ) : null;
        //                   }}
        //                 </Subscription>
        //               );
        //             })}
        //           </div>
        //           {inputColumns.length > 1 ? (
        //             <div id="input-column-merging-script">
        //               <Mutation mutation={updateAttribute}>
        //                 {(updateAttribute: any, { data, loading }: any) => {
        //                   return (
        //                     <div className="stacked-tags">
        //                       <Tag>SCRIPT</Tag>
        //                       <StringSelect
        //                         disabled={true}
        //                         inputItem={
        //                           attribute && attribute.mergingScript
        //                             ? attribute.mergingScript
        //                             : ""
        //                         }
        //                         items={["mergingScript.py"]}
        //                         loading={loading}
        //                         onChange={(e: string) => {
        //                           updateAttribute({
        //                             variables: {
        //                               id: selectedAttribute.id,
        //                               data: {
        //                                 mergingScript: e
        //                               }
        //                             }
        //                           });
        //                         }}
        //                       />
        //                     </div>
        //                   );
        //                 }}
        //               </Mutation>
        //             </div>
        //           ) : null}
        //         </div>
        //       );
        //     }}
        //   </Subscription>
        // ) : null;
      }}
    </Query>
  );
};

export default InputColumns;

import {
  Breadcrumbs,
  Button,
  Card,
  Elevation,
  IBreadcrumbProps,
  Tag
} from "@blueprintjs/core";
import * as React from "react";
import { Mutation, Subscription } from "react-apollo";

import { ISelectedSource } from "src/types";

// COMPONENTS
import Join from "./../Join";
import ScriptSelect from "src/components/selects/scriptSelect";

// GRAPHQL
const updateInputColumn = require("src/graphql/mutations/updateInputColumn.graphql");
const mDeleteInput = require("src/graphql/mutations/deleteInput.graphql");
const mAddJoinToColumn = require("src/graphql/mutations/addJoinToColumn.graphql");
const subscribeJoin = require("src/graphql/subscriptions/join.graphql");

interface IProps {
  attribute: {
    id: string;
    name: string;
  };
  input: any;
  schema: any;
  source: ISelectedSource;
}

const InputColumn = ({ attribute, input, schema, source }: IProps) => (
  <div className="input-column">
    <Mutation mutation={mDeleteInput}>
      {(deleteInput: any, { loading }: any) => {
        return (
          <Button
            icon={"trash"}
            loading={loading}
            minimal={true}
            onClick={() => {
              deleteInput({
                variables: {
                  id: input.id
                }
              });
            }}
          />
        );
      }}
    </Mutation>
    <Card elevation={Elevation.ONE} className="input-column-info">
      {input.staticValue ? (
        <div className="input-column-name">
          <Tag large={true}>Static</Tag>
          <Tag intent={"success"} large={true} minimal={true}>
            {input.staticValue}
          </Tag>
        </div>
      ) : (
        <div>
          <div className="input-column-name">
            <Breadcrumbs
              breadcrumbRenderer={(item: IBreadcrumbProps) => {
                return <div>{item.text}</div>;
              }}
              items={
                source.hasOwner
                  ? [
                      {
                        text: (
                          <div className="stacked-tags">
                            <Tag minimal={true}>OWNER</Tag>
                            <Tag intent={"success"} large={true}>
                              {input.sqlValue.owner}
                            </Tag>
                          </div>
                        )
                      },
                      {
                        text: (
                          <div className="stacked-tags">
                            <Tag minimal={true}>TABLE</Tag>
                            <Tag intent={"success"} large={true}>
                              {input.sqlValue.table}
                            </Tag>
                          </div>
                        )
                      },
                      {
                        text: (
                          <div className="stacked-tags">
                            <Tag minimal={true}>COLUMN</Tag>
                            <Tag intent={"success"} large={true}>
                              {input.sqlValue.column}
                            </Tag>
                          </div>
                        )
                      }
                    ]
                  : [
                      {
                        text: (
                          <div className="stacked-tags">
                            <Tag minimal={true}>TABLE</Tag>
                            <Tag intent={"success"} large={true}>
                              {input.sqlValue.table}
                            </Tag>
                          </div>
                        )
                      },
                      {
                        text: (
                          <div className="stacked-tags">
                            <Tag minimal={true}>COLUMN</Tag>
                            <Tag intent={"success"} large={true}>
                              {input.sqlValue.column}
                            </Tag>
                          </div>
                        )
                      }
                    ]
              }
            />
            <Mutation mutation={updateInputColumn}>
              {(updateInputColumn: any, { data, loading }: any) => {
                return (
                  <div className="stacked-tags">
                    <Tag>SCRIPT</Tag>
                    <ScriptSelect
                      loading={loading}
                      selectedScript={input.script}
                      onChange={(script: string) => {
                        updateInputColumn({
                          variables: {
                            id: input.id,
                            data: { script }
                          }
                        });
                      }}
                      onClear={(): any => {
                        updateInputColumn({
                          variables: {
                            id: input.id,
                            data: { script: null }
                          }
                        });
                      }}
                    />
                  </div>
                );
              }}
            </Mutation>
          </div>
          <div className="input-column-joins">
            <Mutation mutation={mAddJoinToColumn}>
              {(addJoinToColumn: any, { data, loading }: any) => {
                return (
                  <Button
                    icon={"add"}
                    loading={loading}
                    onClick={() => {
                      addJoinToColumn({
                        variables: {
                          columnId: input.sqlValue.id,
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
            {input.sqlValue.joins
              ? input.sqlValue.joins.map((join: any, index: number) => {
                  let joinData = join;
                  return (
                    <Subscription
                      key={index}
                      subscription={subscribeJoin}
                      variables={{
                        id: join.id
                      }}
                    >
                      {({ data, loading }: any) => {
                        joinData =
                          data && data.join && data.join.node
                            ? data.join.node
                            : joinData;

                        return joinData ? (
                          <Join
                            column={input.sqlValue}
                            joinData={joinData}
                            schema={schema}
                            source={source}
                          />
                        ) : null;
                      }}
                    </Subscription>
                  );
                })
              : null}
          </div>
        </div>
      )}
    </Card>
  </div>
);

export default InputColumn;

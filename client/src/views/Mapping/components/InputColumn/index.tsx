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

import { ISelectedSource } from "../../../../types";

// COMPONENTS
import StringSelect from "../../../../components/selects/stringSelect";
import Join from "./../Join";
import ScriptSelect from "../../../../components/selects/scriptSelect";

// GRAPHQL
const updateInputColumn = require("../../../../graphql/mutations/updateInputColumn.graphql");
const deleteInputColumnAndUpdateAttribute = require("../../../../graphql/mutations/deleteInputColumnAndUpdateAttribute.graphql");
const createJoinAndUpdateInputColumn = require("../../../../graphql/mutations/createJoinAndUpdateInputColumn.graphql");
const subscribeJoin = require("../../../../graphql/subscriptions/join.graphql");

interface IProps {
  attribute: {
    id: string;
    name: string;
  };
  column: any;
  schema: any;
  source: ISelectedSource;
}

const InputColumn = ({ attribute, column, schema, source }: IProps) => (
  <div className="input-column">
    <Mutation mutation={deleteInputColumnAndUpdateAttribute}>
      {(deleteInputColumn: any, { loading }: any) => {
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
    <Card elevation={Elevation.ONE} className="input-column-info">
      {column.staticValue ? (
        <div className="input-column-name">
          <Tag large={true}>Static</Tag>
          <Tag intent={"success"} large={true} minimal={true}>
            {column.staticValue}
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
                              {column.owner}
                            </Tag>
                          </div>
                        )
                      },
                      {
                        text: (
                          <div className="stacked-tags">
                            <Tag minimal={true}>TABLE</Tag>
                            <Tag intent={"success"} large={true}>
                              {column.table}
                            </Tag>
                          </div>
                        )
                      },
                      {
                        text: (
                          <div className="stacked-tags">
                            <Tag minimal={true}>COLUMN</Tag>
                            <Tag intent={"success"} large={true}>
                              {column.column}
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
                              {column.table}
                            </Tag>
                          </div>
                        )
                      },
                      {
                        text: (
                          <div className="stacked-tags">
                            <Tag minimal={true}>COLUMN</Tag>
                            <Tag intent={"success"} large={true}>
                              {column.column}
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
                      selectedScript={column.script}
                      onChange={(script: string) => {
                        updateInputColumn({
                          variables: {
                            id: column.id,
                            data: { script }
                          }
                        });
                      }}
                      onClear={(): any => {
                        updateInputColumn({
                          variables: {
                            id: column.id,
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
            {column.joins
              ? column.joins.map((join: any, index: number) => {
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
                            column={column}
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

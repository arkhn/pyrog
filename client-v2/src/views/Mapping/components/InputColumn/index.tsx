import {
  Breadcrumbs,
  Button,
  Card,
  Elevation,
  IBreadcrumbProps,
  Tag
} from "@blueprintjs/core";
import * as React from "react";
import { Subscription } from "react-apollo";
import { useMutation } from '@apollo/react-hooks';

import { ISelectedSource } from "src/types";

// COMPONENTS
import Join from "./../Join";
import ScriptSelect from "src/components/selects/scriptSelect";

// GRAPHQL
const qInputsForAttribute = require("src/graphql/queries/inputsForAttribute.graphql");
const mUpdateInputColumn = require("src/graphql/mutations/updateInputColumn.graphql");
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

const InputColumn = ({ attribute, input, schema, source }: IProps) => {
  const [
    deleteInput,
    { data: dataDelInput, loading: loadDelInput }
  ] = useMutation(mDeleteInput);
  const [
    addJoinToColumn,
    { data: dataAddJoin, loading: loadAddJoin }
  ] = useMutation(mAddJoinToColumn);
  const [
    updateInputColumn,
    { loading: loadUpdInput }
  ] = useMutation(mUpdateInputColumn);

  const removeInputFromCache = (cache: any) => {
    const data = cache.readQuery({
      query: qInputsForAttribute,
      variables: {
        attributeId: attribute.id
      }
    });
    const newData = {
      attribute: {
        __typename: data.attribute.__typename,
        id: data.attribute.id,
        inputs:
          data.attribute.inputs.filter((i: any) => i.id !== input.id),
      }
    }
    cache.writeQuery({
      query: qInputsForAttribute,
      variables: {
        attributeId: attribute.id
      },
      data: newData
    });
  }

  return (
    <div className="input-column">
      <Button
        icon={"trash"}
        loading={loadDelInput}
        minimal={true}
        onClick={() => {
          deleteInput({
            variables: {
              id: input.id
            },
            update: removeInputFromCache,
          });
        }}
      />
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
                <div className="stacked-tags">
                  <Tag>SCRIPT</Tag>
                  <ScriptSelect
                    loading={loadUpdInput}
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
              </div>
              <div className="input-column-joins">
                <Button
                  icon={"add"}
                  loading={loadAddJoin}
                  onClick={() => {
                    addJoinToColumn({
                      variables: {
                        columnId: input.sqlValue.id,
                      }
                    });
                  }}
                >
                  Add Join
                </Button>
                {console.log(input.sqlValue)}
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
  )
};

export default InputColumn;

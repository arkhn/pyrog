import {
  Breadcrumbs,
  Button,
  Card,
  Elevation,
  IBreadcrumbProps,
  Tag
} from "@blueprintjs/core";
import * as React from "react";
import { useMutation } from '@apollo/react-hooks';

import { ISelectedSource } from "src/types";

// COMPONENTS
import Join from "./../Join";
import ScriptSelect from "src/components/selects/scriptSelect";

// GRAPHQL
const qInputsForAttribute = require("src/graphql/queries/inputsForAttribute.graphql");
const mUpdateInput = require("src/graphql/mutations/updateInput.graphql");
const mDeleteInput = require("src/graphql/mutations/deleteInput.graphql");
const mAddJoinToColumn = require("src/graphql/mutations/addJoinToColumn.graphql");

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
    { loading: loadDelInput }
  ] = useMutation(mDeleteInput);
  const [
    addJoinToColumn,
    { loading: loadAddJoin }
  ] = useMutation(mAddJoinToColumn);
  const [
    updateInput,
    { loading: loadUpdInput }
  ] = useMutation(mUpdateInput);

  const removeInputFromCache = (cache: any) => {
    const { attribute: dataAttribute } = cache.readQuery({
      query: qInputsForAttribute,
      variables: {
        attributeId: attribute.id
      }
    });
    const newDataAttribute = {
      ...dataAttribute,
      inputs:
        dataAttribute.inputs.filter((i: any) => i.id !== input.id),
    }
    cache.writeQuery({
      query: qInputsForAttribute,
      variables: {
        attributeId: attribute.id
      },
      data: { attribute: newDataAttribute }
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
                      updateInput({
                        variables: {
                          inputId: input.id,
                          data: { script }
                        }
                      });
                    }}
                    onClear={(): any => {
                      updateInput({
                        variables: {
                          inputId: input.id,
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
                {input.sqlValue.joins
                  ? input.sqlValue.joins.map((join: any, index: number) =>
                    <Join
                      key={index}
                      joinData={join}
                      schema={schema}
                      source={source}
                    />
                  )
                  : null}
              </div>
            </div>
          )}
      </Card>
    </div>
  )
};

export default InputColumn;

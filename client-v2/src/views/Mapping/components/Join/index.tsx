import { Button } from "@blueprintjs/core";
import * as React from "react";
import { useSelector } from "react-redux";
import { IReduxStore } from "src/types";
import { useMutation } from '@apollo/react-hooks';

import { ISelectedSource } from "../../../../types";

// COMPONENTS
import JoinColumns from "./../JoinColumns";

// GRAPHQL
const qInputsForAttribute = require("src/graphql/queries/inputsForAttribute.graphql");
const mUpdateJoin = require("src/graphql/mutations/updateJoin.graphql");
const mDeleteJoin = require("src/graphql/mutations/deleteJoin.graphql");

interface IProps {
  joinData: any;
  schema: any;
  source: ISelectedSource;
}

const Join = ({ joinData, schema, source }: IProps) => {
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);

  const updateJoin = useMutation(mUpdateJoin)
  const [
    deleteJoin,
    { loading: deletingJoin }
  ] = useMutation(mDeleteJoin)

  const removeJoin = (input: any) => {
    return {
      ...input,
      sqlValue: {
        ...input.sqlValue,
        joins: input.sqlValue.joins.filter((j: any) => j.id !== joinData.id),
      }
    }
  }

  const removeJoinFromCache = (cache: any) => {
    const data = cache.readQuery({
      query: qInputsForAttribute,
      variables: {
        attributeId: selectedNode.attribute.id
      }
    });
    const newData = {
      attribute: {
        ...data.attribute,
        inputs:
          data.attribute.inputs.map(removeJoin),
      }
    }
    cache.writeQuery({
      query: qInputsForAttribute,
      variables: {
        attributeId: selectedNode.attribute.id
      },
      data: newData
    });
  }

  return (
    <div className={"join"}>
      <Button
        icon={"trash"}
        minimal={true}
        loading={deletingJoin}
        onClick={() => {
          deleteJoin({
            variables: {
              id: joinData.id
            },
            update: removeJoinFromCache,
          });
        }}
      />

      <JoinColumns
        join={joinData}
        updateJoin={updateJoin}
        schema={schema}
        source={source}
      />
    </div>
  )
}

export default Join;

import { Button } from '@blueprintjs/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { IReduxStore } from 'types';
import { useMutation } from '@apollo/react-hooks';

import { ISelectedSource } from 'types';

// COMPONENTS
import JoinColumns from '../JoinColumns';
import { loader } from 'graphql.macro';

// GRAPHQL
const qInputsForAttribute = loader(
  'src/graphql/queries/inputsForAttribute.graphql'
);
const mUpdateJoin = loader('src/graphql/mutations/updateJoin.graphql');
const mDeleteJoin = loader('src/graphql/mutations/deleteJoin.graphql');

interface IProps {
  joinData: any;
  schema: any;
  source: ISelectedSource;
}

const Join = ({ joinData, schema, source }: IProps) => {
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);

  const [updateJoin, { loading: updatingJoin }] = useMutation(mUpdateJoin);
  const [deleteJoin, { loading: deletingJoin }] = useMutation(mDeleteJoin);

  const removeJoin = (input: any) => {
    return {
      ...input,
      sqlValue: {
        ...input.sqlValue,
        joins: input.sqlValue.joins.filter((j: any) => j.id !== joinData.id)
      }
    };
  };

  const removeJoinFromCache = (cache: any) => {
    const { attribute: dataAttribute } = cache.readQuery({
      query: qInputsForAttribute,
      variables: {
        attributeId: selectedNode.attribute.id
      }
    });
    const newDataAttribute = {
      ...dataAttribute,
      inputs: dataAttribute.inputs.map(removeJoin)
    };
    cache.writeQuery({
      query: qInputsForAttribute,
      variables: {
        attributeId: selectedNode.attribute.id
      },
      data: { attribute: newDataAttribute }
    });
  };

  return (
    <div className={'join'}>
      <Button
        icon={'trash'}
        minimal={true}
        loading={updatingJoin || deletingJoin}
        onClick={() => {
          deleteJoin({
            variables: {
              id: joinData.id
            },
            update: removeJoinFromCache
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
  );
};

export default Join;

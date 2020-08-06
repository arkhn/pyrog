import { Button } from '@blueprintjs/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { IReduxStore } from 'types';
import { useMutation } from '@apollo/react-hooks';

import { onError } from 'services/apollo';

// COMPONENTS
import JoinColumns from '../JoinColumns';
import { loader } from 'graphql.macro';

// GRAPHQL
const qInputsForAttribute = loader(
  'src/graphql/queries/inputsForAttribute.graphql'
);
const mUpdateJoin = loader('src/graphql/mutations/updateJoin.graphql');
const mDeleteJoin = loader('src/graphql/mutations/deleteJoin.graphql');

interface Props {
  joinData: any;
}

const Join = ({ joinData }: Props) => {
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const {
    attribute: { path }
  } = useSelector((state: IReduxStore) => state.selectedNode);

  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );
  const attributeId = attributesForResource[path]
    ? attributesForResource[path].id
    : null;

  const [updateJoin, { loading: updatingJoin }] = useMutation(mUpdateJoin, {
    onError: onError(toaster)
  });
  const [deleteJoin, { loading: deletingJoin }] = useMutation(mDeleteJoin, {
    onError: onError(toaster)
  });

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
        attributeId
      }
    });
    const newDataAttribute = {
      ...dataAttribute,
      inputGroups: dataAttribute.inputGroups.map((group: any) => ({
        ...group,
        inputs: group.inputs.map(removeJoin)
      }))
    };
    cache.writeQuery({
      query: qInputsForAttribute,
      variables: {
        attributeId
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
              joinId: joinData.id
            },
            update: removeJoinFromCache
          });
        }}
      />

      <JoinColumns join={joinData} updateJoin={updateJoin} />
    </div>
  );
};

export default Join;

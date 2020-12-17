import React from 'react';
import { Button, Card, Elevation, Spinner } from '@blueprintjs/core';
import { useMutation } from '@apollo/react-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { loader } from 'graphql.macro';

import { selectInputGroup } from 'services/selectedNode/actions';
import { onError as onApolloError } from 'services/apollo';
import InputGroup from '../InputGroup';
import { IAttribute, IReduxStore } from 'types';

const mCreateInputGroup = loader(
  'src/graphql/mutations/createInputGroup.graphql'
);

interface Props {
  attribute: IAttribute;
}

const InputGroups = ({ attribute }: Props) => {
  const dispatch = useDispatch();
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const onError = onApolloError(toaster);

  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const path = selectedNode.attribute.path;

  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );
  const attributeId = attributesForResource[path]
    ? attributesForResource[path].id
    : null;

  const [createInputGroup] = useMutation(mCreateInputGroup, {
    onError
  });

  if (!attribute) {
    return <Spinner />;
  }

  const inputGroups =
    attribute && attribute.inputGroups ? attribute.inputGroups : [];

  return (
    <div id="input-groups">
      {inputGroups.map((inputGroup: any, index: number) =>
        inputGroup ? (
          <Card
            key={index}
            style={{
              background:
                index === selectedNode.selectedInputGroup ? '#ced9e0' : ''
            }}
            elevation={Elevation.ONE}
            onClick={() => {
              index === selectedNode.selectedInputGroup
                ? dispatch(selectInputGroup(null))
                : dispatch(selectInputGroup(index));
            }}
          >
            <InputGroup key={index} inputGroup={inputGroup} />
          </Card>
        ) : null
      )}
      <div>
        <Button
          icon={'add'}
          text={'Add input group'}
          onClick={() => {
            createInputGroup({
              variables: {
                attributeId
              }
            });
          }}
        />
      </div>
    </div>
  );
};

export default InputGroups;

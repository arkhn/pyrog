import React from 'react';
import { Card, Elevation, Spinner } from '@blueprintjs/core';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch, useSelector } from 'react-redux';

import { selectInputGroup } from 'services/selectedNode/actions';

import { IReduxStore } from 'types';

// COMPONENTS
import InputGroup from '../InputGroup';
import { loader } from 'graphql.macro';

// GRAPHQL
const qInputsForAttribute = loader(
  'src/graphql/queries/inputsForAttribute.graphql'
);

const InputGroups = () => {
  const dispatch = useDispatch();

  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const path = selectedNode.attribute.path;

  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );
  const attributeId = attributesForResource[path]
    ? attributesForResource[path].id
    : null;

  const { data, loading: loadingData } = useQuery(qInputsForAttribute, {
    variables: {
      attributeId: attributeId
    },
    skip: !attributeId
  });

  if (loadingData) {
    return <Spinner />;
  }

  const attribute = data && data.attribute ? data.attribute : null;
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
    </div>
  );
};

export default InputGroups;

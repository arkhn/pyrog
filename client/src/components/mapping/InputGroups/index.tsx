import React from 'react';
import { Button, Spinner } from '@blueprintjs/core';
import { useMutation } from '@apollo/react-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { loader } from 'graphql.macro';

import { setAttributeInMap } from 'services/resourceAttributes/actions';
import { onError as onApolloError } from 'services/apollo';
import InputGroup from '../InputGroup';
import { IAttribute, IInputGroup, IReduxStore } from 'types';

const mCreateAttribute = loader(
  'src/graphql/mutations/createAttribute.graphql'
);
const mCreateInputGroup = loader(
  'src/graphql/mutations/createInputGroup.graphql'
);

interface Props {
  attribute: IAttribute;
  isEmpty: boolean;
}

const InputGroups = ({ attribute, isEmpty }: Props) => {
  const dispatch = useDispatch();
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const onError = onApolloError(toaster);

  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const path = selectedNode.attribute.path;

  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceAttributes
  );
  let attributeId = attribute?.id;

  const [createAttribute] = useMutation(mCreateAttribute, {
    onError
  });
  const [createInputGroup] = useMutation(mCreateInputGroup, {
    onError
  });

  if (!attribute && !isEmpty) {
    return <Spinner />;
  }

  const inputGroups = attribute?.inputGroups || [];

  const onAddInputGroup = async () => {
    if (isEmpty) {
      // First, we create the attribute if it doesn't exist
      const { data: attr } = await createAttribute({
        variables: {
          resourceId: selectedNode.resource.id,
          definitionId: selectedNode.attribute.types[0],
          path,
          sliceName: selectedNode.attribute.definition.sliceName
        }
      });
      attributeId = attr.createAttribute.id;
      // Then, we create the inputGroup if needed
      const { data: dataAttribute } = await createInputGroup({
        variables: {
          attributeId: attr.createAttribute.id
        }
      });
      // Also, we create the parent attributes if they don't exist
      let currentAttribute = selectedNode.attribute;
      while (currentAttribute.parent) {
        currentAttribute = currentAttribute.parent;
        const parentPath = currentAttribute.path;
        if (
          !attributesForResource[parentPath] &&
          !currentAttribute.isArray &&
          currentAttribute.types.length <= 1
        ) {
          createAttribute({
            variables: {
              resourceId: selectedNode.resource.id,
              definitionId: currentAttribute.types[0],
              path: parentPath,
              sliceName: currentAttribute.definition.sliceName
            }
          });
        }
      }
      dispatch(setAttributeInMap(path, dataAttribute.createInputGroup));
    } else {
      createInputGroup({
        variables: {
          attributeId
        }
      });
    }
  };

  return (
    <div id="input-groups">
      {inputGroups.map((inputGroup: IInputGroup, index: number) =>
        inputGroup ? <InputGroup key={index} inputGroup={inputGroup} attribute={attribute} /> : null
      )}
      <div>
        <Button icon={'add'} text={'Input group'} onClick={onAddInputGroup} />
      </div>
    </div>
  );
};

export default InputGroups;

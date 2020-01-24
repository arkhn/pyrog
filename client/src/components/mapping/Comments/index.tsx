import * as React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import { FormGroup, TextArea, Button } from '@blueprintjs/core';

import { IReduxStore } from 'types';
import { loader } from 'graphql.macro';

import { setAttributeInMap } from 'services/resourceInputs/actions';

// GRAPHQL
const mUpdateAttribute = loader(
  'src/graphql/mutations/updateAttribute.graphql'
);
const mCreateAttribute = loader(
  'src/graphql/mutations/createAttribute.graphql'
);

const Comments = () => {
  const dispatch = useDispatch();
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const path = selectedNode.attribute.path.join('.');

  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );
  const attributeForNode = attributesForResource[path];

  const [createAttribute] = useMutation(mCreateAttribute);
  const [updateAttribute] = useMutation(mUpdateAttribute);

  const [comments, setComments] = React.useState(
    attributeForNode ? attributeForNode.comments : ''
  );

  React.useEffect(() => {
    setComments(attributeForNode ? attributeForNode.comments : '');
  }, [attributeForNode]);

  const onSaveComment = async (): Promise<void> => {
    // TODO factorize these functions
    if (attributeForNode) {
      const { data } = await updateAttribute({
        variables: {
          attributeId: attributeForNode.id,
          data: {
            comments
          }
        }
      });
      const newAttr = data.createAttribute;
      dispatch(setAttributeInMap(path, newAttr));
    } else {
      const { data } = await createAttribute({
        variables: {
          resourceId: selectedNode.resource.id,
          path,
          data: {
            comments
          }
        }
      });
      const newAttr = data.createAttribute;
      dispatch(setAttributeInMap(path, newAttr));
    }
  };

  return (
    <div id="comment">
      <FormGroup label={<h3>Comments</h3>}>
        <div id="comment-input">
          <TextArea
            className={'bp3-fill'}
            value={comments}
            disabled={!selectedNode.attribute}
            onChange={e => {
              setComments(e.target.value);
            }}
          />
          <Button
            id="save-comment-button"
            disabled={!selectedNode.attribute}
            onClick={onSaveComment}
          >
            Save
          </Button>
        </div>
      </FormGroup>
    </div>
  );
};

export default Comments;

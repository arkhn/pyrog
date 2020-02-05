import * as React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import { FormGroup, TextArea, Button } from '@blueprintjs/core';

import { IReduxStore } from 'types';
import { loader } from 'graphql.macro';

import { setAttributeInMap } from 'services/resourceInputs/actions';

// GRAPHQL
const qCommentsForAttribute = loader(
  'src/graphql/queries/commentsForAttribute.graphql'
);
const mUpdateAttribute = loader(
  'src/graphql/mutations/updateAttribute.graphql'
);
const mCreateAttribute = loader(
  'src/graphql/mutations/createAttribute.graphql'
);

const Comments = () => {
  const dispatch = useDispatch();
  const { attribute, resource } = useSelector(
    (state: IReduxStore) => state.selectedNode
  );

  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );
  const attributeForNode = attributesForResource[attribute.path];

  const [createAttribute] = useMutation(mCreateAttribute);
  const [updateAttribute] = useMutation(mUpdateAttribute);

  const [comments, setComments] = React.useState(
    attributeForNode ? attributeForNode.comments : ''
  );

  const { data, loading } = useQuery(qCommentsForAttribute, {
    variables: {
      attributeId: attributeForNode ? attributeForNode.id : null
    },
    skip: !attributeForNode
  });

  React.useEffect(() => {
    setComments(data && data.attribute.comments ? data.attribute.comments : '');
  }, [data]);

  const onSaveComment = async (): Promise<void> => {
    if (attributeForNode) {
      updateAttribute({
        variables: {
          attributeId: attributeForNode.id,
          data: {
            comments
          }
        }
      });
    } else {
      const { data } = await createAttribute({
        variables: {
          resourceId: resource.id,
          path: attribute.path,
          data: {
            comments
          }
        }
      });
      const newAttr = data.createAttribute;
      dispatch(setAttributeInMap(attribute.path, newAttr));
    }
  };

  return (
    <div id="comment">
      <FormGroup label={<h3>Comments</h3>}>
        <div id="comment-input">
          <TextArea
            className={'bp3-fill'}
            value={comments}
            disabled={loading || !attribute}
            onChange={e => {
              setComments(e.target.value);
            }}
          />
          <Button
            id="save-comment-button"
            disabled={!attribute}
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

import * as React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import { FormGroup, TextArea, Button, Card } from '@blueprintjs/core';

import { IReduxStore, IComment } from 'types';
import { loader } from 'graphql.macro';

import { setAttributeInMap } from 'services/resourceInputs/actions';

import './style.scss';

// GRAPHQL
const qCommentsForAttribute = loader(
  'src/graphql/queries/commentsForAttribute.graphql'
);
const mCreateComment = loader('src/graphql/mutations/createComment.graphql');
const mCreateAttribute = loader(
  'src/graphql/mutations/createAttribute.graphql'
);

const Comments = () => {
  const dispatch = useDispatch();
  const { attribute, resource } = useSelector(
    (state: IReduxStore) => state.selectedNode
  );
  const me = useSelector((state: IReduxStore) => state.user);

  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );
  const attributeForNode = attributesForResource[attribute.path];

  const [createAttribute] = useMutation(mCreateAttribute);
  const [createComment] = useMutation(mCreateComment);

  const [newComment, setNewComment] = React.useState('');
  const [comments, setComments] = React.useState([] as IComment[]);

  const { data: attrWithComments, loading } = useQuery(qCommentsForAttribute, {
    variables: {
      attributeId: attributeForNode ? attributeForNode.id : null
    },
    skip: !attributeForNode
  });

  React.useEffect(() => {
    if (attrWithComments)
      setComments(
        attrWithComments.attribute.comments.sort(
          (c1: IComment, c2: IComment) =>
            new Date(c2.createdAt).getTime() - new Date(c1.createdAt).getTime()
        )
      );
  }, [attrWithComments]);

  React.useEffect(() => {
    if (!attributeForNode) setComments([]);
  }, [attributeForNode]);

  const onCreateComment = (
    cache: any,
    { data: { createComment: newComment } }: any
  ) => {
    const { attribute } = cache.readQuery({
      query: qCommentsForAttribute,
      variables: {
        attributeId: attributeForNode.id
      }
    });
    cache.writeQuery({
      query: qCommentsForAttribute,
      variables: {
        attributeId: attributeForNode.id
      },
      data: {
        attribute: {
          ...attribute,
          comments: [...attribute.comments, newComment]
        }
      }
    });
  };

  const actionCreateComment = async (): Promise<void> => {
    let attributeId = attributeForNode?.id;
    try {
      if (!attributeForNode) {
        const { data } = await createAttribute({
          variables: {
            resourceId: resource.id,
            definitionId: attribute.types[0],
            path: attribute.path
          }
        });
        const newAttr = data.createAttribute;
        attributeId = newAttr.id;
        dispatch(setAttributeInMap(attribute.path, newAttr));
      }
      const { data } = await createComment({
        variables: {
          attributeId: attributeId,
          content: newComment
        },
        update: onCreateComment
      });
      setComments([data.createComment, ...comments]);
      setNewComment('');
    } catch (e) {
      console.log(e);
    }
  };

  const renderComment = (c: IComment) => {
    const isMyComment = c.author.id === me.id;
    const formattedDate = new Date(c.createdAt).toLocaleString('fr-FR');

    return (
      <Card key={c.id} className={isMyComment ? 'my-comment' : 'other-comment'}>
        <span>{c.content}</span>
        <br />
        <span>
          Sent by <b>{c.author.name}</b> on {formattedDate}
        </span>
      </Card>
    );
  };

  return (
    <div id="comment-block">
      <FormGroup label={<h3>Comments</h3>}>
        <div id="comment-input">
          <TextArea
            className="text-input"
            value={newComment}
            disabled={loading || !attribute}
            onChange={e => {
              setNewComment(e.target.value);
            }}
          />
          <Button
            id="send-comment-button"
            disabled={!attribute}
            onClick={actionCreateComment}
          >
            Send
          </Button>
        </div>
      </FormGroup>
      <div className="comment-history">{comments.map(renderComment)}</div>
    </div>
  );
};

export default Comments;

import * as React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import { FormGroup, TextArea, Button, Card, Icon } from '@blueprintjs/core';

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
  const alreadyValidatedByMe = comments.some(
    c => c.author.id === me.id && c.validation
  );

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

  const addValidation = () => actionCreateComment('', true);
  const addComment = () => actionCreateComment(newComment, false);

  const actionCreateComment = async (
    content: string,
    validation: boolean
  ): Promise<void> => {
    let attributeId = attributeForNode?.id;
    try {
      if (!attributeForNode) {
        const { data } = await createAttribute({
          variables: {
            resourceId: resource.id,
            definitionId: attribute.types[0],
            path: attribute.path,
            sliceName: attribute.definition.sliceName
          }
        });
        attributeId = data.createAttribute.id;
      }
      const { data } = await createComment({
        variables: {
          content,
          validation,
          attributeId: attributeId
        }
      });
      dispatch(setAttributeInMap(attribute.path, data.createComment.attribute));

      setComments([data.createComment, ...comments]);
      setNewComment('');
    } catch (e) {
      console.log(e);
    }
  };

  const validationIcon = () => {
    return (
      <div className="validation-icon">
        <Icon icon="tick-circle" iconSize={35} intent="success" />
      </div>
    );
  };

  const renderComment = (c: IComment) => {
    const isMyComment = c.author.id === me.id;
    const formattedDate = new Date(c.createdAt).toLocaleString('fr-FR');

    return (
      <Card
        key={c.id}
        className={`
        ${isMyComment ? 'my-comment' : 'other-comment'}
        ${c.validation && 'validation-comment'}
        `}
      >
        {c.validation && validationIcon()}
        <div>
          <b>
            {c.author.name}
            {c.validation && ' a validé cet attribut'}
          </b>
          <br />
          <span className="bp3-text-muted bp3-text-small bp3-running-text">
            {formattedDate}
          </span>
          <br />
          {c.content}
        </div>
      </Card>
    );
  };

  return (
    <div id="comment-block">
      <h3>Comments</h3>
      <div className="user-buttons">
        <div>
          <Button
            icon="tick"
            intent="success"
            text="Validate"
            disabled={!attribute || alreadyValidatedByMe}
          />
          {/*
          <Button
            icon="reset"
            intent="danger"
            text="Undo validation"
            disabled={attribute && !alreadyValidatedByMe}
          />
          */}
        </div>
      </div>
      <div className="user-input">
        <Card className="card-input">
          <FormGroup>
            <h4>Write a comment</h4>
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
                onClick={addComment}
              >
                Send
              </Button>
            </div>
          </FormGroup>
        </Card>
      </div>
      {comments.map(renderComment)}
    </div>
  );
};

export default Comments;

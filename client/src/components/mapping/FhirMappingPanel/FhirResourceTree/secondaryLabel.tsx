import React from 'react';
import { Attribute } from '@arkhn/fhir.ts';
import { useSelector } from 'react-redux';
import { Icon } from '@blueprintjs/core';

import { IAttribute, IReduxStore } from 'types';

interface SecondaryLabelProps {
  attribute: Attribute;
}

export const SecondaryLabel = ({
  attribute
}: SecondaryLabelProps): React.ReactElement => {
  const attributesForResource: { [k: string]: IAttribute } = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );
  const attributesWithInputs = Object.keys(attributesForResource).filter(
    path => attributesForResource[path].inputs.length > 0
  );

  const checkHasChildInputs = (pathString: string) =>
    attributesWithInputs.some(
      el => el !== pathString && el.startsWith(pathString)
    );

  const checkHasInputs = (pathString: string) =>
    attributesWithInputs.includes(pathString);

  const isValidated = attributesForResource[attribute.path]?.comments.some(
    c => c.validation
  );
  const comments = attributesForResource[attribute.path]?.comments.filter(
    c => !c.validation
  );

  const hasInputs = checkHasInputs(attribute.path);

  let hasChildInputs: boolean;
  if (attribute.choices.length > 0) {
    // Check if any of the children have child attributes
    hasChildInputs = attribute.choices.some(
      a => checkHasChildInputs(a.path) || checkHasInputs(a.path)
    );
  } else {
    hasChildInputs = checkHasChildInputs(attribute.path);
  }

  const renderCommentCount = () => (
    <React.Fragment>
      <Icon icon="chat" />
      <span style={{ padding: '2px' }}>{comments.length}</span>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {isValidated && <Icon icon="small-tick" intent="success" />}
      {hasChildInputs && <Icon icon="dot" />}
      {!isValidated && hasInputs && <Icon icon="dot" intent="warning" />}
      {!hasInputs && attribute.isRequired && (
        <Icon icon="dot" intent="danger" />
      )}
      {comments && comments.length > 0 && renderCommentCount()}
    </React.Fragment>
  );
};

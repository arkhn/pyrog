import React from 'react';
import { Attribute } from '@arkhn/fhir.ts';
import { useSelector } from 'react-redux';
import { Icon, Tooltip } from '@blueprintjs/core';

import { IAttribute, IReduxStore } from 'types';

import './style.scss';

interface SecondaryLabelProps {
  attribute: Attribute;
}

export const SecondaryLabel = ({
  attribute
}: SecondaryLabelProps): React.ReactElement => {
  const attributesForResource: { [k: string]: IAttribute } = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );
  const attributesWithInputs = Object.keys(attributesForResource).filter(path =>
    attributesForResource[path].inputGroups.some(
      group => group.inputs.length > 0
    )
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

  const labels = [];
  if (hasChildInputs) {
    labels.push({
      component: <Icon icon="dot" />,
      text: 'This attribute has children'
    });
  }
  if (isValidated) {
    labels.push({
      component: <Icon icon="small-tick" intent="success" />,
      text: 'This attribute has been validated'
    });
  } else if (hasInputs) {
    labels.push({
      component: <Icon icon="dot" intent="warning" />,
      text: 'This attribute has inputs but is not yet validated'
    });
  }
  if (!hasInputs && attribute.isRequired) {
    labels.push({
      component: <Icon icon="dot" intent="danger" />,
      text: 'This attribute is required'
    });
  }
  if (comments && comments.length > 0)
    labels.push({
      component: renderCommentCount(),
      text: `This attribute has ${comments.length} comments`
    });

  return (
    <span className="secondary-label">
      {labels.map((l, i) => (
        <Tooltip key={i} boundary={'viewport'} content={l.text}>
          {l.component}
        </Tooltip>
      ))}
    </span>
  );
};

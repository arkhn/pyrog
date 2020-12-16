import * as React from 'react';

import { Attribute } from '@arkhn/fhir.ts';

import StaticValueForm from './StaticValueForm';
import './style.scss';

interface Props {
  attribute: Attribute;
}

const TabColumnPicking = ({ attribute }: Props) => {
  return (
    <div id={'column-picker'}>
      <StaticValueForm attribute={attribute} />
    </div>
  );
};

export default TabColumnPicking;

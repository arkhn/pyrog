import * as React from 'react';

import { Attribute } from '@arkhn/fhir.ts';

import { ISelectedSource } from 'types';

import StaticValueForm from './StaticValueForm';
import ConditionForm from './ConditionForm';
import './style.scss';

interface Props {
  attribute: Attribute;
  schema: any;
  source: ISelectedSource;
}

const TabColumnPicking = ({ attribute, schema, source }: Props) => {
  return (
    <div id={'column-picker'}>
      <StaticValueForm attribute={attribute} />
      <ConditionForm />
    </div>
  );
};

export default TabColumnPicking;

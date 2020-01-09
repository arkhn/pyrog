import * as React from 'react';
import { shallow } from 'enzyme';
import SQLRequestParserTab from './index';

describe('SQLRequestParserTab component', () => {
  it('Renders without crashing', () => {
    shallow(<SQLRequestParserTab />);
  });
});

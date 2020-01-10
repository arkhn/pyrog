import * as React from 'react';
import { TextArea } from '@blueprintjs/core';

export interface IProps {
  onChangeCallback?: any;
}

const SQLRequestParser = ({ onChangeCallback }: IProps) => {
  return (
    <div>
      <TextArea
        className={'bp3-fill'}
        onChange={event => {
          onChangeCallback(event.target.value);
        }}
      />
    </div>
  );
};

export default SQLRequestParser;

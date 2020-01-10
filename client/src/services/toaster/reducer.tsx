import { Position, Toaster } from '@blueprintjs/core';
import { ISimpleAction } from '../../types';

const initialState: any = Toaster.create({
  className: 'recipe-toaster',
  position: Position.TOP
});

export const toaster = (state = initialState, action: ISimpleAction): any => {
  switch (action.type) {
    default:
      return state;
  }
};

export default toaster;

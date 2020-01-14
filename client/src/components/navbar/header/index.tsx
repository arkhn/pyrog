import { Button } from '@blueprintjs/core';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import useReactRouter from 'use-react-router';

import { deselectSource } from 'services/selectedNode/actions';

const Header = () => {
  const dispatch = useDispatch();
  const { history, location } = useReactRouter();
  console.log(location);
  switch (location.pathname) {
    case '/':
    case '/login':
      return null;
    default:
      return (
        <>
          <Button
            icon={'chevron-left'}
            intent={'primary'}
            minimal={true}
            onClick={() => {
              dispatch(deselectSource());
              history.push('/');
            }}
          >
            Sources
          </Button>
        </>
      );
  }
};

export default Header;

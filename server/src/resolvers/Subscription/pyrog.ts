import { forwardTo } from 'prisma-binding';

import { checkAuth } from '../../utils';

export const pyrogSubscription = {
  attribute: {
    subscribe: checkAuth(forwardTo('binding'))
  },
  inputColumn: {
    subscribe: checkAuth(forwardTo('binding'))
  },
  join: {
    subscribe: checkAuth(forwardTo('binding'))
  }
};

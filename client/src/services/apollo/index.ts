import { ApolloError } from 'apollo-client/errors/ApolloError';
import { IToaster } from '@blueprintjs/core';

export const onError = (toaster: IToaster) => (error: ApolloError): void => {
  const msg =
    error.message === 'GraphQL error: Not Authorised!'
      ? 'You only have read access on this source.'
      : error.message;
  toaster.show({
    icon: 'error',
    intent: 'danger',
    message: msg,
    timeout: 4000
  });
};

import { ApolloError } from 'apollo-client/errors/ApolloError';
import { ProviderContext } from 'notistack';

export const onError = (
  enqueueSnackbar: ProviderContext['enqueueSnackbar']
) => (error: ApolloError): void => {
  const msg =
    error.message === 'GraphQL error: Not Authorised!'
      ? 'You only have read access on this source.'
      : error.message;
  enqueueSnackbar(msg, { variant: 'error', autoHideDuration: 5000 });
};

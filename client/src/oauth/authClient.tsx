import ClientOAuth2 from 'client-oauth2';
import {
  CLIENT_ID,
  AUTH_URL,
  TOKEN_URL,
  LOGIN_REDIRECT_URL
} from '../constants';

export const authClient = new ClientOAuth2({
  clientId: CLIENT_ID,
  // TODO here refresh doesn't work if no secrets are provided.
  // Is it unsafe to put a dummy secret in a public app (vs no secret at all)?
  // clientSecret: 'azertyuiop',
  authorizationUri: AUTH_URL,
  accessTokenUri: TOKEN_URL,
  redirectUri: LOGIN_REDIRECT_URL,
  scopes: ['openid', 'offline_access'] // TODO scopes
});

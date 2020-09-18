import ClientOAuth2 from 'client-oauth2';
import {
  CLIENT_ID,
  CLIENT_SECRET,
  AUTH_URL,
  TOKEN_URL,
  LOGIN_REDIRECT_URL
} from '../constants';

export const authClient = new ClientOAuth2({
  clientId: CLIENT_ID,
  // TODO here refresh doesn't work if no secrets are provided.
  // Choose the right authentication method
  clientSecret: CLIENT_SECRET,
  authorizationUri: AUTH_URL,
  accessTokenUri: TOKEN_URL,
  redirectUri: LOGIN_REDIRECT_URL,
  scopes: ['openid', 'offline_access'] // TODO scopes
});

import ClientOAuth2 from 'client-oauth2'
import { APP_SECRET, OAUTH2_CLIENT_ID, OAUTH2_TOKEN_URL } from './constants'

export const authClient = new ClientOAuth2({
  clientId: OAUTH2_CLIENT_ID,
  clientSecret: APP_SECRET,
  accessTokenUri: OAUTH2_TOKEN_URL,
})

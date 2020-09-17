import axios from 'axios';

import { authClient } from './authClient';

import {
  TOKEN_STORAGE_KEY,
  TOKEN_DATA_STORAGE_KEY,
  CLIENT_ID,
  CLIENT_SECRET,
  REVOKE_URL
} from '../constants';

export const getAccessToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);

export const getIdToken = () => {
  const tokenData = localStorage.getItem(TOKEN_DATA_STORAGE_KEY);
  if (!tokenData) return null;
  return JSON.parse(tokenData).id_token;
};

export const removeToken = async () => {
  await revokeToken();
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(TOKEN_DATA_STORAGE_KEY);
};

export const fetchToken = async () => {
  const oauthToken = await authClient.code.getToken(window.location.href);
  localStorage.setItem(TOKEN_STORAGE_KEY, oauthToken.accessToken);
  localStorage.setItem(TOKEN_DATA_STORAGE_KEY, JSON.stringify(oauthToken.data));

  return oauthToken.accessToken;
};

export const refreshToken = async () => {
  const tokenData = localStorage.getItem(TOKEN_DATA_STORAGE_KEY);

  if (!tokenData) return false;
  const oauthToken = authClient.createToken(JSON.parse(tokenData));

  // TODO here refresh doesn't work if no secrets are provided.
  // Is it unsafe to put a dummy secret in a public app (vs no secret at all)?
  const updatedToken = await oauthToken.refresh();

  localStorage.setItem(TOKEN_STORAGE_KEY, updatedToken.accessToken);
  localStorage.setItem(
    TOKEN_DATA_STORAGE_KEY,
    JSON.stringify(updatedToken.data)
  );
  return true;
};

const revokeToken = async () => {
  // NOTE It looks like the refresh token doesn't work after the access token has been revoked.
  const accessToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!accessToken)
    throw new Error(
      'Access token not present in local storage, cannot revoke it.'
    );

  const bodyFormData = new FormData();
  bodyFormData.set('token', accessToken);
  const conf = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json, application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
    }
  };
  try {
    const revokeResponse = await axios.post(REVOKE_URL!, bodyFormData, conf);
    if (revokeResponse.status !== 200) console.error(revokeResponse.data);
  } catch (err) {
    console.error(err.response);
  }
};

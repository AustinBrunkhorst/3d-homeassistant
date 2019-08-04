import { Auth } from 'home-assistant-js-websocket';
import { createAsyncAction } from 'typesafe-actions';

export const loginAsync = createAsyncAction(
  'HASS_LOGIN',
  'HASS_LOGIN_SUCCESS',
  'HAAS_LOGIN_FAILURE'
)<void, Auth, Error>();
import { Auth, HassEntity } from "home-assistant-js-websocket";
import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { AreaConfiguration } from "./hass.model";

export const loginAsync = createAsyncAction(
  'HASS_LOGIN',
  'HASS_LOGIN_SUCCESS',
  'HAAS_LOGIN_FAILURE'
)<void, Auth, Error>();

export const loadAreas = createStandardAction('HASS_LOAD_AREAS')<AreaConfiguration[]>(); 

export const loadEntities = createStandardAction('HASS_LOAD_ENTITIES')<HassEntity[]>();
export const updateEntity = createStandardAction('HASS_UPDATE_ENTITY')<{ entity_id: string, state: HassEntity }>();
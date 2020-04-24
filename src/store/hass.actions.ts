import { Auth, HassEntity } from "home-assistant-js-websocket";
import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { AreaConfiguration } from "./hass.model";

export const loginAsync = createAsyncAction(
  'HASS_LOGIN',
  'HASS_LOGIN_SUCCESS',
  'HAAS_LOGIN_FAILURE'
)<void, Auth, Error>();

export const loadAreasAsync = createAsyncAction(
  'HASS_LOAD_AREAS',
  'HASS_LOAD_AREAS_SUCCESS',
  'HAAS_LOAD_AREAS_FAILURE'
)<void, AreaConfiguration[], Error>(); 

export const loadEntitiesAsync = createAsyncAction(
  'HASS_LOAD_ENTITIES',
  'HASS_LOAD_ENTITIES_SUCCESS',
  'HASS_LOAD_ENTITIES_FAILURE'
)<void, HassEntity[], Error>(); 

export const updateEntity = createStandardAction('HASS_UPDATE_ENTITY')<{ entity_id: string, state: HassEntity }>();
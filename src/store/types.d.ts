import { ActionType, StateType } from 'typesafe-actions';

export type RootAction = ActionType<typeof import("./actions").default>;

declare module "typesafe-actions" {
  interface Types {
    RootAction: RootAction;
  }
}

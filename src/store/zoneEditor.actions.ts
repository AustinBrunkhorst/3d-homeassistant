import { createStandardAction } from 'typesafe-actions';

export const add = createStandardAction("ADD")<number>();

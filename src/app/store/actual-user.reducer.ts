import { createReducer } from '@ngrx/store';
import { Individual } from '../main/personal/individual.model';

const initialState = new Individual();
export const actualUserReducer = createReducer(initialState);

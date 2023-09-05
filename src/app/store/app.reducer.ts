import { ActionReducerMap } from '@ngrx/store'
import * as fromAuth from '../auth/store/auth.reducer'

export interface AppState{
    auth: fromAuth.state
}

export const AppReducer: ActionReducerMap<AppState> = {
    auth: fromAuth.authReducer
}
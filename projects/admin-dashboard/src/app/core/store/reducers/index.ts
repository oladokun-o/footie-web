import { ActionReducerMap } from '@ngrx/store';
import { kycReducer, KycState } from './kyc.reducer';

// Define the app's state as a combination of individual feature states
export interface AppState {
  kyc: KycState;
  // Add other states here
}

// Combine all reducers into a single root reducer
export const appReducers: ActionReducerMap<AppState> = {
  kyc: kycReducer,
  // Add other reducers here
};

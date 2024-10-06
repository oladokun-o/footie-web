import { createSelector, createFeatureSelector } from '@ngrx/store';
import { KycState } from '../reducers/kyc.reducer';

export const selectKycState = createFeatureSelector<KycState>('kyc');

export const selectAllKycRecords = createSelector(
  selectKycState,
  (state: KycState) => state.kycRecords
);

export const selectKycRecord = createSelector(
  selectKycState,
  (state: KycState) => state.selectedRecord
);

export const selectKycLoading = createSelector(
  selectKycState,
  (state: KycState) => state.loading
);

export const selectKycError = createSelector(
  selectKycState,
  (state: KycState) => state.error
);

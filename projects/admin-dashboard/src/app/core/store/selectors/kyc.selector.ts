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

// Selector for getting current filters
export const selectKycFilters = createSelector(
  selectKycState,
  (state: KycState) => state.filters
);

// Selector to filter KYC records based on the filters
export const selectFilteredKycRecords = createSelector(
  selectAllKycRecords,
  selectKycFilters,
  (records, filters) => {
    return records.filter(record => {
      const matchesQuery = filters?.query
        ? [record.id, record.user.id, record.user.firstName, record.user.lastName, record.user.email]
          .some(value => value?.toString().toLowerCase().includes(filters.query!.toLowerCase()))
        : true;

      const matchesStatus = filters?.status ? record.status === filters.status : true;

      const matchesDateRange = filters?.dateRange && filters.dateRange.startDate && filters.dateRange.endDate
        ? new Date(record.createdAt) >= new Date(filters.dateRange.startDate) &&
        new Date(record.createdAt) <= new Date(filters.dateRange.endDate)
        : true;

      const matchesId = filters?.id ? record.id === filters.id : true;
      const matchesUserId = filters?.userId ? record.userId === filters.userId : true;

      return matchesQuery && matchesStatus && matchesDateRange && matchesId && matchesUserId;
    });
  }
);

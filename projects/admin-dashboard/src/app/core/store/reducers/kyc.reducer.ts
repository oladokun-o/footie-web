import { createReducer, on } from '@ngrx/store';
import { kycActions } from '../actions/kyc.action';
import { UserKYC } from '../../interfaces/user.interface';

export interface KycState {
  kycRecords: UserKYC[];
  selectedRecord?: UserKYC;
  loading: boolean;
  error: any;
  filters: {
    query: string | null;
    email: string | null;
    status: 'pending' | 'approved' | 'rejected' | null;
    id: string | null;
    userId: string | null;
    dateRange: {
      startDate: Date | null;
      endDate: Date | null;
    }
  }
}

const initialState: KycState = {
  kycRecords: [],
  selectedRecord: undefined,
  loading: false,
  error: null,
  filters: {
    query: null,
    email: null,
    status: null,
    id: null,
    userId: null,
    dateRange: {
      startDate: null,
      endDate: null
    }
  }
};

export const kycReducer = createReducer(
  initialState,
  on(kycActions.loadKycRecords, (state) => ({ ...state, loading: true })),
  on(kycActions.loadKycRecordsSuccess, (state, { kycRecords }) => ({ ...state, loading: false, kycRecords })),
  on(kycActions.loadKycRecordsFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(kycActions.updateKycRecord, (state) => ({ ...state, loading: true })),
  on(kycActions.updateUserKYCSuccess, (state, { kycRecord }) => {
    const kycRecords = state.kycRecords.map((record) => record.userId === kycRecord.userId ? kycRecord : record);
    return { ...state, loading: false, kycRecords };
  }),
  on(kycActions.updateKycRecordFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(kycActions.selectKycRecord, (state, { id }) => {
    const selectedRecord = state.kycRecords.find((record) => record.id === id);
    return { ...state, selectedRecord };
  }),
  on(kycActions.selectKycRecordSuccess, (state, { kycRecord }) => ({ ...state, selectedRecord: kycRecord })),
  on(kycActions.selectKycRecordFailure, (state, { error }) => ({ ...state, error })),
  on(kycActions.updateFilter, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters }
  }))
);

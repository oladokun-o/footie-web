import { createAction, props } from '@ngrx/store';
import { UserKYC } from '../../interfaces/user.interface';

// Load KYC records
const loadKycRecords = createAction('[KYC] Load KYC Records');
const loadKycRecordsSuccess = createAction('[KYC] Load KYC Records Success', props<{ kycRecords: UserKYC[] }>());
const loadKycRecordsFailure = createAction('[KYC] Load KYC Records Failure', props<{ error: string }>());

// Manage KYC Record
const selectKycRecord = createAction('[KYC] Select KYC Record By ID', props<{ id: string }>());
const selectKycRecordSuccess = createAction('[KYC] Select KYC Record By ID Success', props<{ kycRecord: UserKYC }>());
const selectKycRecordFailure = createAction('[KYC] Select KYC Record By ID Failure', props<{ error: string }>());
const updateKycRecord = createAction('[KYC] Update KYC Record', props<{ kycRecord: UserKYC }>());
const updateUserKYCSuccess = createAction('[KYC] Update KYC Record Success', props<{ kycRecord: UserKYC }>());
const updateKycRecordFailure = createAction('[KYC] Update KYC Record Failure', props<{ error: string }>());


export const kycActions = {
  loadKycRecords,
  loadKycRecordsSuccess,
  loadKycRecordsFailure,
  updateKycRecord,
  updateUserKYCSuccess,
  updateKycRecordFailure,
  selectKycRecord,
  selectKycRecordSuccess,
  selectKycRecordFailure
}

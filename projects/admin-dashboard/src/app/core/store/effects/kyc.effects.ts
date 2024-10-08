import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { kycActions } from '../actions/kyc.action'
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { KycService } from '../../services/kyc.service';
import { select, Store } from '@ngrx/store';
import { selectAllKycRecords, selectKycFilters } from '../selectors/kyc.selector';

@Injectable()
export class KycEffects {
  constructor(
    private actions$: Actions,
    private kycService: KycService,
    private store: Store
  ) { }

  /**
   * Load KYC records effect
   */
  loadKycRecords$ = createEffect(() =>
    this.actions$.pipe(
      ofType(kycActions.loadKycRecords),
      mergeMap(() =>
        this.kycService.listKYCRecords().pipe(
          map(kycRecords => kycActions.loadKycRecordsSuccess({ kycRecords })),
          catchError(error => of(kycActions.loadKycRecordsFailure({ error })))
        )
      )
    )
  );

  /**
   * Select KYC record effect by ID
   * The selected KYC record is gotten by finding the record within the existing list of KYC records
   */
  selectKycRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(kycActions.selectKycRecord),
      switchMap(({ id }) =>
        this.store.pipe(
          select(selectAllKycRecords), // Select all KYC records from the store
          map((kycRecords) => {
            // Find the record by ID
            const kycRecord = kycRecords.find(record => record.id === id);
            if (kycRecord) {
              return kycActions.selectKycRecordSuccess({ kycRecord });
            } else {
              // Return failure action if record not found
              return kycActions.selectKycRecordFailure({ error: 'KYC record not found' });
            }
          }),
          catchError((error) =>
            of(kycActions.selectKycRecordFailure({ error: error.message }))
          )
        )
      )
    )
  );

  /**
   * Update KYC record effect
   */
  updateKycRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(kycActions.updateKycRecord),
      mergeMap(({ kycRecord }) =>
        this.kycService.updateKYCRecord(kycRecord.userId, kycRecord.status).pipe(
          map((updatedRecord) => kycActions.updateUserKYCSuccess({ kycRecord: updatedRecord.data })),
          catchError((error) => of(kycActions.updateKycRecordFailure({ error })))
        )
      )
    )
  );
}

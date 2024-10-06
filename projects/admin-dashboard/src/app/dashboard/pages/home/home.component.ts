import { Component, OnInit } from '@angular/core';
import { KYCStep, User, UserKYC } from '../../../core/interfaces/user.interface';
import { KycService } from '../../../core/services/kyc.service';
import { map, Observable } from 'rxjs';
import { KycState } from '../../../core/store/reducers/kyc.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'admin-app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  user: User | null = JSON.parse(localStorage.getItem('user') as string);
  pageTitle: string = this.user ? `Welcome, ${this.user.firstName}` : 'Welcome';

  kycRecordsCount$: Observable<number>;
  kycLoading$: Observable<boolean>;

  constructor(
    private store : Store<{ kyc: KycState }>
  ) {
    this.kycLoading$ = this.store.select('kyc', 'loading');
    this.kycRecordsCount$ = this.store.select('kyc', 'kycRecords').pipe(
      map((records) => records.length)
    );
  }
}

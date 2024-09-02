import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KycComponent } from './kyc.component';
import { KYCUserResolver } from '../core/resolvers/user.resolver';
import { StartKycComponent } from './pages/start-kyc/start-kyc.component';
import { ContinueKycComponent } from './pages/continue-kyc/continue-kyc.component';

const routes: Routes = [
  {
    path: '',
    component: KycComponent,
    resolve: {
      user: KYCUserResolver
    },
    children: [
      {
        path: '',
        component: StartKycComponent,
      },
      {
        path: 'continue',
        component: ContinueKycComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KYCRoutingModule { }

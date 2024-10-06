import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { UserResolver } from '../core/resolvers/user.resolver';
import { AuthGuard } from '../core/guards/auth.guard';

// Import your dashboard component(s) here

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    resolve: [UserResolver],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'kyc-records',
        loadChildren: () => import('projects/admin-dashboard/src/app/dashboard/pages/kyc-records/kyc-records.module').then(m => m.KycRecordsModule),
        data: {
          breadcrumb: 'KYC Records'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule { }

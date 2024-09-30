import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { UserResolver } from '../core/resolvers/user.resolver';

// Import your dashboard component(s) here

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    resolve: [UserResolver],

    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'kyc-records',
        loadChildren: () => import('projects/admin-dashboard/src/app/dashboard/pages/kyc-records/kyc-records.module').then(m => m.KycRecordsModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { RecordComponent } from './pages/record/record.component';
import { KycRecordsComponent } from './kyc-records.component';

// Import your dashboard component(s) here

const routes: Routes = [
  {
    path: '',
    component: KycRecordsComponent,
    children: [
      {
        path: '',
        component: ListComponent,
      },
      {
        path: ':id',
        component: RecordComponent,
        data: {
          breadcrumb: 'Record'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KycRecordsRoutingModule { }

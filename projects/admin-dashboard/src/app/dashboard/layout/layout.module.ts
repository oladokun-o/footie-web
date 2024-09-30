import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSideNavComponent } from './admin-side-nav/admin-side-nav.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    AdminHeaderComponent,
    AdminSideNavComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbDropdownModule
  ],
  exports: [
    AdminHeaderComponent,
    AdminSideNavComponent
  ]
})
export class AdminDashboardLayoutModule { }

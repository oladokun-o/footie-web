import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { BottomNavigationComponent } from './bottom-navigation/bottom-navigation.component';

@NgModule({
  declarations: [
    HeaderComponent,
    BottomNavigationComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    BottomNavigationComponent
  ]
})
export class DashboardComponentsModule { }

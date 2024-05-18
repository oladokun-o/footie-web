import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { BottomNavigationComponent } from './bottom-navigation/bottom-navigation.component';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    HeaderComponent,
    BottomNavigationComponent,
    SideNavigationComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    RouterModule,
    MatListModule,
    MatRippleModule
  ],
  exports: [
    HeaderComponent,
    BottomNavigationComponent,
    SideNavigationComponent
  ]
})
export class DashboardComponentsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsHomeComponent } from './settings-home/settings-home.component';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangePhoneComponent } from './change-phone/change-phone.component';
import { ChangeAddressComponent } from './change-address/change-address.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { LanguageComponent } from './language/language.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from 'src/shared/components/components.module';
import { SharedDirectivesModule } from 'src/shared/directives/directives.module';



@NgModule({
  declarations: [
    SettingsHomeComponent,
    EditProfileComponent,
    ChangeEmailComponent,
    ChangePasswordComponent,
    ChangePhoneComponent,
    ChangeAddressComponent,
    PreferencesComponent,
    LanguageComponent
  ],
  imports: [
    CommonModule,
    MatDividerModule,
    RouterModule,
    MatRippleModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    SharedDirectivesModule
  ]
})
export class SettingsPagesModule { }

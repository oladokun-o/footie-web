import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { VerifyCodeComponent } from 'src/app/auth/components/verify-code/verify-code.component';
import { SettingsHomeComponent } from './pages/settings-home/settings-home.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { ChangeEmailComponent } from './pages/change-email/change-email.component';
import { ChangePhoneComponent } from './pages/change-phone/change-phone.component';
import { ChangeAddressComponent } from './pages/change-address/change-address.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { LanguageComponent } from './pages/language/language.component';
import { PreferencesComponent } from './pages/preferences/preferences.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: '',
        component: SettingsHomeComponent
      },
      {
        path: 'verifyOTP',
        component: VerifyCodeComponent,
        data: {
          settings: true
        }
      },
      {
        path: 'profile',
        component: EditProfileComponent
      },
      {
        path: 'email',
        component: ChangeEmailComponent
      },
      {
        path: 'phone',
        component: ChangePhoneComponent
      },
      {
        path: 'address',
        component: ChangeAddressComponent
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent
      },
      {
        path: 'language',
        component: LanguageComponent
      },
      {
        path: 'preferences',
        component: PreferencesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }

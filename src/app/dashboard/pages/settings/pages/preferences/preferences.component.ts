import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/core/interfaces/user.interface';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'footiedrop-web-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
})
export class PreferencesComponent implements OnInit {
  constructor(
    private settingsService: SettingsService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  form!: FormGroup;

  color: ThemePalette = 'accent';

  ngOnInit(): void {
    if (this.user) this.setForm();
  }

  get user(): User {
    return localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') as string)
      : null;
  }

  setForm(): void {
    this.form = new FormGroup({
      notificationsEmail: new FormControl(
        this.user.settings.notificationsEmail,
        Validators.required
      ),
      notificationsSms: new FormControl(
        this.user.settings.notificationsSms,
        Validators.required
      ),
      securityTwoFactorAuth: new FormControl(
        this.user.settings.securityTwoFactorAuth,
        Validators.required
      ),
    });
  }

  saving: boolean = false;

  save(): void {
    if (this.form.valid) {
      this.saving = true;
      this.settingsService
        .UpdateCommunicationPreferences({
          ...this.form.value,
          notificationsSms: false,
          securityTwoFactorAuth: false,
        })
        .subscribe(
          (res) => {
            // this.router.navigate(['/dashboard/settings']);
            this.saving = false;
            this.toastr.success(res.message);
          },
          (error) => {
            console.log(error);
            this.saving = false;
            if (error && error.message) {
              if (Array.isArray(error.message)) {
                error.message.forEach((err: string) => {
                  this.toastr.error(err);
                });
              } else {
                this.toastr.error(error.message);
              }
            } else {
              this.toastr.error(error);
            }
          }
        );
    }
  }
}

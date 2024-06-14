import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Languages } from 'src/app/core/interfaces/index.interface';
import { User } from 'src/app/core/interfaces/user.interface';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'footiedrop-web-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  constructor(
    private settingsService: SettingsService,
    private toastr: ToastrService
  ) {}

  form!: FormGroup;

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
      currentPassword: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, Validators.required),
      confirmNewPassword: new FormControl(null, Validators.required),
    });
  }

  saving: boolean = false;

  save(): void {
    if (this.form.valid) {
      this.saving = true;
      this.settingsService.ChangePassword(this.form.value).subscribe(
        (res) => {
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

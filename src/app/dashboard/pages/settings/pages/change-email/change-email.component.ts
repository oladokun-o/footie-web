import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/core/interfaces/user.interface';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'footiedrop-web-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss'],
})
export class ChangeEmailComponent implements OnInit {
  constructor(
    private settingsService: SettingsService,
    private toastr: ToastrService,
    private router: Router
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
      email: new FormControl(this.user.email, [Validators.required, Validators.email]),
      newEmail: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  saving: boolean = false;

  save(): void {
    if (this.form.valid) {
      this.saving = true;
      this.settingsService.ChangeEmail(this.form.value).subscribe(
        (res) => {
          this.router.navigate(['/dashboard/settings'])
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

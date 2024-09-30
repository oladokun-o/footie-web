import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'projects/admin-dashboard/src/app/core/services/user.service';

@Component({
  selector: 'admin-app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class AdminResetPasswordComponent {
  resetToken: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {
    toastr.toastrConfig.preventDuplicates = true;
    this.activatedRoute.params.subscribe(params => {
      this.resetToken = params['token'];
      this.verifyToken();
      this.setForm();
    });
  }

  verifyToken() {
    this.userService.verifyResetPasswordToken(this.resetToken).subscribe(
      res => {
        const data: { valid: true } = res.data;
        if (!data.valid) {
          this.toastr.error('Invalid token');
          if (this.isLoggedIn) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/login']);
          }
        }
      },
      err => {
        this.toastr.error('Reset password token expired');
        this.router.navigate(['/login']);
      }
    );
  }

  get isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  form!: FormGroup;

  setForm() {
    this.form = new FormGroup({
      password: new FormControl('', [Validators.required]),
      token: new FormControl(this.resetToken)
    });
  }

  loading: boolean = false;

  submit() {
    if (this.form.valid) {
      this.loading = true;
      console.log(this.form.value);
      this.userService.updatePassword(this.form.value).subscribe(
        res => {
          this.toastr.success(res.message);
          this.router.navigate(['/login']);
        },
        err => {
          this.toastr.error(err.error.message);
          this.loading = false;
        }
      );
    }
  }
}

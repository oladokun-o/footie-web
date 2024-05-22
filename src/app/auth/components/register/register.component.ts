import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateUserDto } from 'src/app/core/dto/user.dto';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'footiedrop-web-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
    confirmPassword: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.required]),
    role: new FormControl("customer"),
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    middleName: new FormControl(null),
    language: new FormControl('en', [Validators.required]),
  });
  loading = false;

  roles: string[] = ['customer', 'courier'];

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  Signup() {
    if (this.form.invalid) {
      return;
    } else {
      // make sure form values such as first name, middle name, and last name are in Capitalized form
      // convert all letters to lowercase and then capitalize the first letter
      const formvalue = {
        ...this.form.value,
        firstName: this.form.value.firstName.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase()),
        lastName: this.form.value.lastName.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase()),
        middleName: this.form.value.middleName ? this.form.value.middleName.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase()) : null,
      };

      const payload: CreateUserDto = { ...formvalue, phone: this.form.value.phone.replace(/[\s-]/g, '') };
      this.loading = true;
      this.userService.create(payload).subscribe(
        (response) => {
          if (response) {
            this.toastr.success('Account created successfully');
            this.router.navigate(['/verifyOTP']);
          } else {
            this.toastr.error('Account creation failed');
          }
        },
        (error) => {
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

          this.loading = false;
        }
      );
    }
  }

  SignupWithGoogle() {

  }
}

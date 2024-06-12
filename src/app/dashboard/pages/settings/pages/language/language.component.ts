import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Languages } from 'src/app/core/interfaces/index.interface';
import { User } from 'src/app/core/interfaces/user.interface';

@Component({
  selector: 'footiedrop-web-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent {
  constructor() {}

  get user(): User {
    return localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') as string)
      : null;
  }

  form: FormGroup = new FormGroup({
    language: new FormControl(
      this.user ? this.user.settings.language : Languages.ENGLISH,
      Validators.required
    ),
  });

  languages: { label: string; value: string }[] = Object.keys(Languages).map(
    (key) => {
      return { label: key, value: Languages[key as keyof typeof Languages] };
    }
  );

  saving: boolean = false;
}

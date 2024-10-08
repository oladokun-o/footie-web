import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserKYC } from 'projects/admin-dashboard/src/app/core/interfaces/user.interface';


@Component({
  selector: 'admin-app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent {
  @Input() record: UserKYC | undefined;
}

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'footiedrop-web-kyc-is-needed',
  templateUrl: './kyc-is-needed.component.html',
  styleUrls: ['./kyc-is-needed.component.scss']
})
export class KYCIsNeededComponent {
  constructor(
    public modal: NgbActiveModal
  ) { }
}

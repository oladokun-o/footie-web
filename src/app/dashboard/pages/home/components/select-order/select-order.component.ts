import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'footiedrop-web-select-order',
  templateUrl: './select-order.component.html',
  styleUrls: ['./select-order.component.scss']
})
export class SelectOrderComponent {
  constructor(
    public activeDialog: MatDialog,
    private toastr: ToastrService
  ) {

  }

  openComingSoonToast() {
    this.toastr.info('This feature is unavailable!')
  }
}

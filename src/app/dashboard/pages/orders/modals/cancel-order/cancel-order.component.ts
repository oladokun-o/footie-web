import { Component } from '@angular/core';

@Component({
  selector: 'footiedrop-web-cancel-order',
  templateUrl: './cancel-order.component.html',
  styleUrls: ['./cancel-order.component.scss']
})
export class CancelOrderComponent {
  why: string = 'Why do you want to cancel?';
  options: { value: string; viewValue: string; }[] = [
    { value: '1', viewValue: 'Delivery is too slow' },
    { value: '2', viewValue: 'I found a better price' },
    { value: '3', viewValue: 'I no longer need it' },
    { value: '4', viewValue: 'Other' }
  ];
  selectedOption!: { value: string; viewValue: string; };
}

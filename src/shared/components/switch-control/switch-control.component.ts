import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'footiedrop-web-switch-control',
  templateUrl: './switch-control.component.html',
  styleUrls: ['./switch-control.component.scss']
})
export class SwitchControlComponent {
  @Input() checked: boolean = false;

  @Input() disabled: boolean = false;

  @Output() checkedChange: EventEmitter<boolean> = new EventEmitter(false);

  constructor() { }

  toggle() {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.checkedChange.emit(this.checked);
    }
  }
}

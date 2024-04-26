import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[footiedropWebInputMask]'
})
export class InputMaskDirective {
  @Input() footiedropWebInputMask: string = '';

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const originalValue = input.value.replace(/\D/g, '');
    let maskedValue = '';

    let valueIndex = 0;
    for (let maskIndex = 0; maskIndex < this.footiedropWebInputMask.length; maskIndex++) {
      if (/\d/.test(this.footiedropWebInputMask[maskIndex])) {
        if (originalValue[valueIndex]) {
          maskedValue += originalValue[valueIndex++];
        } else {
          break;
        }
      } else {
        maskedValue += this.footiedropWebInputMask[maskIndex];
      }
    }

    input.value = maskedValue;
  }
}

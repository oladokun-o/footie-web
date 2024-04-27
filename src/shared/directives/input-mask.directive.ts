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

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const key = event.key;
    const selectionStart = input.selectionStart ?? 0;
    const originalValue = input.value;

    // Allow deletion of digits only, skip special characters
    if (key === 'Backspace') {
      let cursorPosition = selectionStart - 1;
      while (cursorPosition >= 0 && /\D/.test(originalValue[cursorPosition])) {
        cursorPosition--;
      }

      if (cursorPosition >= 0) {
        input.value = originalValue.slice(0, cursorPosition) + originalValue.slice(cursorPosition + 1);
      }
    }
  }

  // on paste change
  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData!.getData('text');
    const input = event.target as HTMLInputElement;
    const selectionStart = input.selectionStart ?? 0;
    const originalValue = input.value;
    let start = originalValue.slice(0, selectionStart);
    const end = originalValue.slice(selectionStart);

    let cursorPosition = selectionStart;
    for (let i = 0; i < clipboardData.length; i++) {
      if (/\d/.test(clipboardData[i])) {
        while (cursorPosition < originalValue.length && /\D/.test(originalValue[cursorPosition])) {
          cursorPosition++;
        }

        if (cursorPosition < originalValue.length) {
          start += clipboardData[i];
          cursorPosition++;
        }
      }
    }

    input.value = start + end;
  }
}

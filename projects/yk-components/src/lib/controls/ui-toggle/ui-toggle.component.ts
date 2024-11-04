import { Component, Input, booleanAttribute } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let _globalUniqueId: number = 0;

type ToggleLabelPosition = 'right' | 'left';

@Component({
  selector: 'ui-toggle',
  templateUrl: './ui-toggle.component.html',
  styleUrls: ['./ui-toggle.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: UiToggle,
    },
  ],
  host: {
    class: 'ui-toggle',
    '[class.ui-toggle--label-right]': "labelPosition == 'right'",
    '[class.ui-toggle--label-invalid]': 'invalid()',
    '[attr.name]': 'null',
  },
})
export class UiToggle implements ControlValueAccessor {
  public touched: boolean = false;

  protected _checked: boolean = false;
  private _focused: boolean = false;
  private _uniqueId: string = `ui-toggle-input-${++_globalUniqueId}`;
  private _onChange = (_: boolean) => {};
  private _onTouched = () => {};

  @Input() inputID: string = '';
  @Input() name: boolean = false;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;
  @Input({ transform: booleanAttribute }) required: boolean = false;
  @Input() labelPosition: ToggleLabelPosition = 'left';

  @Input({ transform: booleanAttribute })
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    this._checked = value;
  }

  public get focused(): boolean {
    return this._focused;
  }
  public set focused(value: boolean) {
    this._focused = value;
  }

  protected get _inputId(): string {
    return this.inputID || this._uniqueId;
  }

  invalid() {
    return this.required && this.touched && this.checked == false;
  }

  writeValue(value: boolean): void {
    this.checked = !!value;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  _onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.checked = input.checked;
    this._onChange(this.checked);
  }

  protected _onFocus(value: boolean) {
    this.focused = value;
    this._markAsTouched();
  }

  private _markAsTouched(): void {
    if (!this.touched) {
      this._onTouched();
      this.touched = true;
    }
  }
}

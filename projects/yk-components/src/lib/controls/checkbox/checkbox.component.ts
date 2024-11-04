import {
  Component,
  Input,
  ViewEncapsulation,
  booleanAttribute,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';

let _globalUniqueId: number = 0;

@Component({
  selector: 'ui-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: UiCheckbox,
    },
  ],
  host: {
    class: 'ui-checkbox',
    '[attr.name]': 'null',
  },
  imports: [NgIconComponent],
})
export class UiCheckbox implements ControlValueAccessor {
  public touched: boolean = false;

  protected _checked: boolean = false;
  private _focused: boolean = false;
  private _uniqueId: string = `ui-checkbox-${++_globalUniqueId}`;
  private _onChange = (_: boolean) => {};
  private _onTouched = () => {};

  @Input() inputID: string = '';
  @Input() name: boolean = false;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;

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

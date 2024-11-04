import { Directive, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { ESCAPE } from 'src/app/shared/utils/KeyboardKeys';
import { AbstractUiInput } from '../';

@Directive({
  selector: '[ui-input]',
  standalone: true,
  host: {
    '(focus)': '_onFocus(true)',
    '(blur)': '_onFocus(false)',
    '(input)': '_onInput()',
    '(keyup)': '_onKeyUp($event)',
  },
})
export class UiInput
  extends AbstractUiInput
  implements OnInit, DoCheck, OnDestroy
{
  public get placeholder(): string {
    return this.inputElement.placeholder || '';
  }

  override get inputElement(): HTMLInputElement | HTMLTextAreaElement {
    return this._elRef.nativeElement;
  }

  override get id(): string {
    return this.getAttr('id') || '';
  }

  public get value(): any {
    return this.control?.value || this.inputElement.value;
  }

  public set value(val: any) {
    if (this.control) {
      this.control.setValue(val);
    } else {
      this.inputElement.value = val;
    }
  }

  ngOnInit(): void {
    this.type = 'text';
    this._addClassName('form-field__input');
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  ngDoCheck(): void {
    this._updateErrorState();
  }

  public override onFormFieldClick(): void {
    this.inputElement.focus();
  }

  protected _onInput(): void {
    this.valueChanges.next(this.inputElement.value);
  }

  protected _onFocus(value: boolean): void {
    this.focus = value;
  }

  protected _onKeyUp(event: KeyboardEvent): void {
    if (event.key == ESCAPE) {
      this.inputElement.blur();
    }
  }
}

import {
  Directive,
  ElementRef,
  Optional,
  Renderer2,
  Self,
  inject,
} from '@angular/core';
import { AbstractControl, FormGroupDirective, NgControl } from '@angular/forms';
import { Subject } from 'rxjs';

@Directive()
export abstract class AbstractUiInput {
  public errorState: boolean = false;
  public type!: AbstractUiInputType;
  public readonly stateChanges: Subject<StateChangeEvents> =
    new Subject<StateChangeEvents>();
  public readonly valueChanges: Subject<any> = new Subject();

  protected _elRef: ElementRef = inject(ElementRef);
  private _renderer: Renderer2 = inject(Renderer2);
  private _isFocus: boolean = false;

  constructor(
    @Optional() public formGroup: FormGroupDirective,
    @Optional() @Self() public ngControl: NgControl
  ) {}

  public get control(): AbstractControl | undefined | null {
    return this.ngControl?.control;
  }

  public get touched(): boolean {
    return this.control?.touched == true;
  }

  public get dirty(): boolean {
    return this.control?.dirty == true;
  }

  public get focus(): boolean {
    return this._isFocus == true;
  }
  public set focus(value: boolean) {
    this._isFocus = value;

    this.stateChanges.next(
      value ? StateChangeEvents.OnFocus : StateChangeEvents.OnBlur
    );
  }

  public get invalid(): boolean {
    return this.control?.invalid == true;
  }

  public get disabled(): boolean {
    return this.control?.disabled == true;
  }

  public get value(): any {
    return this.control?.value;
  }
  public set value(val: any) {
    this.control?.setValue(val);
  }

  public getAttr(attr: string): string | null {
    return this.inputElement.getAttribute(attr);
  }

  public setAttr(attr: string, value: string): void {
    this.inputElement.setAttribute(attr, value);
  }

  protected _addClassName(className: string): void {
    const el: HTMLInputElement | HTMLTextAreaElement =
      this._elRef.nativeElement;
    this._renderer.addClass(el, className);
  }

  protected _updateErrorState(): void {
    const newState: boolean = !!(
      (this.control?.invalid &&
        (this.control?.touched || this.control?.dirty)) ||
      (this.control?.invalid && this.formGroup?.submitted)
    );

    if (this.errorState != newState) {
      this.errorState = newState;
    }
  }

  public markAsDirty() {
    this.control?.markAsDirty();
  }

  public _floatLabel(): boolean {
    return this.focus || this.value;
  }

  abstract get inputElement():
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLElement;

  abstract get id(): string;

  /**
   * @abstract
   * Register what should happen when the form-field component is clicked.
   */
  abstract onFormFieldClick(): void;
}

export enum StateChangeEvents {
  OnFocus,
  OnBlur,
  OnDisabled,
  OnOpen,
  None,
}

type AbstractUiInputType = 'text' | 'select';

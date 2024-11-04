import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Input,
  booleanAttribute,
} from '@angular/core';
import { UiInput } from './input/input.directive';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { UiSelect } from './select/select.component';
import { AbstractUiInput } from '.';
import { NgIconComponent } from '@ng-icons/core';
import { UiRipple } from '../../effect/ripple/ripple.directive';
import { UiError } from './error/error.component';
import { UiHint } from './hint/hint.component';
import { UiOption } from './select/option/option.component';
import { UiOptGroup } from './select/opt-group/opt-group.component';

@Component({
  selector: 'ui-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.css'],
  standalone: true,
  imports: [
    UiInput,
    UiError,
    UiHint,
    UiSelect,
    UiOption,
    UiOptGroup,
    NgIconComponent,
    UiRipple,
  ],
  host: {
    class: 'form-field group',
    '[class.form-field--no-label]': '!label',
    '[class.form-field--float-label]': 'label && control._floatLabel()',
    '[class.form-field--invalid]': 'control.errorState',
    '[class.form-field--disabled]': 'control.disabled',
    '[class.form-field--focus]': 'control.focus',
    '[class.form-field--select]': 'control.type === "select"',
    '[class.form-field--tertiary]': 'tertiary',
  },
  animations: [
    trigger('subscriptAnimation', [
      state('show', style({ opacity: 1, transform: 'translateY(0%)' })),
      transition('void => show', [
        style({ opacity: 0, transform: 'translateY(-5px)' }),
        animate('250ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
      ]),
    ]),
  ],
})
export class UiFormField implements AfterContentInit {
  /**
   * Control label.
   */
  @Input() label!: string;

  /**
   * Hide subscript section for hint and errors.
   */
  @Input({ transform: booleanAttribute }) hideSubscript: boolean = false;

  /**
   * Tertiary form-field is a standalone control without any hint, errors or label to show.
   */
  @Input({ transform: booleanAttribute }) tertiary: boolean = false;
  protected _subscriptAnimationState: string = '';

  @ContentChild(UiInput) private _uiInput!: UiInput;
  @ContentChild(UiSelect) private _uiSelect!: UiSelect;

  public get control(): AbstractUiInput {
    return this._uiInput || this._uiSelect;
  }

  constructor(private _cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this._checkTertiary();
  }

  ngAfterContentInit(): void {
    if (!this.control) {
      throw new ReferenceError(
        `[${UiFormField.name}]:: No ${AbstractUiInput.name} is provided.`
      );
    }
  }

  ngAfterViewInit() {
    this._subscriptAnimationState = 'show';
    this._cdr.detectChanges();
  }

  /**
   * Determine which subscript content to display 'error' or 'hint' content.
   * @returns whether 'error' or 'hint'.
   */
  protected _getSubscriptContent(): string {
    return this.control.errorState ? 'error' : 'hint';
  }

  /**
   * If the form-field is a tertiary, set label to empty string and hideSubscript to true.
   */
  private _checkTertiary(): void {
    if (this.tertiary) {
      this.hideSubscript = true;
      this.label = '';
    }
  }
}

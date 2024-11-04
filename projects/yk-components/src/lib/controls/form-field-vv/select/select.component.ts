import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ContentChildren,
  QueryList,
  Input,
  ViewEncapsulation,
  TemplateRef,
  InjectionToken,
  booleanAttribute,
  ChangeDetectionStrategy,
  inject,
  Self,
  Optional,
} from '@angular/core';
import { ViewportRuler } from '@angular/cdk/overlay';
import { AbstractUiInput } from '..';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { UiOption } from './option/option.component';
import { Observable, defer, merge, startWith, switchMap } from 'rxjs';
import {
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
} from '@angular/forms';
import { UiSelectOverlayService } from './select-overlay/select-overlay.service';
import {
  UiSelectOpenEvent,
  UiSelectCloseEvent,
  UiSelectOverlayRef,
} from './select-overlay/select-overlay-ref';
// import {
//   ARROW_DOWN,
//   ARROW_UP,
//   ENTER,
//   ESCAPE,
//   SPACE_BAR,
// } from 'src/app/shared/utils/KeyboardKeys';
// import { NgIconComponent } from '@ng-icons/core';

const ENTER = 'Enter';
const ESCAPE = 'Escape';
const SPACE_BAR = ' ';
const ARROW_UP = 'ArrowUp';
const ARROW_DOWN = 'ArrowDown';
const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
const TAB = 'Tab';
const HOME = 'Home';
const END = 'End';
const PAGE_UP = 'PageUp';
const PAGE_DOWN = 'PageDown';
const LETTER_A = 'A';

function isCTRL_All(event: KeyboardEvent): boolean {
  return event.key.toLowerCase() === 'a' && event.ctrlKey;
}


/**
 * Injection token used to provide the ui-select component for options.
 */
export const UI_SELECT_COMPONENT = new InjectionToken<UiSelect>(
  'UI_SELECT_COMPONENT'
);

@Component({
  selector: 'ui-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  standalone: true,
  imports: [/*NgIconComponent*/],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: UI_SELECT_COMPONENT, useExisting: UiSelect }],
  animations: [
    trigger('transformPanel', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'scale(1, 0.8)',
        })
      ),
      transition(
        'void => showing',
        animate(
          '120ms cubic-bezier(0, 0, 0.2, 1)',
          style({
            opacity: 1,
            transform: 'scale(1, 1)',
          })
        )
      ),
      transition('* => void', animate('100ms linear', style({ opacity: 0 }))),
    ]),
  ],
  host: {
    class: 'ui-select',
    '[class.ui-select--open]': 'panelOpen',
  },
})
export class UiSelect
  extends AbstractUiInput
  implements OnInit, ControlValueAccessor
{
  @Input({ transform: booleanAttribute }) hasSearchInput: boolean = false;
  @Input({ transform: booleanAttribute }) multiple: boolean = false;
  @Input() searchIndicatorLabel: string = 'No matching option';

  @Input()
  onMatch: (value: string, option: UiOption) => boolean = (
    value: string,
    option: UiOption
  ): boolean => option.contentValue.toString().toLowerCase().includes(value);

  override get id(): string {
    return '';
  }

  private readonly _onSelectionChange: Observable<UiOption> = defer(() => {
    const options = this.options;

    return options.changes.pipe(
      startWith(options),
      switchMap(() =>
        merge(...options.map((option) => option.onSelectionChange))
      )
    );
  }) as Observable<UiOption>;
  public panelOpen: boolean = false;

  public _selectedOptions: UiOption[] = [];
  private _uiSelectOverlayRef!: UiSelectOverlayRef;
  private _onChange = (_: any) => {};
  private _onTouched = () => {};
  private _writeChanges: boolean = false;

  protected get _displayedValue(): string {
    if (this._selectedOptions.length === 0) {
      return '';
    }

    return this.multiple
      ? this._selectedOptions.map((o) => o.contentValue).join(', ')
      : this._selectedOptions[0].contentValue;
  }

  @ViewChild('trigger') trigger!: ElementRef<HTMLDivElement>;
  @ViewChild('contentTemplate') template!: TemplateRef<any>;
  @ContentChildren(UiOption, { descendants: true })
  options!: QueryList<UiOption>;

  private _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private _uiSelectOverlayService: UiSelectOverlayService = inject(
    UiSelectOverlayService
  );
  public _viewportRuler: ViewportRuler = inject(ViewportRuler);

  constructor(
    @Optional() public override formGroup: FormGroupDirective,
    @Optional() @Self() public override ngControl: NgControl
  ) {
    super(formGroup, ngControl);

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    this.type = 'select';
    this._addClassName('form-field__select');
  }

  ngAfterContentInit() {
    this._onInitSetSelectedOptions(this.value);

    // Throw an exception if the ui-select is single-select but the number of selected options by default is more than 1.
    if (!this.multiple && this._selectedOptions.length > 1) {
      throw new Error(
        'UiSelect :: ui-select is defined as a single-select, but more than one option has been defined as default selected options.'
      );
    }

    this._onSelectionChange.subscribe(this._optionSelected.bind(this));
  }

  ngAfterViewInit() {
    this._writeChanges = true;
    this._cdr.detectChanges();
  }

  public override _floatLabel(): boolean {
    return this.focus || this._selectedOptions.length > 0;
  }

  /**
   * Open select dropdown.
   * @param fromKeyboard If you are opening select's dropdown after a keyboard interaction, you must set fromKeyboard to true.
   * If you don't, the document's keydown event will trigger when the panel just open.
   */
  public open(fromKeyboard: boolean = false): void {
    if (!this.panelOpen) {
      this.panelOpen = true;

      this._uiSelectOverlayRef = this._uiSelectOverlayService.open({
        uiSelect: this,
        uiOptions: this.options.toArray(),
        fromKeyboard: fromKeyboard,
      } as UiSelectOpenEvent);

      this._uiSelectOverlayRef
        .afterClosed()
        .subscribe((event: UiSelectCloseEvent | undefined) => {
          this.panelOpen = false;
          (this.focus = !!event?.focusOnInput) && this.inputElement.focus();
        });
    }

    !this.focus && (this.focus = true);
  }

  public close(): void {
    if (this.panelOpen) {
      this.panelOpen = false;
    }
    this.focus && (this.focus = false);
  }

  public hasSelectedOption(): boolean {
    return this._selectedOptions.length > 0;
  }

  getSelectedOptions(): UiOption[] {
    /**
     * I'm not happy with the implementation of sorting,
     * because we need to convert to an Array find option's position when comparing positions of two options.
     */
    const _options: UiOption[] = this.options.toArray();

    return this._selectedOptions.sort((a: UiOption, b: UiOption) => {
      return _options.indexOf(a) - _options.indexOf(b);
    });
  }

  setSelectedOptions(options: UiOption[]): void {
    this._selectedOptions = options;
  }

  override onFormFieldClick(): void {
    this.open();
  }

  override get inputElement(): HTMLDivElement {
    return this.trigger.nativeElement;
  }

  protected _focusEvent(): void {
    this.focus = true;
  }

  protected _blurEvent(): void {
    if (this.focus && !this.panelOpen) {
      this.focus = false;
    }
  }

  protected _keyDown(event: KeyboardEvent): void {
    const { key, altKey } = event;
    const isOpenKey: boolean =
      key === ENTER ||
      key === SPACE_BAR ||
      ((key === ARROW_UP || key === ARROW_DOWN) && altKey);
    if (isOpenKey && !this.panelOpen) {
      event.preventDefault();
      this.open(true);
      return;
    }

    if (key === ESCAPE) {
      this.inputElement.blur();
      return;
    }
  }

  writeValue(value: any): void {
    if (!this._writeChanges || !this.options) {
      return;
    }

    if (!this.multiple && Array.isArray(value)) {
      throw new Error('UiSelect :: Can not set array value to single-select.');
    }
    if (
      this.multiple &&
      value != undefined &&
      value.length > 0 &&
      !Array.isArray(value)
    ) {
      throw new Error(
        'UiSelect :: Can not set a non array value to multi-select.'
      );
    }
    // stoped here -- loop over options and set them to false
    this._selectedOptions.length = 0;
    if (value != undefined && value.length > 0) {
      if (this.multiple) {
        this.options.forEach((o) => {
          o.selected = (value as Array<any>).some(
            (val: any) => val === o.value
          );
        });
      } else {
        const option = this.options.find(
          (o) => o.value === value && !o.selected
        );
        option && (option.selected = true);
      }
    }
  }

  /**
   * Loop ones over options to get defined selected options in the template or the defined values in the FormControl.
   * @param value
   */
  private _onInitSetSelectedOptions(value: any) {
    if (!this.multiple && Array.isArray(value)) {
      throw new Error('UiSelect :: Can not set array value to single-select.');
    }
    if (
      this.multiple &&
      value != undefined &&
      value.length > 0 &&
      !Array.isArray(value)
    ) {
      throw new Error(
        'UiSelect :: Can not set a non array value to multi-select.'
      );
    }

    let _value: string[] = [];
    this.options.forEach((o) => {
      // get options defined with select true in the template
      if (o.selected) {
        this._selectedOptions.push(o);
        if (!_value.includes(o.value)) {
          _value.push(o.value);
        }

        return;
      }

      if (value != undefined && value.length > 0) {
        if (this.multiple) {
          if ((value as Array<any>).some((val: any) => val === o.value)) {
            o.selected = true;
            this._selectedOptions.push(o);

            return;
          }
        } else {
          if (value === o.value) {
            o.selected = true;
            this._selectedOptions.push(o);

            return;
          }
        }
      }
    });

    this.value = _value;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  public _optionSelected(option: UiOption): void {
    if (this.multiple) {
      const index = this._selectedOptions.indexOf(option);
      index === -1
        ? this._selectedOptions.push(option)
        : this._selectedOptions.splice(index, 1);

      this._updateSelectedOptions();

      // Mark as dirty when value changes
      if (!this.dirty) {
        this.markAsDirty();
      }
    } else {
      const currentSelectedOption: UiOption = this._selectedOptions[0];

      if (currentSelectedOption != option) {
        // check if the current selected option is not the selected one.
        currentSelectedOption && (currentSelectedOption.selected = false);
        this._selectedOptions[0] = option;
        this._writeChanges = false;
        this.value = this._selectedOptions[0].value;
        this._writeChanges = true;

        // Mark as dirty when value changes
        if (!this.dirty) {
          this.markAsDirty();
        }
      }

      this._uiSelectOverlayRef.close({
        focusOnInput: true,
      });
    }
    this._cdr.markForCheck();
  }

  public toggleAll(): void {
    const hasDeselectedOptions: boolean = this.options.some(
      (o) => !o.disabled && !o.selected
    );
    hasDeselectedOptions ? this.selectAll(true) : this.selectAll(false);
  }

  public selectAll(value: boolean): void {
    if (this.multiple) {
      this.options.forEach((o) => {
        if (o.selected !== value && !o.disabled && o.visibility) {
          o.selected = value;
        }
      });
    }
  }

  private _updateSelectedOptions() {
    this._writeChanges = false;
    this.value = this.getSelectedOptions().map((o) => o.value);
    this._writeChanges = true;
  }
}

import { Highlightable } from '@angular/cdk/a11y';
import {
  Component,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Optional,
  Inject,
  booleanAttribute,
} from '@angular/core';
import { Subject } from 'rxjs';
import { UI_SELECT_COMPONENT, UiSelect } from '../select.component';
import {
  UI_OPTGROUP_COMPONENT,
  UiOptGroup,
} from '../opt-group/opt-group.component';
import { NgIconComponent } from '@ng-icons/core';
import { UiRipple } from 'src/app/shared/ui/effect/ripple/ripple.directive';

@Component({
  selector: 'ui-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.css'],
  standalone: true,
  imports: [NgIconComponent, UiRipple],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiOption<T = any> implements OnDestroy, Highlightable {
  @ViewChild('optionItem') optionElement!: ElementRef<HTMLDivElement>;
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

  @Input() value!: T;

  readonly onSelectionChange = new Subject<UiOption<T>>();
  protected _isActive = false;
  private _visibility = true;
  private _selected: boolean = false;
  private _disabled: boolean = false;

  @Input({ transform: booleanAttribute })
  public get disabled(): boolean {
    return this._disabled || this.isParentDisabled();
  }
  public set disabled(value: boolean) {
    if (this._disabled != value) {
      this._disabled = value;
      this._cdr.markForCheck();
    }
  }

  @Input({ transform: booleanAttribute })
  public get selected(): boolean {
    return this._selected;
  }
  public set selected(value: boolean) {
    if (!this.disabled) {
      this._selected = value;
      this.onSelectionChange.next(this);
      this._cdr.markForCheck();
    }
  }

  public get visibility(): boolean {
    return this._visibility;
  }
  public set visibility(value: boolean) {
    if (this._visibility != value) {
      this._visibility = value;
      this._cdr.markForCheck();
    }
  }

  public get contentValue(): string {
    return (this.content?.nativeElement.textContent || '').trim();
  }

  constructor(
    public _cdr: ChangeDetectorRef,
    @Optional()
    @Inject(UI_SELECT_COMPONENT)
    protected _uiSelect: UiSelect,
    @Optional()
    @Inject(UI_OPTGROUP_COMPONENT)
    private _uiOptGroup: UiOptGroup
  ) {}

  ngOnDestroy(): void {
    this.onSelectionChange.complete();
  }

  setActiveStyles(): void {
    if (!this._isActive) {
      this._isActive = true;
      this._cdr.markForCheck();
    }
  }

  setInactiveStyles(): void {
    if (this._isActive) {
      this._isActive = false;
      this._cdr.markForCheck();
    }
  }

  isParentDisabled(): boolean {
    return this._uiSelect.disabled || this._uiOptGroup?.disabled;
  }

  public _triggerOption(): void {
    this.selected = this._uiSelect.multiple ? !this.selected : true;
  }
}

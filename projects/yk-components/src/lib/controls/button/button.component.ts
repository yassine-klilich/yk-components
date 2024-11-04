import {
  Component,
  ContentChild,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  ViewEncapsulation,
  booleanAttribute,
  inject,
} from '@angular/core';
import { UI_RIPPLE, UiRipple } from '../../effect/ripple/ripple.directive';
import { NgIcon } from '@ng-icons/core';
import { MatRippleLoader } from '@angular/material/core';

export type UiButtonMode =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger'
  | 'warning'
  | 'success';

@Component({
  selector: '[ui-btn]',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'cssClass',
    '[class.ui-btn-icon]': 'icon',
  },
  // imports: [UiRipple],
})
export class UiButton implements OnDestroy {
  @Input('ui-btn-mode') mode: UiButtonMode = 'tertiary';
  private _rippleLoader: MatRippleLoader = inject(MatRippleLoader);

  constructor(public _elementRef: ElementRef) {
    const element = _elementRef.nativeElement;
    this._rippleLoader?.configureRipple(element, {
      className: 'mat-mdc-button-ripple',
    });
  }

  ngOnDestroy(): void {
    this._rippleLoader?.destroyRipple(this._elementRef.nativeElement);
  }

  private _disabled: boolean = false;
  @Input({ transform: booleanAttribute })
  public get disabled(): boolean {
    return this._disabled;
  }
  public set disabled(value: boolean) {
    this._disabled = value;
    this._updateRippleDisabled();
  }

  @ContentChild(NgIcon) icon!: NgIcon;

  public get cssClass(): string {
    return `ui-btn-${this.mode}`;
  }

  private _updateRippleDisabled(): void {
    this._rippleLoader?.setDisabled(
      this._elementRef.nativeElement,
      this.disabled
    );
  }
}

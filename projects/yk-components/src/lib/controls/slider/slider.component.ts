import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  OnChanges,
  NgZone,
  Output,
  EventEmitter,
} from '@angular/core';

type SliderThumb = 'left' | 'right' | '';

type SliderType = 'slider' | 'range' | 'mono-point';

export interface UiSliderChange {
  slider: UiSlider;
  source: SliderThumb;
}

@Component({
  selector: 'ui-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
  standalone: true,
  imports: [NgFor, NgIf],
  host: {
    '[class.slider--hover-thumb]': '_showThumbHover',
  },
})
export class UiSlider implements OnChanges {
  @Input() range: number[] = [0, 100];
  @Input() value: number[] = [50];
  @Input() minLeft: number = NaN;
  @Input() maxLeft: number = NaN;
  @Input() minRight: number = NaN;
  @Input() maxRight: number = NaN;
  @Input() step: number = 1;
  @Input() disabled: boolean = false;
  @Input() markTicks: boolean = true;
  @Input() tickHighlight: boolean = true;
  @Input() hideTracker: boolean = false;
  @Input() type: SliderType = 'slider';

  @Output() dragStart: EventEmitter<UiSliderChange> = new EventEmitter();
  @Output() dragEnd: EventEmitter<UiSliderChange> = new EventEmitter();
  @Output() valueChanges: EventEmitter<UiSliderChange> = new EventEmitter();

  protected _leftPercentage: number = 0;
  protected _rightPercentage: number = 0;
  protected _markTicks: number[] = [];
  private _rangeLeft: number[] = [NaN, NaN];
  private _rangeRight: number[] = [NaN, NaN];
  private _lastMax: number = 0;
  private _sliderDOMRect?: DOMRect;
  private _thumbToAdjust: SliderThumb = '';
  private _triggerDetectChanges: boolean = false;
  private _dragStarted: boolean = false;
  private __onPointerMove = (event: PointerEvent) => {};
  private __onPointerUp = () => {};

  @ViewChild('slider', { static: false })
  private slider!: ElementRef<HTMLElement>;
  @ViewChild('thumbLeft', { static: false })
  private thumbLeft!: ElementRef<HTMLElement>;
  @ViewChild('thumbRight', { static: false })
  private thumbRight?: ElementRef<HTMLElement>;

  constructor(
    private readonly _ngZone: NgZone,
    private readonly _cdr: ChangeDetectorRef
  ) {
    this.__onPointerMove = this._onPointerMove.bind(this);
    this.__onPointerUp = this._onPointerUp.bind(this);
  }

  ngOnChanges(): void {
    this._validateInputs();
    this._adjustMinMaxValues();
    this._adjustLimitValues();
    this._adjustValue();
    this.setLeftValue(this.value[0], false);
    if (this.type == 'range') {
      this.setRightValue(this.value[1], false);
    }
    this._generateMarkTicks();
  }

  private _generateMarkTicks(): void {
    this._markTicks = [];
    if (this.markTicks) {
      for (let i = this.range[0]; i <= this.range[1]; i = i + this.step) {
        this._markTicks.push(i);
      }
    }
  }

  protected _getTickPosition(value: number): string {
    return this._mapValueToPercentageValue(value) + '%';
  }

  protected _isTickActive(value: number): boolean {
    if (!this.tickHighlight) {
      return false;
    }
    switch (this.type) {
      case 'range':
        return this.value[0] <= value && this.value[1] >= value;
      case 'slider':
        return this.value[0] >= value;
    }
    return false;
  }

  /**
   *
   * @param {*} value
   */
  public setLeftValue(
    value: number,
    checkForPreviousValue: boolean = true
  ): void {
    const correctValue = this._getValueInRange(value);
    if (
      (!checkForPreviousValue || correctValue != this.value[0]) &&
      (this.type == 'slider' || correctValue <= this.value[1]) &&
      this._rangeLeft[0] <= correctValue &&
      this._rangeLeft[1] >= correctValue
    ) {
      this.value[0] = correctValue;
      if (this.type == 'slider') {
        this._leftPercentage = 0;
        this._rightPercentage = this._mapValueToPercentageValue(correctValue);
      } else {
        this._leftPercentage = this._mapValueToPercentageValue(correctValue);
      }

      if (this._triggerDetectChanges) {
        this._cdr.detectChanges();
      }
      checkForPreviousValue &&
        this.valueChanges.next({
          slider: this,
          source: 'left',
        });
    }
  }

  /**
   *
   * @param {*} value
   */
  public setRightValue(
    value: number,
    checkForPreviousValue: boolean = true
  ): void {
    const correctValue = this._getValueInRange(value);
    if (
      (!checkForPreviousValue || correctValue != this.value[1]) &&
      correctValue >= this.value[0] &&
      this._rangeRight[0] <= correctValue &&
      this._rangeRight[1] >= correctValue
    ) {
      this.value[1] = correctValue;
      this._rightPercentage = this._mapValueToPercentageValue(correctValue);

      if (this._triggerDetectChanges) {
        this._cdr.detectChanges();
      }
      checkForPreviousValue &&
        this.valueChanges.next({
          slider: this,
          source: 'right',
        });
    }
  }

  /**
   * Adjust min and max values.
   */
  private _adjustMinMaxValues(): void {
    if (this.range[0] > this.range[1]) {
      const tempMax = this.range[1];
      this.range[1] = this.range[0];
      this.range[0] = tempMax;
    }

    this._lastMax =
      this.range[0] +
      this.step * Math.round((this.range[1] - this.range[0]) / this.step);

    if (this._lastMax > this.range[1]) {
      this._lastMax -= this.step;
    }
  }

  /**
   * Adjust the limit option to be adapted with min and max value
   * and if the limit values are in the range specified with step.
   */
  private _adjustLimitValues(): void {
    this._rangeLeft[0] = this._getValueInRange(
      Math.max(this.range[0], this.minLeft || -Infinity)
    );
    this._rangeLeft[1] = this._getValueInRange(
      Math.min(this.maxLeft || Infinity, this._lastMax)
    );

    this._rangeRight[0] = this._getValueInRange(
      Math.max(this.range[0], this.minRight || -Infinity)
    );
    this._rangeRight[1] = this._getValueInRange(
      Math.min(this.maxRight || Infinity, this._lastMax)
    );
  }

  private _getValueInRange(value: number): number {
    if (value <= this.range[0]) {
      return this.range[0];
    } else if (value >= this._lastMax) {
      return this._lastMax;
    } else {
      const lower =
        Math.floor((value - this.range[0]) / this.step) * this.step +
        this.range[0];
      const upper =
        Math.ceil((value - this.range[0]) / this.step) * this.step +
        this.range[0];

      return value - lower < upper - value ? lower : upper;
    }
  }

  private _adjustValue(): void {
    if (this.type == 'range' && this.value[0] > this.value[1]) {
      const tempVal = this.value[1];
      this.value[1] = this.value[0];
      this.value[0] = tempVal;
    }

    // Adjust left value
    if (this.value[0] < this.minLeft) {
      this.value[0] = this.minLeft;
    }
    if (this.value[0] > this.maxLeft) {
      this.value[0] = this.maxLeft;
    }

    // Adjust right value
    if (this.type == 'range') {
      if (this.value[1] < this.minRight) {
        this.value[1] = this.minRight;
      }
      if (this.value[1] > this.maxRight) {
        this.value[1] = this.maxRight;
      }
    }
  }

  /**
   * Map value to percentage range (0-100)
   * @param {number} value
   * @returns percentage value
   */
  private _mapValueToPercentageValue(value: number): number {
    const rangeFrom = this.range[1] - this.range[0];
    const rangeTo = 100;

    // Calculate the position of the value within the initial range
    const relativePosition = (value - this.range[0]) / (rangeFrom || 1);

    // Map the position to the new range with the defined step
    const steps = Math.round(relativePosition * (rangeTo / this.step));
    const mappedValue = steps * this.step;

    return mappedValue;
  }

  /**
   *
   * @param {PointerEvent} event
   */
  protected _onPointerDown(event: PointerEvent): void {
    this._thumbToAdjust = this._whichThumbToAdjust(event.clientX);
    this._sliderDOMRect = this.slider.nativeElement.getBoundingClientRect();

    // Update UI on click
    this._updateUI(event.clientX);

    this._ngZone.runOutsideAngular(() => {
      // Attach dragging events
      document.addEventListener('pointermove', this.__onPointerMove);
      document.addEventListener('pointerup', this.__onPointerUp);
    });
  }

  private _onPointerUp(): void {
    this._thumbToAdjust = '';
    this._sliderDOMRect = undefined;
    this._triggerDetectChanges = false;

    // Detach dragging events
    document.removeEventListener('pointermove', this.__onPointerMove);
    document.removeEventListener('pointerup', this.__onPointerUp);
  }

  /**
   * On pointer move
   * @param {PointerEvent} event
   */
  private _onPointerMove(event: PointerEvent): void {
    this._triggerDetectChanges = true;
    this._updateUI(event.clientX);
  }

  /**
   * Update UI
   * @param {number} pointerX
   */
  private _updateUI(pointerX: number): void {
    const percentage: number = this._getPercentage(pointerX);
    const value: number = this._mapPercentageToMinMaxRange(percentage);

    switch (this._thumbToAdjust) {
      case 'left':
        {
          this.setLeftValue(value);
          this.thumbLeft.nativeElement.focus();
        }
        break;
      case 'right':
        {
          this.setRightValue(value);
          this.thumbRight?.nativeElement.focus();
        }
        break;
    }
  }

  /**
   * Get percentage value
   * @param {number} pointerX
   */
  private _getPercentage(pointerX: number): number {
    return Math.min(
      100,
      Math.max(
        0,
        ((pointerX - this._sliderDOMRect!.left) / this._sliderDOMRect!.width) *
          100
      )
    );
  }

  /**
   * Map percentage value (0-100) to min max range value
   * @param {number} value
   * @returns
   */
  private _mapPercentageToMinMaxRange(value: number): number {
    return this.range[0] + (this.range[1] - this.range[0]) * (value / 100);
  }

  /**
   * Find which thumb to adjust.
   * @param {number} pointerX
   *
   * @returns {string} left or right
   */
  private _whichThumbToAdjust(pointerX: number): SliderThumb {
    const rectThumbLeft: DOMRect | undefined =
      this.thumbLeft.nativeElement.getBoundingClientRect();
    const rectThumbRight: DOMRect | undefined =
      this.thumbRight?.nativeElement.getBoundingClientRect();

    if (!rectThumbRight) {
      return 'left';
    }

    const distanceBetweenTwoThumbs = rectThumbRight.left - rectThumbLeft.right;
    const distanceBetweenPointerAndLeftThumb = pointerX - rectThumbLeft.right;

    return distanceBetweenPointerAndLeftThumb > distanceBetweenTwoThumbs / 2
      ? 'right'
      : 'left';
  }

  /**
   *
   * @param event
   * @param thumb
   */
  protected _onKeyDown(event: KeyboardEvent, thumb: SliderThumb): void {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        thumb == 'left'
          ? this.setLeftValue(this.value[0] - this.step)
          : this.setRightValue(this.value[1] - this.step);
        break;

      case 'ArrowRight':
      case 'ArrowUp':
        thumb == 'left'
          ? this.setLeftValue(this.value[0] + this.step)
          : this.setRightValue(this.value[1] + this.step);
        break;
    }
  }

  private _validateInputs(): void {
    if (
      isNaN(parseFloat(this.range[0].toString())) ||
      isNaN(parseFloat(this.range[1].toString()))
    ) {
      throw new Error(`Range must be array of two numbers`);
    }

    if (
      isNaN(parseFloat(this.value[0].toString())) ||
      (this.type == 'range' && isNaN(parseFloat(this.value[1].toString())))
    ) {
      throw new Error(`Invalid input value`);
    }
  }

  protected _getLeftPosition(): string {
    return this.type == 'range'
      ? this._leftPercentage + '%'
      : this._rightPercentage + '%';
  }
}

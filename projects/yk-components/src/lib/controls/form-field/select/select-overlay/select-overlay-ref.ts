import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';
import { UiOption } from '../option/option.component';
import { UiSelect } from '../select.component';
import { UiSelectOverlay } from './select-overlay.component';
import { InjectionToken } from '@angular/core';

export interface UiOptionParentComponent {
  disabled: boolean;
}

export interface UiSelectOpenEvent {
  uiSelect: UiSelect;
  uiOptions: Array<UiOption>;
  fromKeyboard: boolean;
}

export interface UiSelectCloseEvent {
  event?: KeyboardEvent;
  focusOnInput?: boolean;
}

export class UiSelectOverlayRef {
  private _afterClosedSubject = new Subject<UiSelectCloseEvent | undefined>();
  public uiSelect!: UiSelect;
  public uiOptions: UiOption[] = [];
  public uiSelectOverlay!: UiSelectOverlay;

  constructor(
    public overlayRef: OverlayRef,
    public refData: UiSelectOpenEvent
  ) {
    this.uiSelect = refData.uiSelect;
    this.uiOptions = refData.uiOptions;
  }

  /**
   * An Observable that notifies when the overlay has closed
   */
  public afterClosed(): Observable<UiSelectCloseEvent | undefined> {
    return this._afterClosedSubject.asObservable();
  }

  /**
   * @private this function is just for private use.
   */
  public close(event?: UiSelectCloseEvent | undefined): void {
    this.overlayRef.dispose();
    this._afterClosedSubject.next(event);
    this._afterClosedSubject.complete();
  }
}

import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, ElementRef, Injector, ComponentRef } from '@angular/core';
import { UiSelectOverlay } from './select-overlay.component';
import { UiSelectOpenEvent, UiSelectOverlayRef } from './select-overlay-ref';

@Injectable({
  providedIn: 'root',
})
export class UiSelectOverlayService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  open(event: UiSelectOpenEvent): UiSelectOverlayRef {
    const overlayRef: OverlayRef = this._createOverlayRef(
      event.uiSelect.trigger
    );

    const uiSelectOverlayRef: UiSelectOverlayRef = new UiSelectOverlayRef(
      overlayRef,
      event
    );

    const componentRef: ComponentRef<UiSelectOverlay> = overlayRef.attach(
      new ComponentPortal(
        UiSelectOverlay,
        null,
        Injector.create({
          parent: this.injector,
          providers: [
            { provide: UiSelectOverlayRef, useValue: uiSelectOverlayRef },
          ],
        })
      )
    );

    uiSelectOverlayRef.uiSelectOverlay = componentRef.instance;

    return uiSelectOverlayRef;
  }

  _createOverlayRef(origin: ElementRef): OverlayRef {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 2,
          panelClass: 'ui-select-pane-top',
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -3,
          panelClass: 'ui-select-pane-bottom',
        },
      ]);

    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      width: origin.nativeElement.getBoundingClientRect().width,
      positionStrategy,
      panelClass: 'ui-select-overlay-pane',
    });

    return this.overlay.create(overlayConfig);
  }
}

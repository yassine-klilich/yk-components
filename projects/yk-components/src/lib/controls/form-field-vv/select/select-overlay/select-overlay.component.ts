import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  NgZone,
} from '@angular/core';
import { UiOption } from '../option/option.component';
import { UiSelectOverlayRef } from './select-overlay-ref';
import { UiSelect } from '../select.component';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
// import {
//   ARROW_DOWN,
//   ARROW_UP,
//   END,
//   ENTER,
//   ESCAPE,
//   HOME,
//   PAGE_DOWN,
//   PAGE_UP,
//   TAB,
//   isCTRL_All,
// } from 'src/app/shared/utils/KeyboardKeys';
import { Subscription } from 'rxjs';
import { NgTemplateOutlet } from '@angular/common';


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


@Component({
  selector: 'ui-select-overlay',
  templateUrl: './select-overlay.component.html',
  styleUrls: ['./select-overlay.component.css'],
  standalone: true,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full block',
    '[class.ui-select--has-input]': 'uiSelect.hasSearchInput',
  },
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
})
export class UiSelectOverlay implements AfterViewInit {
  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('optionsWrapper') optionsWrapper!: ElementRef<HTMLDivElement>;

  protected _visibleOptions: number = NaN;

  private _keyManager!: ActiveDescendantKeyManager<UiOption>;
  private _fromKeyboard: boolean = false;
  private __keydownEvent = this._keydownEvent.bind(this);
  private _viewportRulerObserver!: Subscription;

  public get uiSelect(): UiSelect {
    return this._uiSelectOverlayRef.uiSelect;
  }

  public get searchInput(): HTMLInputElement {
    return this.searchInputRef?.nativeElement;
  }

  constructor(
    private _uiSelectOverlayRef: UiSelectOverlayRef,
    private _ngZone: NgZone,
    private _cdr: ChangeDetectorRef
  ) {
    this._fromKeyboard = this._uiSelectOverlayRef.refData.fromKeyboard;
  }

  ngOnInit(): void {
    this._viewportRulerObserver = this.uiSelect._viewportRuler
      .change()
      .subscribe(() => {
        if (this.uiSelect.panelOpen) {
          this._uiSelectOverlayRef.overlayRef.updateSize({
            width:
              this.uiSelect.trigger.nativeElement.getBoundingClientRect().width,
          });
        }
      });

    this._uiSelectOverlayRef.overlayRef
      .backdropClick()
      .subscribe(this._backdropClick.bind(this));

    this._ngZone.runOutsideAngular(() => {
      document.addEventListener('keydown', this.__keydownEvent);
    });
  }

  ngAfterViewInit(): void {
    if (this.uiSelect.hasSearchInput) {
      this.searchInput.focus();
    }

    this._initKeyManager();

    if (this.uiSelect.hasSelectedOption()) {
      this._keyManager.setActiveItem(this.uiSelect._selectedOptions[0]);
    } else {
      this._keyManager.setActiveItem(this.uiSelect.options.get(0) as UiOption);
    }

    // Detect changes for active option when open the select panel.
    this._keyManager?.activeItem?._cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this._keyManager.setActiveItem(-1);
    this._keyManager.change.complete();
    this._keyManager.destroy();
    document.removeEventListener('keydown', this.__keydownEvent);
    this._viewportRulerObserver.unsubscribe();

    // Reset all options to be visible.
    this.uiSelect.options.forEach((opt) => {
      opt.visibility = true;
    });
  }

  protected _onInputSearchInput(): void {
    if (this.uiSelect.options.length > 0) {
      const value: string | undefined = this.searchInput.value
        .trim()
        .toLowerCase();
      if (value && value.length > 0) {
        this._visibleOptions = 0;
        this.uiSelect.options.forEach((opt) => {
          const matched = this.uiSelect.onMatch(value, opt);
          if (matched != opt.visibility) {
            opt.visibility = matched;
          }
          matched && ++this._visibleOptions;
        });
      } else {
        this._visibleOptions = this.uiSelect.options.length;
        this.uiSelect.options.forEach((opt) => {
          opt.visibility = true;
        });
      }
    }
  }

  private _initKeyManager(): void {
    this._keyManager = new ActiveDescendantKeyManager(this.uiSelect.options)
      .withWrap()
      .withHomeAndEnd()
      .withPageUpDown()
      .skipPredicate(
        (o) =>
          o.visibility == false || o.disabled == true || o.isParentDisabled()
      );

    // subscribe for KeyManager changes.
    this._keyManager.change.subscribe(() => {
      this._scrollToActiveOption();
    });
  }

  private _scrollToActiveOption(): void {
    if (this._keyManager.activeItem && this.optionsWrapper) {
      const activeOption: HTMLDivElement | undefined =
        this._keyManager.activeItem.optionElement.nativeElement;
      const optionsWrapper = this.optionsWrapper.nativeElement;

      optionsWrapper.scrollTop = this._getOptionScrollPosition(
        activeOption.offsetTop - optionsWrapper.offsetTop,
        activeOption.offsetHeight,
        optionsWrapper.scrollTop,
        optionsWrapper.offsetHeight
      );
    }
  }

  private _getOptionScrollPosition(
    optionOffset: number,
    optionHeight: number,
    currentScrollPosition: number,
    panelHeight: number
  ): number {
    if (optionOffset < currentScrollPosition) {
      return optionOffset;
    }

    if (optionOffset + optionHeight > currentScrollPosition + panelHeight) {
      return Math.max(0, optionOffset - panelHeight + optionHeight);
    }

    return currentScrollPosition;
  }

  private _backdropClick(): void {
    this._uiSelectOverlayRef.close();
  }

  private _keydownEvent(event: KeyboardEvent): void {
    /**
     * - KeydownEvent gets triggered when select-overlay gets opened.
     * We must prevent this to make use of ALT+(ArrowUp or ArrowDown) to close the panel as default shortcut browser.
     *
     * - Something else, When select-overlay is open and the user pressed Tab key,
     * it must close the select-overlay panel and focus on the select input, as this is the default browser behaviour.
     *
     * - Default browser behavior doesn't select options on spacebar key, this is not the case with mat-select of angular.
     * I'm gonna follow the default browser behavior, and I will limit seletion of option only on Enter key.
     *
     * - Another default browser behavior, which is when you press Escape or Tab,
     * it focus back to select input, which is not the case with mat-select when you press Tab key it focus to the next element,
     * I'm keeping the default browser behavior, I focus back to select element which in my case is ui-select component.
     *
     */
    if (!this._fromKeyboard) {
      if (
        (event.altKey &&
          (event.key === ARROW_UP || event.key === ARROW_DOWN)) ||
        [TAB, ESCAPE].includes(event.key)
      ) {
        event.preventDefault();
        this._uiSelectOverlayRef.close({
          focusOnInput: true,
        });
        return;
      }

      if (
        this.uiSelect.multiple &&
        event.shiftKey === true &&
        this._keyManager
      ) {
        if (event.key === ARROW_DOWN) {
          this._ngZone.run(() => {
            this._keyManager.setNextItemActive();
            this._keyManager.activeItem?._triggerOption();
          });
        } else if (event.key === ARROW_UP) {
          this._ngZone.run(() => {
            this._keyManager.setPreviousItemActive();
            this._keyManager.activeItem?._triggerOption();
          });
        }
        return;
      }

      if (event.key === ENTER && this._keyManager) {
        this._ngZone.run(() => {
          this._keyManager?.activeItem?._triggerOption();
        });
        return;
      }

      if (this.uiSelect.multiple && isCTRL_All(event)) {
        event.preventDefault();
        this._ngZone.run(() => {
          this.uiSelect.toggleAll();
        });
        return;
      }

      if (this._isNavigationKey(event.key)) {
        this._ngZone.run(() => {
          this._keyManager.onKeydown(event);
        });
      }
    }

    this._fromKeyboard = false;
  }

  private _isNavigationKey(key: string) {
    return [ARROW_UP, ARROW_DOWN, HOME, END, PAGE_UP, PAGE_DOWN].includes(key);
  }
}

import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  InjectionToken,
} from '@angular/core';

/**
 * Injection token used to provide the ui-select component for options.
 */
export const UI_OPTGROUP_COMPONENT = new InjectionToken<UiOptGroup>(
  'UI_OPTGROUP_COMPONENT'
);

@Component({
  selector: 'ui-optgroup',
  templateUrl: './opt-group.component.html',
  styleUrls: ['./opt-group.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: UI_OPTGROUP_COMPONENT, useExisting: UiOptGroup }],
  host: {
    '[class.ui-optgroup--disabled]': 'disabled',
  },
})
export class UiOptGroup {
  @Input() label: string = '';
  @Input() disabled: boolean = false;
}

import { Component } from '@angular/core';

@Component({
  selector: 'ui-hint',
  template: '<ng-content></ng-content>',
  standalone: true,
  styles: [
    `
      :host {
        @apply text-gray-500 text-s;
      }
    `,
  ],
})
export class UiHint {}

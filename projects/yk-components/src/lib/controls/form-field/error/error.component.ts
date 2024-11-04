import { Component } from '@angular/core';

@Component({
  selector: 'ui-error',
  template: '<ng-content></ng-content>',
  standalone: true,
  styles: [
    `
      :host {
        color: #ff2b2b;
        font-size: 1.2rem;
      }
    `,
  ],
})
export class UiError {}

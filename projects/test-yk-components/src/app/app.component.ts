import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { UiFormFieldModule, YkSelectComponent } from 'yk-components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, YkSelectComponent, UiFormFieldModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'test-yk-components';
}

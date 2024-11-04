import { NgModule } from '@angular/core';
import { UiError } from './error/error.component';
import { UiFormField } from './form-field.component';
import { UiHint } from './hint/hint.component';
import { UiInput } from './input/input.directive';
import { UiOptGroup } from './select/opt-group/opt-group.component';
import { UiOption } from './select/option/option.component';
import { UiSelect } from './select/select.component';

@NgModule({
  exports: [
    UiFormField,
    UiInput,
    UiError,
    UiHint,
    UiSelect,
    UiOption,
    UiOptGroup,
  ],
  imports: [
    UiFormField,
    UiInput,
    UiError,
    UiHint,
    UiSelect,
    UiOption,
    UiOptGroup,
  ],
})
export class UiFormFieldModule {}

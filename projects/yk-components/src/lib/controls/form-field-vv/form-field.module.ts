import { NgModule } from '@angular/core';
import { UiFormField } from './form-field.component';
import { UiOptGroup } from './select/opt-group/opt-group.component';
import { UiOption } from './select/option/option.component';
import { UiSelect } from './select/select.component';

@NgModule({
  exports: [
    UiFormField,
    UiSelect,
    UiOption,
    UiOptGroup,
  ],
  imports: [
    UiFormField,
    UiSelect,
    UiOption,
    UiOptGroup,
  ],
})
export class UiFormFieldModule {}

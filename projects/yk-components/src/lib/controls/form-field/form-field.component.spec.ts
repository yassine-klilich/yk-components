import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiFormField } from './form-field.component';

describe('FormFieldInputComponent', () => {
  let component: UiFormField;
  let fixture: ComponentFixture<UiFormField>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UiFormField]
    });
    fixture = TestBed.createComponent(UiFormField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

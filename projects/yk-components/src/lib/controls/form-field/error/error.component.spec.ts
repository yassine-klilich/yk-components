import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiError } from './error.component';

describe('FormFieldErrorComponent', () => {
  let component: UiError;
  let fixture: ComponentFixture<UiError>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UiError]
    });
    fixture = TestBed.createComponent(UiError);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

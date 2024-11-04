import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiOption } from './option.component';

describe('UiOption', () => {
  let component: UiOption;
  let fixture: ComponentFixture<UiOption>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UiOption]
    });
    fixture = TestBed.createComponent(UiOption);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

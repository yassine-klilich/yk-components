import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSelect } from './select.component';

describe('UiSelect', () => {
  let component: UiSelect;
  let fixture: ComponentFixture<UiSelect>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UiSelect]
    });
    fixture = TestBed.createComponent(UiSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

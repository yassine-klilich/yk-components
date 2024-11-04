import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiHint } from './hint.component';

describe('UiHint', () => {
  let component: UiHint;
  let fixture: ComponentFixture<UiHint>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UiHint]
    });
    fixture = TestBed.createComponent(UiHint);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

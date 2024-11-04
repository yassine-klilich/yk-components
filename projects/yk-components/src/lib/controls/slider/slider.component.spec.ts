import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSlider } from './slider.component';

describe('UiSlider', () => {
  let component: UiSlider;
  let fixture: ComponentFixture<UiSlider>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UiSlider]
    });
    fixture = TestBed.createComponent(UiSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptGroupComponent } from './opt-group.component';

describe('OptGroupComponent', () => {
  let component: OptGroupComponent;
  let fixture: ComponentFixture<OptGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OptGroupComponent]
    });
    fixture = TestBed.createComponent(OptGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

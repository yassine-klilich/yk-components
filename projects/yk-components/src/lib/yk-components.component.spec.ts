import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YkComponentsComponent } from './yk-components.component';

describe('YkComponentsComponent', () => {
  let component: YkComponentsComponent;
  let fixture: ComponentFixture<YkComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YkComponentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YkComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

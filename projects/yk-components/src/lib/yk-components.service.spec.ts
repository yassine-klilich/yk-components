import { TestBed } from '@angular/core/testing';

import { YkComponentsService } from './yk-components.service';

describe('YkComponentsService', () => {
  let service: YkComponentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YkComponentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

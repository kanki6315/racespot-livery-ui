import { TestBed } from '@angular/core/testing';

import { LiveryService } from './livery.service';

describe('LiveryService', () => {
  let service: LiveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

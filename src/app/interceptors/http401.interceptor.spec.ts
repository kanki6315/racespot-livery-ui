import { TestBed } from '@angular/core/testing';

import { Http401Interceptor } from './http401.interceptor';

describe('Http401Interceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      Http401Interceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: Http401Interceptor = TestBed.inject(Http401Interceptor);
    expect(interceptor).toBeTruthy();
  });
});

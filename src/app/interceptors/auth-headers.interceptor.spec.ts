import { TestBed } from '@angular/core/testing';

import { AuthHeadersInterceptor } from './auth-headers.interceptor';

describe('AuthHeadersInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthHeadersInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthHeadersInterceptor = TestBed.inject(AuthHeadersInterceptor);
    expect(interceptor).toBeTruthy();
  });
});

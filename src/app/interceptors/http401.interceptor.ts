import {Injectable, Injector} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';
import {tap} from 'rxjs/operators';

@Injectable()
export class Http401Interceptor implements HttpInterceptor {

  constructor(
    public router: Router,
    private injector: Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authenticationService = this.injector.get(AuthenticationService);
    return next.handle(req).pipe(tap(() => {
      // nothing to do there
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        authenticationService.clearAuth();
        this.router.navigateByUrl('/');
      }
    }));
  }
}

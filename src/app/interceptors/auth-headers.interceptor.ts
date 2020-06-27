import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthenticationService} from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthHeadersInterceptorService implements HttpInterceptor {

  constructor(private _authService: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this._authService.getToken() != null && !req.url.includes('s3')) {
      const clonedReq = req.clone({
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this._authService.getToken()}`
        })
      });

      return next.handle(clonedReq);
    }
    return next.handle(req);
  }
}

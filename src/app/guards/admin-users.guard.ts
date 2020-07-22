import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from '../services/authentication.service';


@Injectable({
  providedIn: 'root'
})
export class AdminUsersGuard implements CanActivate, CanActivateChild {

  constructor(private authenticationService: AuthenticationService) { }

  canActivate(): Observable<boolean> {
    return this.authenticationService.isAdmin();
  }

  canActivateChild(): Observable<boolean> {
    return this.authenticationService.isAdmin();
  }
}

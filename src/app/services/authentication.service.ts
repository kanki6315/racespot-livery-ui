import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable, of, ReplaySubject} from 'rxjs';
import {User} from '../models/user';
import {catchError, map, publishReplay, refCount, startWith, tap} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    public router: Router,
    private http: HttpClient) {
  }
  private helper = new JwtHelperService();
  public _baseUrl = 'https://4bvauc5gjl.execute-api.us-east-2.amazonaws.com/Prod';
  private tokenSubject = new ReplaySubject<string | null>(1);
  public token = this.tokenSubject.asObservable().pipe(
    startWith(localStorage.getItem('token')),
    tap(token => {
      if (token) {
        localStorage.setItem('token', token);
      }
    }),
    publishReplay(1),
    refCount(),
  );

  private _getUserObservable: Observable<User | null> | null = null;

  private getUser(): Observable<User | null> {
    if (this._getUserObservable === null) {
      this._getUserObservable = this.http.get<User>(`${this._baseUrl}/api/users/me`)
        .pipe(
          publishReplay(),
          refCount(),
          catchError(() => {
            this.clearAuth();
            return of(null);
          }),
        );
    }
    return this._getUserObservable;
  }

  public isAdmin(): Observable<boolean> {
    return this.getUser().pipe(
      map(user => {
        if (user) {
          return user.isAdmin;
        }
        return false;
      })
    );
  }

  public getIracingId(): Observable<string> {
    return this.getUser().pipe(
      map(user => {
        return user && user.iracingId ? user.iracingId : '';
      })
    );
  }

  public isVerified(): Observable<boolean> {
    return this.getUser().pipe(
      map(user => {
        return user && user.iracingId && user.iracingId.length > 0;
      })
    );
  }

  public setToken(token: string): void {
    this.tokenSubject.next(token);
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public logout(): void {
    this.http.post(`${this._baseUrl}/api/accounts/logout`, null)
      .subscribe(() => {
          this.clearAuth();
          this.router.navigateByUrl('/');
        },
        () => {
          console.log('error logging out');
        });
  }

  public clearAuth(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

  public isAuthenticated(): Observable<boolean> {
    return this.token.pipe(
      map((t: string) => {
        return !this.helper.isTokenExpired(t);
      })
    );
  }

  public displayName(): Observable<string> {
    return this.getUser().pipe(
      map(user => {
        if (user) {
          if (!user.iracingId && user.iracingId.length === 0) {
            return user.emailAddress;
          }
          return `${user.firstName} ${user.lastName}`;
        }
        return '';
      })
    );
  }
}

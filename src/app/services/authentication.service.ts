import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable, of, ReplaySubject, Subject} from 'rxjs';
import {User} from '../models/user';
import {catchError, map, merge, publishReplay, refCount, startWith, tap} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Livery} from '../models/livery';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    public router: Router,
    private http: HttpClient) {
  }
  private userUpdateSubject = new Subject<User>();
  private helper = new JwtHelperService();
  private _baseUrl = environment.baseUrl;
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
      this._getUserObservable = this.http.get<User>(`${this._baseUrl}/users/me`)
        .pipe(
          publishReplay(),
          refCount(),
          catchError(() => {
            this.clearAuth();
            return of(null);
          }),
        );
    }
    return this._getUserObservable
      .pipe(
        merge(this.userUpdateSubject.asObservable()),
        publishReplay(),
        refCount()
      );
  }

  public isEmailEnabled(): Observable<boolean> {
    return this.getUser().pipe(
      map(user => {
        if (user) {
          return user.isAgreedToEmails;
        }
        return false;
      })
    );
  }

  public isAdmin(): Observable<boolean> {
    return this.getUser().pipe(
      map(user => {
        if (user) {
          return user.isAdmin || user.isLeagueAdmin;
        }
        return false;
      })
    );
  }

  public isRaceSpotAdmin(): Observable<boolean> {
    return this.getUser().pipe(
      map(user => {
        if (user) {
          return user.isAdmin;
        }
        return false;
      })
    );
  }

  public isLeagueAdmin(): Observable<boolean> {
    return this.getUser().pipe(
      map(user => {
        if (user) {
          return user.isLeagueAdmin;
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

  public getEmailAddress(): Observable<string> {
    return this.getUser().pipe(
      map(user => {
        return user && user.emailAddress ? user.emailAddress : '';
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

  public canSendVerificationMessage(): Observable<boolean> {
    return this.getUser().pipe(
      map(user => {
        if (!user) {
          return false;
        }
        if (!user.lastInviteSent) {
          return true;
        }
        let oneDayAgo = new Date();
        oneDayAgo = new Date(oneDayAgo.getTime() - (1000 * 60 * 15)); // (1000 * 60 * 60 * 24) = 1 day);
        return new Date(user.lastInviteSent) < oneDayAgo;
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
    this.http.post(`${this._baseUrl}/accounts/logout`, null)
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
          if (!user.iracingId || user.iracingId.length === 0) {
            return user.emailAddress;
          }
          return `${user.firstName} ${user.lastName}`;
        }
        return '';
      })
    );
  }

  sendVerificationMessage(iracingId: string): Observable<any> {
    return this.http.post<any>(`${this._baseUrl}/accounts/send-iracing-verification`, {iracingId: iracingId});
  }

  finalizeVerificationMessage(key: string): Observable<User> {
    return this.http.post<User>(`${this._baseUrl}/accounts/iracing-verification`, {key: key});
  }

  setIracingId(user: User) {
    this._getUserObservable.subscribe(existing => {
      this.userUpdateSubject.next({...existing, iracingId: user.iracingId, firstName: user.firstName, lastName: user.lastName});
    });
  }

  setLastInviteDate() {
    this._getUserObservable.subscribe(user => {
      this.userUpdateSubject.next({...user, lastInviteSent: new Date()});
    });
  }

  selfUserUpdate(isEmailEnabled: boolean): Observable<User> {
    return this.http.put<User>(`${this._baseUrl}/users/me`, {isAgreedToEmails: isEmailEnabled});
  }

  setIsAgreedToEmails(isAgreedToEmails: boolean) {
    this._getUserObservable.subscribe(user => {
      this.userUpdateSubject.next({...user, isAgreedToEmails: isAgreedToEmails});
      user.isAgreedToEmails = isAgreedToEmails;
    });
  }
}

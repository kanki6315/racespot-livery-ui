import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {AuthenticationService} from './services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public defaultAlertMessage = 'User is not verified';

  public baseUrl = this.authenticationService._baseUrl;
  public isAuthenticated = this.authenticationService.isAuthenticated();
  public isVerified = this.authenticationService.isVerified();
  public canSendVerification = this.authenticationService.canSendVerificationMessage();
  public isAdmin = this.authenticationService.isAdmin();
  public displayName = this.authenticationService.displayName();

  private subs =  new Subscription();

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.subs.add(
      this.spyOnFragment()
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  logout() {
    this.authenticationService.logout();
  }

  private spyOnFragment(): Subscription {
    return this.route.fragment
      .pipe(
        filter(f => Boolean(f)),
      )
      .subscribe((fragment: string) => {
        const key = fragment.substring(0, fragment.indexOf('='));
        const value = fragment.substring(fragment.indexOf('=') + 1);
        if (key === 'token') {
          this.authenticationService.setToken(value);
          const storedKey = localStorage.getItem('key');
          localStorage.removeItem('key');
          if (storedKey != null) {
            this.authenticationService.finalizeVerificationMessage(storedKey).subscribe((result) => {
              this.authenticationService.setIracingId(result.iracingId);
              console.log('success!');
              this.router.navigate([]);
            }, error => {
              console.log(error.error); // likely different user than generated invite or key already used
              this.router.navigate([]);
            });
          } else {
            this.router.navigate([]);
          }
        } else {
          this.isAuthenticated.subscribe((isLoggedIn) => {
            if (isLoggedIn) {
              this.authenticationService.finalizeVerificationMessage(value).subscribe((result) => {
                this.authenticationService.setIracingId(result.iracingId);
                console.log('success!');
                this.router.navigate([]);
              }, error => {
                console.log(error.error); // likely different user than generated invite or key already used
                this.router.navigate([]);
              });
            } else {
              localStorage.setItem('key', value);
              window.location.href = `${this.baseUrl}/api/accounts/google`;
            }
          });
        }
      });
  }
}

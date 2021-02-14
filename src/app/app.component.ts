import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {AuthenticationService} from './services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {ErrorModalComponent} from './error-modal/error-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../environments/environment';
import {RejectionsService} from './services/rejections.service';
import {RejectionNotice} from './models/rejectionNotice';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public defaultAlertMessage = 'User is not verified';

  public baseUrl = environment.baseUrl;
  public isAuthenticated = this.authenticationService.isAuthenticated();
  public isVerified = this.authenticationService.isVerified();
  public canSendVerification = this.authenticationService.canSendVerificationMessage();
  public isAdmin = this.authenticationService.isAdmin();
  public displayName = this.authenticationService.displayName();
  public alerts: RejectionNotice[] = [];

  private subs =  new Subscription();

  constructor(private authenticationService: AuthenticationService,
              private rejectionService: RejectionsService,
              private router: Router,
              private route: ActivatedRoute,
              private _modalService: NgbModal) {
    this.rejectionService.getAlerts().subscribe((sub) => {
      this.alerts = sub;
    });
  }

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
        if (fragment.indexOf('=') === -1) {
          return;
        }
        const key = fragment.substring(0, fragment.indexOf('='));
        const value = fragment.substring(fragment.indexOf('=') + 1);
        if (key === 'token') {
          this.authenticationService.setToken(value);
          const storedKey = localStorage.getItem('key');
          localStorage.removeItem('key');
          if (storedKey != null) {
            this.authenticationService.finalizeVerificationMessage(storedKey).subscribe((result) => {
              this.authenticationService.setIracingId(result);
              this.router.navigate([]);
            }, error => {
              const errorComponentInstance = this._modalService.open(ErrorModalComponent).componentInstance as ErrorModalComponent;
              errorComponentInstance.errorMessage = error.error;
              // likely different user than generated invite or key already used
              this.router.navigate([]);
            });
          } else {
            this.router.navigate([]);
          }
        } else {
          this.isAuthenticated.subscribe((isLoggedIn) => {
            if (isLoggedIn) {
              this.authenticationService.finalizeVerificationMessage(value).subscribe((result) => {
                this.authenticationService.setIracingId(result);
                this.router.navigate([]);
              }, error => {
                const errorComponentInstance = this._modalService.open(ErrorModalComponent).componentInstance as ErrorModalComponent;
                errorComponentInstance.errorMessage = error.error;
                // likely different user than generated invite or key already used
                this.router.navigate([]);
              });
            } else {
              localStorage.setItem('key', value);
              window.location.href = `${this.baseUrl}/accounts/google`;
            }
          });
        }
      });
  }
}

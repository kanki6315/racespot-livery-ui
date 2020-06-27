import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthenticationService} from './services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public baseUrl = this.authenticationService._baseUrl;
  public isAuthenticated = this.authenticationService.isAuthenticated();
  public isAdmin = this.authenticationService.isAdmin();
  public displayName = this.authenticationService.displayName();

  private subs =  new Subscription();

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.subs.add(
      this.spyOnToken()
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  logout() {
    this.authenticationService.logout();
  }

  private spyOnToken(): Subscription {
    return this.route.fragment
      .pipe(
        filter(f => Boolean(f)),
      )
      .subscribe((token: string) => {
        this.authenticationService.setToken(token);

        // Remove token query param
        this.router.navigate([]);
      });
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {Series} from '../../models/series';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-series-card',
  templateUrl: './series-card.component.html',
  styleUrls: ['./series-card.component.scss']
})
export class SeriesCardComponent implements OnInit {

  public isAuthenticated = this._authenticationService.isAuthenticated();
  public isVerified = this._authenticationService.isVerified();
  constructor(
    private _authenticationService: AuthenticationService) { }
  @Input() series: Series;

  ngOnInit(): void {
  }

}

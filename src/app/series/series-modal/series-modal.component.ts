import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {SeriesService} from '../../services/series.service';
import {Series} from '../../models/series';
import {AuthenticationService} from '../../services/authentication.service';
import {Livery} from '../../models/livery';
import {LiveryService} from '../../services/livery.service';
import {Team} from '../../models/team';

@Component({
  selector: 'app-series-modal',
  templateUrl: './series-modal.component.html',
  styleUrls: ['./series-modal.component.scss']
})
export class SeriesModalComponent implements OnInit, AfterViewInit {
  id: string;
  series: Series;
  private _modal: NgbModalRef;
  teamLiveryMap: Map<string, Livery[]>;
  liveries: Livery[] = [];
  teams: Team[];

  @ViewChild('content', { static: false }) content: ElementRef;
  constructor(
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _router: Router,
    private _liveryService: LiveryService,
    private _authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this._route.data.subscribe((data: { series: Series }) => {
      this.series = data.series;
      this._authenticationService.isVerified().subscribe((isVerified) => {
        if (isVerified) {
          this._liveryService.getLiveriesBySeriesId(this.series.id).subscribe((liveries) => {
            if (this.series.isTeam) {
              liveries.forEach(t => {
                if (this.teamLiveryMap.has(t.iTeamId)) {
                  // @ts-ignore
                  this.teamLiveryMap.get(t.iTeamId).push(t);
                } else {
                  this.teamLiveryMap.set(t.iTeamId, [t]);
                  this.teams.push({name: t.iTeamName, iRacingId: t.iTeamId, carName: t.carName});
                }
              });
              this.liveries = liveries;
            } else {
              this.liveries = liveries;
            }
          });
        }
      });
    });

    this._route.paramMap.subscribe((paramMap) => {
      this.id = paramMap.get('id') || '';
    });
  }

  ngAfterViewInit(): void {
    this._modal = this._modalService.open(this.content, { size: 'lg' });
    this._modal.result
      .then(() => {
          this.backToSeriesList();
        },
        () => {
          this.backToSeriesList();
        });
  }

  backToSeriesList(): void {
    this._router.navigate(['/']);
  }
}

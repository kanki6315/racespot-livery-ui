import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Series} from '../../models/series';
import {SeriesService} from '../../services/series.service';
import {addParseError} from '@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils';
import {ActivatedRoute, Router} from '@angular/router';
import {LiveryService} from '../../services/livery.service';
import {Livery} from '../../models/livery';
import {Team} from '../../models/team';
import {User} from '../../models/user';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-liveries.component.html',
  styleUrls: ['./admin-liveries.component.scss']
})
export class AdminLiveriesComponent implements OnInit {

  isLoadingLiveries = false;
  _seriesId: string;
  allSeries: Observable<Series[]>;
  selectedSeries: Series;
  liveries = new Array<Livery>();
  idLiveryMap: Map<string, Livery[]> = new Map<string, Livery[]>();
  teams: Team[] = [];
  users: any = [];
  constructor(private _seriesService: SeriesService,
              private _router: Router,
              private _route: ActivatedRoute,
              private _liveryService: LiveryService) { }

  ngOnInit(): void {
    this.allSeries = this._seriesService.getAdminSeries();

    this._route.queryParamMap.subscribe((params) => {
      const seriesId = params.get('seriesId');
      if (seriesId !== null) {
        this._seriesId = seriesId;
        this.getLiveries(this._seriesId);
      }
    });

  }

  private getLiveries(seriesId: string) {
    this.isLoadingLiveries = true;
    this._liveryService.getAdminLiveriesBySeriesId(seriesId).subscribe((liveries) => {
      this.idLiveryMap.clear();
      this.teams = [];
      this.users = [];
      if (this.selectedSeries.isTeam) {
        liveries.forEach(t => {
          if (t.liveryType === 'Helmet' && (!t.iTeamId || t.iTeamId.length === 0)) {
            // TODO: personal helmets won't be shown for now
            return;
          }
          if (this.idLiveryMap.has(t.iTeamId)) {
            // @ts-ignore
            if (t.liveryType === 'Car') {
              this.teams.filter(team => team.iRacingId === t.iTeamId)[0].carName = t.carName;
            }
            this.idLiveryMap.get(t.iTeamId).push(t);
          } else {
            this.idLiveryMap.set(t.iTeamId, [t]);
            this.teams.push({name: t.iTeamName, iRacingId: t.iTeamId, carName: t.carName});
          }
        });
        this.teams.sort((a, b) => a.name.localeCompare(b.name));
        this.liveries = liveries;
      } else {
        liveries.forEach(t => {
          if (this.idLiveryMap.has(t.userId)) {
            // @ts-ignore
            if (t.liveryType === 'Car') {
              this.users.filter(u => u.firstName === t.firstName && t.lastName === t.lastName)[0].carName = t.carName;
            }
            this.idLiveryMap.get(t.userId).push(t);
          } else {
            this.idLiveryMap.set(t.userId, [t]);
            this.users.push({firstName: t.firstName, lastName: t.lastName, carName: t.carName, userId: t.userId});
          }
        });
        this.users.sort((a, b) => a.firstName.localeCompare(b.firstName));
        this.liveries = liveries;
      }
      this.isLoadingLiveries = false;
    });
  }

  changeSeries(series: Series) {
    this.selectedSeries = series;
    this._router.navigate([], {
      queryParams: {
        seriesId: series.id
      },
      queryParamsHandling: 'merge'
    });
  }
}

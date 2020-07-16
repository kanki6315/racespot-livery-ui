import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SeriesService} from '../../services/series.service';
import {Series} from '../../models/series';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-series-list',
  templateUrl: './series-list.component.html',
  styleUrls: ['./series-list.component.scss']
})
export class SeriesListComponent implements OnInit {

  isLoadingSeries = true;
  seriesList: Series[] = [];
  constructor(private _seriesService: SeriesService) { }

  ngOnInit(): void {
    this._seriesService.getAllSeries()
      .pipe(finalize(() => this.isLoadingSeries = false))
      .subscribe((series) => {
        this.seriesList = series;
      });
  }
}

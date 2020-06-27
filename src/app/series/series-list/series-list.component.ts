import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SeriesService} from '../../services/series.service';
import {Series} from '../../models/series';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-series-list',
  templateUrl: './series-list.component.html',
  styleUrls: ['./series-list.component.scss']
})
export class SeriesListComponent implements OnInit {

  seriesList: Observable<Series[]>;
  constructor(private _seriesService: SeriesService) { }

  ngOnInit(): void {
    this.seriesList = this._seriesService.getAllSeries();
  }
}

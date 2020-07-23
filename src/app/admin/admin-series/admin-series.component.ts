import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Series} from '../../models/series';
import {SeriesService} from '../../services/series.service';

@Component({
  selector: 'app-admin-series',
  templateUrl: './admin-series.component.html',
  styleUrls: ['./admin-series.component.scss']
})
export class AdminSeriesComponent implements OnInit {

  allSeries: Observable<Series[]>;
  constructor(private seriesService: SeriesService) { }

  ngOnInit(): void {
    this.allSeries = this.seriesService.getAdminSeries();
  }

  editSeries(series: Series) {
  }

  isArchived(series: Series) {
    return {
      'bg-danger text-white': series.isArchived,
      'text-center' : true
    };
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {Series} from '../../models/series';

@Component({
  selector: 'app-series-card',
  templateUrl: './series-card.component.html',
  styleUrls: ['./series-card.component.scss']
})
export class SeriesCardComponent implements OnInit {

  constructor() { }
  @Input() series: Series;

  ngOnInit(): void {
  }

}

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Series} from '../models/series';
import {Observable} from 'rxjs';
import {Livery} from '../models/livery';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  private _baseUrl = 'https://4bvauc5gjl.execute-api.us-east-2.amazonaws.com/Prod';

  constructor(private _http: HttpClient) { }

  getAllSeries(): Observable<Series[]> {
    return this._http.get<Series[]>(`${this._baseUrl}/api/series`);
  }

  getById(seriesId: string): Observable<Series> {
    return this._http.get<Series>(`${this._baseUrl}/api/series/${seriesId}`);
  }
}

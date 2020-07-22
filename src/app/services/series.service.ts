import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Series} from '../models/series';
import {Observable} from 'rxjs';
import {Livery} from '../models/livery';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) { }

  getAllSeries(): Observable<Series[]> {
    return this._http.get<Series[]>(`${this._baseUrl}/series`);
  }

  getById(seriesId: string): Observable<Series> {
    return this._http.get<Series>(`${this._baseUrl}/series/${seriesId}`);
  }
}

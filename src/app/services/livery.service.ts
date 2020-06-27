import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Livery} from '../models/livery';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LiveryService {
  private _baseUrl = 'https://4bvauc5gjl.execute-api.us-east-2.amazonaws.com/Prod';

  constructor(private _http: HttpClient) { }
  getLiveriesBySeriesId(seriesId: string): Observable<Livery[]> {
    return this._http.get<Livery[]>(`${this._baseUrl}/api/series/${seriesId}/liveries`);
  }

  upload(payload: FormData, seriesId: string, carId: string): Observable<Livery> {
    return this._http.post<Livery>(`/api/series/${seriesId}/cars/${carId}/liveries`, payload);
  }
}

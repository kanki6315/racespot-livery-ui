import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Livery} from '../models/livery';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LiveryService {
  private _baseUrl = 'https://api.racespot.media';

  constructor(private _http: HttpClient) { }
  getLiveriesBySeriesId(seriesId: string): Observable<Livery[]> {
    return this._http.get<Livery[]>(`${this._baseUrl}/series/${seriesId}/liveries`);
  }

  finalizeUpload(liveryId: string): Observable<Livery> {
    return this._http.post<Livery>(`${this._baseUrl}/liveries/${liveryId}/finalize`, null);
  }

  getPresignedUrl(seriesId: string, livery: Livery, carId: string): Observable<Livery> {
    return this._http.post<Livery>(`${this._baseUrl}/series/${seriesId}/liveries`,
      {iTeamId: livery.iTeamId, carId: carId, liveryType: livery.liveryType});
  }

  upload(payload: File, url: string): Observable<any> {
    return this._http.put(url, payload);
  }

  deleteLivery(liveryId: string): Observable<any> {
    return this._http.delete<any>(`${this._baseUrl}/liveries/${liveryId}`);
  }
}

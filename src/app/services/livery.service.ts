import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Livery} from '../models/livery';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LiveryService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) { }
  getLiveriesBySeriesId(seriesId: string): Observable<Livery[]> {
    return this._http.get<Livery[]>(`${this._baseUrl}/series/${seriesId}/liveries`);
  }

  getAdminLiveriesBySeriesId(seriesId: string): Observable<Livery[]> {
    return this._http.get<Livery[]>(`${this._baseUrl}/series/${seriesId}/liveries?showAll=true`);
  }

  finalizeUpload(liveryId: string): Observable<Livery> {
    return this._http.post<Livery>(`${this._baseUrl}/liveries/${liveryId}/finalize`, null);
  }

  getPresignedUrl(seriesId: string, livery: Livery, carId: string): Observable<Livery> {
    if (livery.liveryType === 'Car') {
      return this._http.post<Livery>(`${this._baseUrl}/series/${seriesId}/liveries`,
        {iTeamId: livery.iTeamId, carId: carId, liveryType: livery.liveryType, isCustomNumber: livery.isCustomNumber});
    } else {
      return this._http.post<Livery>(`${this._baseUrl}/series/${seriesId}/liveries`,
        {iTeamId: livery.iTeamId, carId: carId, liveryType: livery.liveryType});
    }
  }

  upload(payload: File, url: string): Observable<any> {
    return this._http.put(url, payload);
  }

  deleteLivery(liveryId: string): Observable<any> {
    return this._http.delete<any>(`${this._baseUrl}/liveries/${liveryId}`);
  }
}

import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Series} from '../models/series';
import {User} from '../models/user';
import {RejectionNotice} from '../models/rejectionNotice';
import {Livery} from '../models/livery';

@Injectable({
  providedIn: 'root'
})
export class RejectionsService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {
  }

  getAlerts(): Observable<RejectionNotice[]> {
    return this._http.get<RejectionNotice[]>(`${this._baseUrl}/rejections/me`);
  }

  rejectLivery(livery: Livery): Observable<RejectionNotice> {
    return this._http.post<RejectionNotice>(`${this._baseUrl}/liveries/${livery.id}/rejections`,
      {liveryId: livery.id, message: ''});
  }

  updateStatus(livery: Livery, status: string) {
    return this._http.put<RejectionNotice>(`${this._baseUrl}/liveries/${livery.id}/rejections`,
      {liveryId: livery.id, message: '', status: status});
  }
}

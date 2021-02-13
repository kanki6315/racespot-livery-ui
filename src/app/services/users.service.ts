import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Series} from '../models/series';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {
  }

  getUnverifiedUsers(): Observable<User[]> {
    return this._http.get<User[]>(`${this._baseUrl}/users/unverifiedUsers`);
  }

  resetAccount(userId: string): Observable<any> {
    return this._http.post<any>(`${this._baseUrl}/users/${userId}/reset`, {});
  }
}

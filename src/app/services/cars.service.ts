import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Series} from '../models/series';
import {HttpClient} from '@angular/common/http';
import {Car} from '../models/car';

@Injectable({
  providedIn: 'root'
})
export class CarsService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) { }

  getAllCars(): Observable<Car[]> {
    return this._http.get<Car[]>(`${this._baseUrl}/cars`);
  }

  postCar(car: Car): Observable<Car> {
    return this._http.post<Car>(`${this._baseUrl}/cars`, car);
  }

  putSeries(car: Car): Observable<Car> {
    return this._http.put<Car>(`${this._baseUrl}/cars/${car.id}`, car);
  }
}

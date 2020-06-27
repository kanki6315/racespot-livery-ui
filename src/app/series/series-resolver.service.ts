import { Injectable } from '@angular/core';
import {Series} from '../models/series';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {SeriesService} from '../services/series.service';
import {EMPTY, Observable, of} from 'rxjs';
import {mergeMap, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeriesResolverService implements Resolve<Series> {

  constructor(private _seriesService: SeriesService,
              private _router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Series> | Observable<never> {
    const id = route.paramMap.get('id');

    if (!id) {
      this._router.navigate(['/']);
      return EMPTY;
    }

    return this._seriesService.getById(id).pipe(
      take(1),
      mergeMap(series => {
        if (series) {
          return of(series);
        } else { // id not found
          this._router.navigate(['/']);
          return EMPTY;
        }
      })
    );
  }
}

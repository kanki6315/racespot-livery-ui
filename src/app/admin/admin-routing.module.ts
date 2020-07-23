import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './admin.component';
import {AdminSeriesComponent} from './admin-series/admin-series.component';
import {AdminLiveriesComponent} from './admin-liveries/admin-liveries.component';
import {AdminSeriesCreateModalComponent} from './admin-series-create-modal/admin-series-create-modal.component';
import {SeriesModalComponent} from '../series/series-modal/series-modal.component';
import {SeriesResolverService} from '../series/series-resolver.service';
import {AdminSeriesUpdateModalComponent} from './admin-series-update-modal/admin-series-update-modal.component';

const appRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'series',
        component: AdminSeriesComponent,
        children: [
          {
            path: 'create',
            component: AdminSeriesCreateModalComponent
          },
          {
            path: ':id',
            component: AdminSeriesUpdateModalComponent,
            resolve: {
              series: SeriesResolverService
            }
          }
        ]
      },
      {
        path: 'liveries',
        component: AdminLiveriesComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }

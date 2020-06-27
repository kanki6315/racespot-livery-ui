import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SeriesComponent} from './series.component';
import {SeriesListComponent} from './series-list/series-list.component';
import {SeriesModalComponent} from './series-modal/series-modal.component';
import {SeriesResolverService} from './series-resolver.service';



const appRoutes: Routes = [
  {
    path: '',
    component: SeriesComponent,
    children: [
      {
        path: '',
        component: SeriesListComponent,
        children: [
          {
            path: ':id',
            component: SeriesModalComponent,
            resolve: {
              series: SeriesResolverService
            }
          }
        ]
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
export class SeriesRoutingModule { }

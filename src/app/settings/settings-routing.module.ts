import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingsComponent} from './settings.component';

const appRoutes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
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
export class SettingsRoutingModule { }

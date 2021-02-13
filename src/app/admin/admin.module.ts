import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import {ReactiveFormsModule} from '@angular/forms';
import {
  NgbAccordionModule,
  NgbAlertModule,
  NgbDropdownModule,
  NgbNavModule,
  NgbProgressbarModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationPopoverModule} from 'angular-confirmation-popover';
import {AdminRoutingModule} from './admin-routing.module';
import { AdminSeriesComponent } from './admin-series/admin-series.component';
import { AdminLiveriesComponent } from './admin-liveries/admin-liveries.component';
import { AdminSeriesCreateModalComponent } from './admin-series-create-modal/admin-series-create-modal.component';
import { AdminSeriesUpdateModalComponent } from './admin-series-update-modal/admin-series-update-modal.component';
import {SeriesModule} from '../series/series.module';
import { AdminUsersComponent } from './admin-users/admin-users.component';

@NgModule({
  declarations: [AdminComponent, AdminSeriesComponent, AdminLiveriesComponent, AdminSeriesCreateModalComponent, AdminSeriesUpdateModalComponent, AdminUsersComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgbAlertModule,
    ConfirmationPopoverModule,
    NgbProgressbarModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbDropdownModule,
    SeriesModule

  ]
})
export class AdminModule { }

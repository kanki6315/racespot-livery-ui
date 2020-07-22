import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbAccordionModule, NgbAlertModule, NgbNavModule, NgbProgressbarModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationPopoverModule} from 'angular-confirmation-popover';
import {AdminRoutingModule} from './admin-routing.module';
import { AdminSeriesComponent } from './admin-series/admin-series.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminSeriesCreateModalComponent } from './admin-series-create-modal/admin-series-create-modal.component';
import { AdminSeriesUpdateModalComponent } from './admin-series-update-modal/admin-series-update-modal.component';

@NgModule({
  declarations: [AdminComponent, AdminSeriesComponent, AdminUsersComponent, AdminSeriesCreateModalComponent, AdminSeriesUpdateModalComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgbAlertModule,
    ConfirmationPopoverModule,
    NgbProgressbarModule,
    NgbNavModule,
    NgbTooltipModule

  ]
})
export class AdminModule { }

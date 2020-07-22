import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbAccordionModule, NgbAlertModule, NgbNavModule, NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationPopoverModule} from 'angular-confirmation-popover';
import {AdminRoutingModule} from './admin-routing.module';
import { AdminSeriesComponent } from './admin-series/admin-series.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';

@NgModule({
  declarations: [AdminComponent, AdminSeriesComponent, AdminUsersComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgbAlertModule,
    ConfirmationPopoverModule,
    NgbProgressbarModule,
    NgbNavModule

  ]
})
export class AdminModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SeriesRoutingModule} from './series-routing.module';
import { SeriesListComponent } from './series-list/series-list.component';
import { SeriesCardComponent } from './series-card/series-card.component';
import { SeriesModalComponent } from './series-modal/series-modal.component';
import {ReactiveFormsModule} from '@angular/forms';
import { SeriesLiverySubmissionComponent } from './series-livery-submission/series-livery-submission.component';
import {NgbAccordionModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationPopoverModule} from 'angular-confirmation-popover';



@NgModule({
  declarations: [SeriesListComponent, SeriesCardComponent, SeriesModalComponent, SeriesLiverySubmissionComponent],
    imports: [
        CommonModule,
        SeriesRoutingModule,
        ReactiveFormsModule,
        NgbAccordionModule,
        NgbAlertModule,
        ConfirmationPopoverModule
    ]
})
export class SeriesModule { }

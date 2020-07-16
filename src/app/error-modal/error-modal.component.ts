import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent {
  @Input() errorMessage: string;
  @Input() title: string;
  constructor(public activeModal: NgbActiveModal) {
    this.title = 'Error';
  }
}

import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {FormBuilder} from '@angular/forms';
import {ErrorModalComponent} from '../error-modal/error-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  isEditing = false;
  public isEmailEnabled = this.authenticationService.isEmailEnabled();
  formGroup = this._formBuilder.group({
    displayName: [''],
    iRacingId: [''],
    emailAddress: ['']
  });

  constructor(private authenticationService: AuthenticationService,
              private _formBuilder: FormBuilder,
              private _modalService: NgbModal) { }

  ngOnInit(): void {
    this.authenticationService.displayName().subscribe((dName) => {
      this.formGroup.patchValue({displayName: dName});
    });

    this.authenticationService.getEmailAddress().subscribe((isEmails) => {
      this.formGroup.patchValue({emailAddress: isEmails});
    });

    this.authenticationService.getIracingId().subscribe((iracingId) => {
      this.formGroup.patchValue({iRacingId: iracingId});
    });
  }

  updateEmailStatus(isEmailEnabled: boolean) {
    if (this.isEditing) {
      return;
    }
    this.isEditing = true;

    this.authenticationService.selfUserUpdate(isEmailEnabled).subscribe((user) => {
      this.isEditing = false;
      this.authenticationService.setIsAgreedToEmails(isEmailEnabled);
    }, error => {
      const errorComponentInstance = this._modalService.open(ErrorModalComponent).componentInstance as ErrorModalComponent;
      errorComponentInstance.errorMessage = error.error;
      this.isEditing = false;
    });
  }
}

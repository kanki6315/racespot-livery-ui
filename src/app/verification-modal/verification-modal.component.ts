import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractControl, FormBuilder} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {LiveryService} from '../services/livery.service';
import {AuthenticationService} from '../services/authentication.service';
import {ErrorModalComponent} from '../error-modal/error-modal.component';

@Component({
  selector: 'app-verification-modal',
  templateUrl: './verification-modal.component.html',
  styleUrls: ['./verification-modal.component.scss']
})
export class VerificationModalComponent implements OnInit, AfterViewInit {
  private _modal: NgbModalRef;
  isUploading = false;
  uploadForm = this._formBuilder.group({
    iracingId: [''],
  });
  @ViewChild('content', { static: false }) content: ElementRef;
  constructor(private _route: ActivatedRoute,
              private _formBuilder: FormBuilder,
              private _modalService: NgbModal,
              private _router: Router,
              private _authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

  submit() {
    this.isUploading = true;
    const iRacingId = this.iracingId.value;
    this._authenticationService.sendVerificationMessage(iRacingId).subscribe((response) => {
      this._authenticationService.setLastInviteDate();
      this.isUploading = false;
      this.backToSeriesList();
    }, (error => {
      this.isUploading = false;
      const errorComponentInstance = this._modalService.open(ErrorModalComponent).componentInstance as ErrorModalComponent;
      errorComponentInstance.errorMessage = error.error;
      // Account probably owned by another user
    }));
  }

  get iracingId(): AbstractControl {
    const iracingId = this.uploadForm.get('iracingId');
    if (iracingId === null) {
      throw new Error('The iracingId control does not exist');
    }
    return iracingId;
  }

  ngAfterViewInit(): void {
    this._modal = this._modalService.open(this.content, { size: 'lg' });
    this._modal.result
      .then(() => {
          this.backToSeriesList();
        },
        () => {
          this.backToSeriesList();
        });
  }

  backToSeriesList(): void {
    this._modal.close();
    this._router.navigate(['/']);
  }
}

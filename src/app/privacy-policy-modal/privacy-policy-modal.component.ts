import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';

@Component({
  selector: 'app-privacy-policy-modal',
  templateUrl: './privacy-policy-modal.component.html',
  styleUrls: ['./privacy-policy-modal.component.scss']
})
export class PrivacyPolicyModalComponent implements OnInit, AfterViewInit {

  private _modal: NgbModalRef;
  @ViewChild('content', { static: false }) content: ElementRef;
  constructor(
              private _modalService: NgbModal,
              private _router: Router) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this._modal = this._modalService.open(this.content, { size: 'lg' });
    this._modal.result
      .then(() => {
          this.backToMainPage();
        },
        () => {
          this.backToMainPage();
        });
  }

  backToMainPage(): void {
    this._modal.close();
    this._router.navigate(['/']);
  }
}

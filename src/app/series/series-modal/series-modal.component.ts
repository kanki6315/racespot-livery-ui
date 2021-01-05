import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {SeriesService} from '../../services/series.service';
import {Series} from '../../models/series';
import {AuthenticationService} from '../../services/authentication.service';
import {Livery} from '../../models/livery';
import {LiveryService} from '../../services/livery.service';
import {Team} from '../../models/team';
import {finalize} from 'rxjs/operators';
import {ErrorModalComponent} from '../../error-modal/error-modal.component';

@Component({
  selector: 'app-series-modal',
  templateUrl: './series-modal.component.html',
  styleUrls: ['./series-modal.component.scss']
})
export class SeriesModalComponent implements OnInit, AfterViewInit {
  id: string;
  series: Series;
  private _modal: NgbModalRef;
  teamLiveryMap: Map<string, Livery[]> = new Map<string, Livery[]>();
  liveries: Livery[];
  teams: Team[] = [];
  carNames = '';
  helmet: Livery = null;
  isLoadingLiveries = true;
  isUploadingHelmet = false;
  isHoverHelmet = false;

  @ViewChild('content', { static: false }) content: ElementRef;
  uploadProgress = 0;
  constructor(
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _router: Router,
    private _liveryService: LiveryService,
    private _authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this._route.data.subscribe((data: { series: Series }) => {
      this.series = data.series;
      this.carNames = this.series.cars.map(t => t.name).join(', ');
      this._authenticationService.isVerified().subscribe((isVerified) => {
        if (isVerified) {
          this._liveryService.getLiveriesBySeriesId(this.series.id)
            .pipe(finalize(() => this.isLoadingLiveries = false))
            .subscribe((liveries) => {
            if (this.series.isTeam) {
              liveries.forEach(t => {
                if (t.liveryType === 'Helmet' && (!t.iTeamId || t.iTeamId.length === 0)) {
                  this.helmet = t;
                  return;
                }
                if (this.teamLiveryMap.has(t.iTeamId)) {
                  // @ts-ignore
                  if (t.liveryType === 'Car') {
                    this.teams.filter(team => team.iRacingId === t.iTeamId)[0].carName = t.carName;
                  }
                  this.teamLiveryMap.get(t.iTeamId).push(t);
                } else {
                  this.teamLiveryMap.set(t.iTeamId, [t]);
                  this.teams.push({name: t.iTeamName, iRacingId: t.iTeamId, carName: t.carName});
                }
              });
              this.liveries = liveries;
            } else {
              this.liveries = liveries;
            }
          });
        }
      });
    });

    this._route.paramMap.subscribe((paramMap) => {
      this.id = paramMap.get('id') || '';
    });
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

  addTeam(): void {
    if (!this.isAddingNewTeam()) {
      this.teams.push({name: 'New Team', iRacingId: '', carName: ''});
    }
  }

  isAddingNewTeam(): boolean {
    if (this.teams.length === 0) {
      return false;
    }
    return this.teams.filter(t => t.name === 'New Team' && !t.iRacingId).length !== 0;
  }

  addHelmet(event: any) {
    if (event.target.files.length === 0) {
      console.log('No file selected!');
      return;
    }
    const file: File = event.target.files[0];
    this.uploadProgress = 10;
    this.isUploadingHelmet = true;
    const livery = {liveryType: 'Helmet', file: file, previewUrl: null,
      iTeamId: '', iTeamName: '', carName: '', id: null, uploadUrl: '', userId: '', firstName: '', lastName: '', isCustomNumber: false};

    this._liveryService.getPresignedUrl(this.series.id, livery, '').subscribe((returnLivery) => {
      this.uploadProgress = 40;
      this._liveryService.upload(livery.file, returnLivery.uploadUrl).subscribe((response) => {
        this.uploadProgress = 80;
        this._liveryService.finalizeUpload(returnLivery.id).subscribe((finalLivery) => {
          this.uploadProgress = 100;
          const previousLiveryIndex = this.liveries.findIndex(l => l.id === finalLivery.id);
          if (previousLiveryIndex !== -1) {
            this.liveries[previousLiveryIndex] = finalLivery;
          } else {
            this.liveries.push(finalLivery);
          }
          this.helmet = finalLivery;
          this.isUploadingHelmet = false;
          // this._success.next(`${finalLivery.liveryType} uploaded successfully!`);
        }, error => {
          const errorComponentInstance = this._modalService.open(ErrorModalComponent).componentInstance as ErrorModalComponent;
          errorComponentInstance.errorMessage = error.error;
          this.isUploadingHelmet = false;
          // likely an error converting tga to png, invalid file
        });
      }, (error => {
        const errorComponentInstance = this._modalService.open(ErrorModalComponent).componentInstance as ErrorModalComponent;
        errorComponentInstance.errorMessage = error.error;
        this.isUploadingHelmet = false;
        // likely error uploading to S3, should NEVER occur
      }));
    }, (error => {
      const errorComponentInstance = this._modalService.open(ErrorModalComponent).componentInstance as ErrorModalComponent;
      errorComponentInstance.errorMessage = error.error;
      this.isUploadingHelmet = false;
      // likely validation error before pre-signed url generated
    }));
  }

  deleteHelmet() {
    if (this.isUploadingHelmet) {
      return;
    }

    this.uploadProgress = 50;
    this.isUploadingHelmet = true;
    this._liveryService.deleteLivery(this.helmet.id).subscribe((response) => {
      this.uploadProgress = 100;
      const index = this.liveries.indexOf(this.helmet, 0);
      if (index > -1) {
        this.liveries.splice(index, 1);
      }
      this.helmet = null;
      this.isUploadingHelmet = false;
    }, (error) => {
      const errorComponentInstance = this._modalService.open(ErrorModalComponent).componentInstance as ErrorModalComponent;
      errorComponentInstance.errorMessage = error.error;
      this.isUploadingHelmet = false;
    });
  }

  getHelmetPreview() {
    return this.helmet.previewUrl;
  }
}

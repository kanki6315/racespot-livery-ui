import {Component, Input, OnInit} from '@angular/core';
import {Livery} from '../../models/livery';
import {AbstractControl, FormBuilder} from '@angular/forms';
import {LiveryService} from '../../services/livery.service';
import {Series} from '../../models/series';
import {AuthenticationService} from '../../services/authentication.service';
import {ErrorModalComponent} from '../../error-modal/error-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Team} from '../../models/team';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-series-livery-submission',
  templateUrl: './series-livery-submission.component.html',
  styleUrls: ['./series-livery-submission.component.scss']
})
export class SeriesLiverySubmissionComponent implements OnInit {
  @Input() series: Series;
  @Input() liveries: Livery[];
  @Input() team: Team;
  @Input() teams: Team[];
  @Input() isEditable: boolean;

  private _success = new Subject<string>();
  successMessage = '';
  isNewTeam = true;
  priorCar = '';
  isUploading = false;
  isUploadingSpec = false;
  isDeleting = false;
  liveryTypes = ['Car', 'Helmet', 'Suit'];
  carNames = [];
  uploadForm = this._formBuilder.group({
    liveryType: ['Car'],
    carName: [''],
    iracingId: [''],
    liveryFile: ['']
  });
  private _file: File | null = null;
  private _liveryToUpload: Livery | null = null;
  uploadProgress = 0;

  constructor(private _liveryService: LiveryService,
              private _formBuilder: FormBuilder,
              private _authenticationService: AuthenticationService,
              private _modalService: NgbModal) { }

  ngOnInit() {
    if (this.liveries && this.liveries.length > 0) {
      this.isNewTeam = false;
      const livery = this.liveries.filter(l => l.liveryType === 'Car');
      if (livery.length !== 0) {
        this.uploadForm.patchValue({carName: livery[0].carName});
        this.priorCar = livery[0].carName;
      }
      this.uploadForm.patchValue({iracingId: this.liveries[0].iTeamId});
      this.uploadForm.get('iracingId').disable();
    }

    if (this.series.cars) {
      this.carNames = this.series.cars.map(c => c.name);
      if (this.carNames.length === 1) {
        this.uploadForm.patchValue({carName: this.carNames[0]});
        this.uploadForm.get('carName').disable();
      }
    }
    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(
      debounceTime(7000)
    ).subscribe(() => this.successMessage = '');

    if (!this.isEditable) {
      this.uploadForm.get('carName').disable();
    }
  }

  get liveryType(): AbstractControl {
    const liveryType = this.uploadForm.get('liveryType');
    if (liveryType === null) {
      throw new Error('The livery type control does not exist');
    }

    return liveryType;
  }

  get iracingId(): AbstractControl {
    const iracingId = this.uploadForm.get('iracingId');
    if (iracingId === null) {
      throw new Error('The iracingId control does not exist');
    }

    return iracingId;
  }

  get carName(): AbstractControl {
    const carName = this.uploadForm.get('carName');
    if (carName === null) {
      throw new Error('The carName control does not exist');
    }

    return carName;
  }

  getLiveryFileName(): string | null {
    if (this._file !== null) {
      return this._file.name;
    }

    return null;
  }

  getLiveryPreview(): string | null {
    const livery = this.liveries.filter(l => l.liveryType === this.liveryType.value);
    if (livery.length > 0) {
      return livery[0].previewUrl;
    }

    return null;
  }

  uploadLivery() {
    if (this.isUploadingSpec || this.isDeleting || this._file === null) {
      return;
    }
    if (this.isNewTeam) {
      const iTeamId = this.iracingId.value;
      if (iTeamId && iTeamId.length > 0) {
        const previousTeam = this.teams.findIndex(l => l.iRacingId === iTeamId);
        if (previousTeam !== -1) {
          const errorComponentInstance = this._modalService.open(ErrorModalComponent).componentInstance as ErrorModalComponent;
          errorComponentInstance.errorMessage = 'You have already uploaded a paint for this team, please update the existing upload!';
          const teamIndex = this.teams.filter(l => l === this.team);
          if (teamIndex.length > 0) {
            const index = this.teams.indexOf(teamIndex[0], 0);
            if (index > -1) {
              this.teams.splice(index, 1);
            }
          }
          return;
        }
      }
    }
    this._liveryToUpload = {liveryType: this.liveryType.value, file: this._file, previewUrl: null,
      iTeamId: this.iracingId.value, iTeamName: '', carName: this.carName.value, id: null, uploadUrl: '',
      userId: '', firstName: '', lastName: ''};
    const carId = this.isCarSelected() ? this.series.cars.filter(c => c.name === this._liveryToUpload.carName)[0].id : '';

    this.uploadProgress = 10;
    this.isUploading = true;

    this._liveryService.getPresignedUrl(this.series.id, this._liveryToUpload, carId).subscribe((returnLivery) => {
      this.uploadProgress = 40;
      this._liveryService.upload(this._liveryToUpload.file, returnLivery.uploadUrl).subscribe((response) => {
        this.uploadProgress = 80;
        this._liveryService.finalizeUpload(returnLivery.id).subscribe((finalLivery) => {
          this.uploadProgress = 100;
          const previousLiveryIndex = this.liveries.findIndex(l => l.id === finalLivery.id);
          if (previousLiveryIndex !== -1) {
            this.liveries[previousLiveryIndex] = finalLivery;
          } else {
            this.liveries.push(finalLivery);
          }
          if (this.team && this.team.name === 'New Team' && !this.team.iRacingId) {
            this.team.name = finalLivery.iTeamName;
            this.team.iRacingId =  finalLivery.iTeamId;
            this.team.carName =  finalLivery.carName;
            this.isNewTeam = false;
            this.uploadForm.get('iracingId').disable();
          }
          if (this.liveryType.value === 'Car') {
            if (this.priorCar !== finalLivery.carName) {
              this.priorCar = finalLivery.carName;
              if (this.team) {
                this.team.carName = finalLivery.carName;
              }

              const specMap = this.liveries.filter(l => l.liveryType === 'Spec Map');
              if (specMap.length > 0) {
                const index = this.liveries.indexOf(specMap[0], 0);
                if (index > -1) {
                  this.liveries.splice(index, 1);
                }
              }
            }
          }
          this._liveryToUpload = null;
          this._file = null;
          this._success.next(`${finalLivery.liveryType} uploaded successfully!`);
          this.isUploading = false;
        }, error => {
          const errorComponentInstance = this._modalService.open(ErrorModalComponent).componentInstance as ErrorModalComponent;
          errorComponentInstance.errorMessage = error.error;
          this.isUploading = false;
          // likely an error converting tga to png, invalid file
        });
      }, (error => {
        const errorComponentInstance = this._modalService.open(ErrorModalComponent).componentInstance as ErrorModalComponent;
        errorComponentInstance.errorMessage = error.error;
        this.isUploading = false;
        // likely error uploading to S3, should NEVER occur
      }));
    }, (error => {
        const errorComponentInstance = this._modalService.open(ErrorModalComponent).componentInstance as ErrorModalComponent;
        errorComponentInstance.errorMessage = error.error;
        this.isUploading = false;
      // likely validation error before pre-signed url generated
    }));
  }

  onFileAdded(event: any) {
    this._file = event.target.files[0];
  }

  hasLiveryPreview(): boolean {
    if (this.liveryType.value === 'Spec Map') {
      return false;
    }
    const livery = this.liveries.filter(l => l.liveryType === this.liveryType.value);
    return livery.length > 0 && livery[0].previewUrl !== null;
  }

  hasSpecMap(): boolean {
    const livery = this.liveries.filter(l => l.liveryType === 'Spec Map');
    return livery.length > 0;
  }

  hasCar(): boolean {
    const livery = this.liveries.filter(l => l.liveryType === 'Car');
    return livery.length > 0;
  }

  isCarSelected() {
    return this.liveryType.value === 'Car';
  }

  addSpecMap(event: any) {
    if (event.target.files.length === 0) {
      console.log('No file selected!');
      return;
    }
    const file: File = event.target.files[0];
    this.uploadProgress = 10;
    this.isUploadingSpec = true;
    const carLivery = this.liveries.filter(l => l.liveryType === 'Car')[0];
    this._liveryToUpload = {liveryType: 'Spec Map', file: file, previewUrl: null,
      iTeamId: carLivery.iTeamId, iTeamName: '', carName: carLivery.carName, id: null, uploadUrl: '', userId: '', firstName: '', lastName: ''};
    const carId = this.series.cars.filter(c => c.name === carLivery.carName)[0].id;

    this._liveryService.getPresignedUrl(this.series.id, this._liveryToUpload, carId).subscribe((returnLivery) => {
      this.uploadProgress = 40;
      this._liveryService.upload(this._liveryToUpload.file, returnLivery.uploadUrl).subscribe((response) => {
        this.uploadProgress = 80;
        this._liveryService.finalizeUpload(returnLivery.id).subscribe((finalLivery) => {
          this.uploadProgress = 100;
          const previousLiveryIndex = this.liveries.findIndex(l => l.id === finalLivery.id);
          if (previousLiveryIndex !== -1) {
            this.liveries[previousLiveryIndex] = finalLivery;
          } else {
            this.liveries.push(finalLivery);
          }
          this.isUploadingSpec = false;
          this._success.next(`${finalLivery.liveryType} uploaded successfully!`);
        }, error => {
          const errorComponentInstance = this._modalService.open(ErrorModalComponent).componentInstance as ErrorModalComponent;
          errorComponentInstance.errorMessage = error.error;
          this.isUploadingSpec = false;
          // likely an error converting tga to png, invalid file
        });
      }, (error => {
        const errorComponentInstance = this._modalService.open(ErrorModalComponent).componentInstance as ErrorModalComponent;
        errorComponentInstance.errorMessage = error.error;
        this.isUploadingSpec = false;
        // likely error uploading to S3, should NEVER occur
      }));
    }, (error => {
      const errorComponentInstance = this._modalService.open(ErrorModalComponent).componentInstance as ErrorModalComponent;
      errorComponentInstance.errorMessage = error.error;
      this.isUploadingSpec = false;
      // likely validation error before pre-signed url generated
    }));
  }

  deleteLivery() {
    if (this.isUploading || this.isUploadingSpec) {
      return;
    }
    const liveryType = this.liveryType.value;
    const liveriesByType = this.liveries.filter(l => l.liveryType === liveryType);
    if (liveriesByType.length !== 1) {
      return;
    }
    const livery = liveriesByType[0];
    this.uploadProgress = 50;
    this.isDeleting = true;
    this._liveryService.deleteLivery(livery.id).subscribe((response) => {
      this.uploadProgress = 100;
        if (livery.liveryType === 'Car') {
          const specMap = this.liveries.filter(l => l.liveryType === 'Spec Map');
          if (specMap.length > 0) {
            const specIndex = this.liveries.indexOf(specMap[0], 0);
            if (specIndex > -1) {
              this.liveries.splice(specIndex, 1);
            }
          }
        }
        const index = this.liveries.indexOf(livery, 0);
        if (index > -1) {
          this.liveries.splice(index, 1);
        }
        this.isDeleting = false;
    }, (error) => {
      const errorComponentInstance = this._modalService.open(ErrorModalComponent).componentInstance as ErrorModalComponent;
      errorComponentInstance.errorMessage = error.error;
      this.isDeleting = false;
    });
  }

  getDeletionMessage() {
    const liveryType = this.liveryType.value;
    const liveriesByType = this.liveries.filter(l => l.liveryType === 'Spec Map');
    if (liveryType === 'Car' && liveriesByType.length === 1) {
      return 'Your spec map will also be deleted. Your iRacing default paint will be shown instead.';
    }
    return `If deleted, your iRacing default paint will be shown instead.`;
  }

  getDeletionTitle() {
    const liveryType = this.liveryType.value;
    return `Delete your ${liveryType}?`;
  }

  getDeletionButton() {
    const liveryType = this.liveryType.value;
    return `Delete ${liveryType}`;
  }
}

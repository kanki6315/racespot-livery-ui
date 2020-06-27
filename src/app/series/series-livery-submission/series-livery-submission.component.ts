import {Component, Input, OnInit} from '@angular/core';
import {Livery} from '../../models/livery';
import {AbstractControl, FormBuilder} from '@angular/forms';
import {LiveryService} from '../../services/livery.service';
import {Series} from '../../models/series';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-series-livery-submission',
  templateUrl: './series-livery-submission.component.html',
  styleUrls: ['./series-livery-submission.component.scss']
})
export class SeriesLiverySubmissionComponent implements OnInit {
  @Input() series: Series;
  @Input() liveries: Livery[];

  isNewTeam = true;
  isUploading = false;
  liveryTypes = ['Car', 'Helmet', 'Suit', 'Spec Map'];
  carNames = [];
  uploadForm = this._formBuilder.group({
    liveryType: ['Car'],
    carName: [''],
    iracingId: [''],
    liveryFile: ['']
  });
  private _file: File | null = null;
  private _liveryToUpload: Livery | null = null;

  constructor(private _liveryService: LiveryService,
              private _formBuilder: FormBuilder,
              private _authenticationService: AuthenticationService) { }

  ngOnInit() {
    if (this.liveries && this.liveries.length > 0) {
      this.isNewTeam = false;
      this.uploadForm.patchValue({carName: this.liveries.filter(f => f.liveryType === 'Car')[0].carName});
      this.uploadForm.patchValue({iracingId: this.liveries.filter(f => f.liveryType === 'Car')[0].iTeamId});
      this.uploadForm.get('iracingId').disable();
    }

    this.carNames = this.series.cars.map(c => c.name);
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
    if (this._file === null) {
      return;
    }
    this._liveryToUpload = {liveryType: this.liveryType.value, file: this._file, previewUrl: null,
      iTeamId: this.iracingId.value, iTeamName: '', carName: this.carName.value, id: null, uploadUrl: ''};
    const carId = this.series.cars.filter(c => c.name === this._liveryToUpload.carName)[0].id;
    this.isUploading = true;

    this._liveryService.getPresignedUrl(this.series.id, this._liveryToUpload, carId).subscribe((returnLivery) => {
      this._liveryService.upload(this._liveryToUpload.file, returnLivery.uploadUrl).subscribe((response) => {
        this._liveryService.finalizeUpload(returnLivery.id).subscribe((finalLivery) => {
          const previousLiveryIndex = this.liveries.findIndex(l => l.id === finalLivery.id);
          if (previousLiveryIndex !== -1) {
            this.liveries[previousLiveryIndex] = finalLivery;
          } else {
            this.liveries.push(finalLivery);
          }
          this._liveryToUpload = null;
          this._file = null;
          this.isUploading = false;
        }, error => {
          console.log(error.error); // probably an error converting tga to png, invalid file
        });
      }, (error => {
        console.log(error.error); // error uploading to S3, should NEVER occur
      }));
    }, (error => {
        console.log(error.error); // validation error before pre-signed url generated
    }));
  }

  onFileAdded(event: any) {
    this._file = event.target.files[0];
  }

  hasLiveryPreview(): boolean {
    const livery = this.liveries.filter(l => l.liveryType === this.liveryType.value);
    return livery.length > 0 && livery[0].previewUrl !== null;
  }
}

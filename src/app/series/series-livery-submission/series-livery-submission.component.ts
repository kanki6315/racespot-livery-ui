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

  isUploading = false;
  liveryTypes = ['Car', 'Helmet', 'Suit', 'Spec Map'];
  uploadForm = this._formBuilder.group({
    liveryType: ['Car'],
    liveryFile: ['']
  });
  private _liveryToUpload: Livery | null = null;

  constructor(private _liveryService: LiveryService,
              private _formBuilder: FormBuilder,
              private _authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  get liveryType(): AbstractControl {
    const liveryType = this.uploadForm.get('liveryType');
    if (liveryType === null) {
      throw new Error('The livery type control does not exist');
    }

    return liveryType;
  }

  getLiveryFileName(): string | null {
    if (this._liveryToUpload !== null) {
      return this._liveryToUpload.file.name;
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
    if (this._liveryToUpload === null) {
      return;
    }

    const payload = new FormData();

    payload.append('type', this._liveryToUpload.liveryType.replace(' ', ''));
    payload.append('file', this._liveryToUpload.file);
    payload.append('iTeamId', '');

    this.isUploading = true;
    this._liveryService.upload(payload, this.series.id, '')
      .subscribe((response: Livery) => {
        if (this._liveryToUpload) {
          this._liveryToUpload.previewUrl = response.previewUrl;
          this.isUploading = false;
          const liveryType = this._liveryToUpload.liveryType;
          const previousLiveryIndex = this.liveries.findIndex(l => l.liveryType === liveryType);
          if (previousLiveryIndex !== -1) {
            this.liveries[previousLiveryIndex] = this._liveryToUpload;
          } else {
            this.liveries.push(this._liveryToUpload);
          }
          this._liveryToUpload = null;
        }
      });
  }

  onFileAdded(event: any) {
    const livery = { liveryType: this.liveryType.value, file: event.target.files[0], previewUrl: null,
        iTeamId: '', iTeamName: '', carName: '', id: ''};
    this._liveryToUpload = livery;
  }

  hasLiveryPreview(): boolean {
    const livery = this.liveries.filter(l => l.liveryType === this.liveryType.value);
    return livery.length > 0 && livery[0].previewUrl !== null;
  }
}

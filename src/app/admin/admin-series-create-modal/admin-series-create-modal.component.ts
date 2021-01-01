import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {ErrorModalComponent} from '../../error-modal/error-modal.component';
import {SeriesService} from '../../services/series.service';
import {Series} from '../../models/series';
import {Observable} from 'rxjs';
import {Car} from '../../models/car';
import {CarsService} from '../../services/cars.service';

@Component({
  selector: 'app-admin-series-crud-modal',
  templateUrl: './admin-series-create-modal.component.html',
  styleUrls: ['./admin-series-create-modal.component.scss']
})
export class AdminSeriesCreateModalComponent implements OnInit, AfterViewInit {

  private _modal: NgbModalRef;
  isSubmitting = false;
  @ViewChild('content', { static: false }) content: ElementRef;
  seriesForm = this._formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    logoUrl: ['', Validators.required],
    isTeam: [false, Validators.required],
    isArchived: [false, Validators.required],
    cars: [[], Validators.required],
    isLeague: [false, Validators.required]
  });
  carList: Observable<Car[]>;
  constructor(private _modalService: NgbModal,
              private _router: Router,
              private _route: ActivatedRoute,
              private _formBuilder: FormBuilder,
              private _seriesService: SeriesService,
              private _carService: CarsService) { }

  ngOnInit(): void {
    this.carList = this._carService.getAllCars();
  }

  ngAfterViewInit(): void {
    this._modal = this._modalService.open(this.content, { size: 'lg' });
    this._modal.result
      .then(() => {
          this.backToAdminPage();
        },
        () => {
          this.backToAdminPage();
        });
  }

  backToAdminPage(): void {
    this._modal.close();
    this._router.navigate(['../'], { relativeTo: this._route });
  }

  createSeries() {
    this.seriesForm.markAllAsTouched();

    if (this.seriesForm.invalid) {
      this.isSubmitting = false;
      return;
    }

    this.isSubmitting = true;
    const { name, description, logoUrl, isTeam, isArchived, cars, isLeague} = this.seriesForm.value;
    const series = new Series();
    series.name = name;
    series.description = description;
    series.logoImgUrl = logoUrl;
    series.isTeam = isTeam;
    series.isArchived = isArchived;
    series.carIds = cars;
    series.isLeague = isLeague;
    this._seriesService.postSeries(series).subscribe(
      () => {
        this.isSubmitting = false;
        this.backToAdminPage();
      },
      _ => {
        this.isSubmitting = false;
        const errorComponentInstance = this._modalService.open(ErrorModalComponent).componentInstance as ErrorModalComponent;
        errorComponentInstance.errorMessage = _.error;
      });
  }
}

import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {Car} from '../../models/car';
import {ActivatedRoute, Router} from '@angular/router';
import {SeriesService} from '../../services/series.service';
import {CarsService} from '../../services/cars.service';
import {Series} from '../../models/series';
import {ErrorModalComponent} from '../../error-modal/error-modal.component';

@Component({
  selector: 'app-admin-series-update-modal',
  templateUrl: './admin-series-update-modal.component.html',
  styleUrls: ['./admin-series-update-modal.component.scss']
})
export class AdminSeriesUpdateModalComponent implements OnInit, AfterViewInit {

  private _modal: NgbModalRef;
  isSubmitting = false;
  @ViewChild('content', { static: false }) content: ElementRef;
  seriesForm = this._formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    logoUrl: ['', Validators.required],
    isTeam: [false, Validators.required],
    isArchived: [false, Validators.required],
    newCar: [''],
    isLeague: [false, Validators.required]
  });
  carList: Car[] = [];
  series: Series;
  constructor(private _modalService: NgbModal,
              private _router: Router,
              private _route: ActivatedRoute,
              private _formBuilder: FormBuilder,
              private _seriesService: SeriesService,
              private _carService: CarsService) { }

  ngOnInit(): void {
    this._carService.getAllCars().subscribe((cars) => {
      this.carList = cars;
    });
    this._route.data.subscribe((data: { series: Series }) => {
      this.series = data.series;
      this.seriesForm.patchValue({name: this.series.name});
      this.seriesForm.patchValue({description: this.series.description});
      this.seriesForm.patchValue({logoUrl: this.series.logoImgUrl});
      this.seriesForm.patchValue({isTeam: this.series.isTeam});
      this.seriesForm.patchValue({isArchived: this.series.isArchived});
      this.seriesForm.patchValue({isLeague: this.series.isLeague});
    });
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

  updateSeries() {
    this.seriesForm.markAllAsTouched();

    if (this.seriesForm.invalid) {
      this.isSubmitting = false;
      return;
    }

    this.isSubmitting = true;
    const { name, description, logoUrl, isTeam, isArchived, isLeague} = this.seriesForm.value;
    this.series.name = name;
    this.series.description = description;
    this.series.logoImgUrl = logoUrl;
    this.series.isTeam = isTeam;
    this.series.isArchived = isArchived;
    this.series.isLeague = isLeague;
    this.series.carIds = this.series.cars.map(t => t.id);
    this._seriesService.putSeries(this.series).subscribe(
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

  addCar() {
    const filter = this.series.cars.filter(c => c.id === this.seriesForm.get('newCar').value);
    if (filter.length === 0) {
      const carsFilter = this.carList.filter(c => c.id === this.seriesForm.get('newCar').value);
      if (carsFilter.length > 0) {
        const car = carsFilter[0];
          this.series.cars.push(car);
      }
    }
  }

  removeCar(car: Car) {
    if (this.series.cars.length === 1) {
      return;
    } else {
      const index = this.series.cars.indexOf(car, 0);
      if (index > -1) {
        this.series.cars.splice(index, 1);
      }
    }
  }
}

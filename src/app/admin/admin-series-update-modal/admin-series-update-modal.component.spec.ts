import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSeriesUpdateModalComponent } from './admin-series-update-modal.component';

describe('AdminSeriesUpdateModalComponent', () => {
  let component: AdminSeriesUpdateModalComponent;
  let fixture: ComponentFixture<AdminSeriesUpdateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSeriesUpdateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSeriesUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

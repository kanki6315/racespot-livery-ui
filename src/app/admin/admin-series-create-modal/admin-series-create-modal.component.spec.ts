import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSeriesCreateModalComponent } from './admin-series-create-modal.component';

describe('AdminSeriesCrudModalComponent', () => {
  let component: AdminSeriesCreateModalComponent;
  let fixture: ComponentFixture<AdminSeriesCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSeriesCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSeriesCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

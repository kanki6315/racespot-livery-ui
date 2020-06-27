import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesLiverySubmissionComponent } from './series-livery-submission.component';

describe('SeriesLiverySubmissionComponent', () => {
  let component: SeriesLiverySubmissionComponent;
  let fixture: ComponentFixture<SeriesLiverySubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeriesLiverySubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesLiverySubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

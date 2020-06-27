import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesModalComponent } from './series-modal.component';

describe('SeriesModalComponent', () => {
  let component: SeriesModalComponent;
  let fixture: ComponentFixture<SeriesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeriesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

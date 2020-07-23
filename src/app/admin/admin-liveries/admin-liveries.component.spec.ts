import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLiveriesComponent } from './admin-liveries.component';

describe('AdminUsersComponent', () => {
  let component: AdminLiveriesComponent;
  let fixture: ComponentFixture<AdminLiveriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLiveriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLiveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

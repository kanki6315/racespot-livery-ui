import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyModalComponent } from './privacy-policy-modal.component';

describe('PrivacyPolicyModalComponent', () => {
  let component: PrivacyPolicyModalComponent;
  let fixture: ComponentFixture<PrivacyPolicyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacyPolicyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPolicyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

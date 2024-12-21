import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplyPaymentDetailsComponent } from './disply-payment-details.component';

describe('DisplyPaymentDetailsComponent', () => {
  let component: DisplyPaymentDetailsComponent;
  let fixture: ComponentFixture<DisplyPaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplyPaymentDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplyPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

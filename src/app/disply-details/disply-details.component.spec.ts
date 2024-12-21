import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplyDetailsComponent } from './disply-details.component';

describe('DisplyDetailsComponent', () => {
  let component: DisplyDetailsComponent;
  let fixture: ComponentFixture<DisplyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplyDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

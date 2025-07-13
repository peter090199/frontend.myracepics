import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleandCompanyComponent } from './peopleand-company.component';

describe('PeopleandCompanyComponent', () => {
  let component: PeopleandCompanyComponent;
  let fixture: ComponentFixture<PeopleandCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeopleandCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleandCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

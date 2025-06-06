import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSuggestionsModalComponent } from './all-suggestions-modal.component';

describe('AllSuggestionsModalComponent', () => {
  let component: AllSuggestionsModalComponent;
  let fixture: ComponentFixture<AllSuggestionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllSuggestionsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllSuggestionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

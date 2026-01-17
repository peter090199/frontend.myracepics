import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPhotosEventComponent } from './upload-photos-event.component';

describe('UploadPhotosEventComponent', () => {
  let component: UploadPhotosEventComponent;
  let fixture: ComponentFixture<UploadPhotosEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadPhotosEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPhotosEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

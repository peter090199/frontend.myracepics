import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfessionalService } from 'src/app/services/SharedServices/professional.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';


@Component({
  selector: 'app-add-education-ui',
  templateUrl: './add-education-ui.component.html',
  styleUrls: ['./add-education-ui.component.css'],
})
export class AddEducationUIComponent implements OnInit {
  educationForm: FormGroup;
  educationList: any[] = [];

  currentYear = new Date().getFullYear();
  years: number[] = [];
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  educationStatusOptions = [
    { value: 'graduate', label: 'Graduate' },
    { value: 'undergraduate', label: 'Undergraduate' },
    { value: 'ongoing', label: 'Ongoing' },
  ];

  constructor(
      private formBuilder: FormBuilder,
      private dataService: ProfessionalService,
      private alert: NotificationsService,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<AddEducationUIComponent>,
      private profileService: ProfessionalService,
      private educationService:CurriculumVitaeService
  ) {
    // Populate year dropdown (2000 to current year)
    for (let year = 2000; year <= this.currentYear; year++) {
      this.years.push(year);
    }
   
  }

  ngOnInit(): void {
    this.loadEducationData();

    this.educationForm = this.formBuilder.group({
      education: this.formBuilder.array([this.createEducationGroup()]),
    });
  }

  // Fetch data for existing education records
  loadEducationData() {
    this.educationList = this.profileService.getDataEducation();
  }

  // Create a new FormGroup for education entries
  createEducationGroup(): FormGroup {
    return this.formBuilder.group({
      highest_education: ['', Validators.required],
      school_name: ['', Validators.required],
      start_month: ['', Validators.required],
      start_year: ['', [Validators.required, Validators.min(1900), Validators.max(this.currentYear)]],
      end_month: ['', Validators.required],
      end_year: ['', [Validators.required, Validators.min(1900), Validators.max(this.currentYear)]],
      status: ['', Validators.required],
    });
  }

  // Add a new education group to the form array
  addEducation(): void {
    const educationGroup = this.createEducationGroup();
    this.educationArray.push(educationGroup);
  }

  // Access the FormArray for education
  get educationArray(): FormArray {
    return this.educationForm.get('education') as FormArray;
  }

//   // Remove education from the FormArray
  removeItemFromArray2(arrayName: string, index: number): void {
    if (arrayName === 'education' && this.educationArray.length > 1) {
      this.educationArray.removeAt(index);
    }
  }

  // Submit the form, save data, and close the dialog
submitForm(): void {
  if (this.educationForm.invalid) {
    this.educationForm.markAllAsTouched();
    return;
  }
   const payload = { educations: this.educationForm.value.education };

  console.log(payload)
  this.educationService.saveEducations(payload).subscribe({
    next: (res) => {
      if(res.success == true)
      {
         this.alert.toastrSuccess(res.message);
         this.resetForm();
      }
      else
      {
         this.alert.toastrWarning(res.message);
      }
    },
    error: (error) => {
      console.error('❌ Failed to save education records:', error);
    }
  });
}


  // Reset the form and initialize it with a blank entry
  resetForm(): void {
    while (this.educationArray.length !== 0) {
      this.educationArray.removeAt(0);
    }
    this.educationArray.push(this.createEducationGroup());
    this.educationForm.reset();
  }

  // Close the dialog without saving changes
  onNoClick(): void {
    this.dialogRef.close();
  }
}

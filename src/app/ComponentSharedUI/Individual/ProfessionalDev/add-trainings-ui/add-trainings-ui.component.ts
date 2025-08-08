import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfessionalService } from 'src/app/services/SharedServices/professional.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';

@Component({
  selector: 'app-add-trainings-ui',
  templateUrl: './add-trainings-ui.component.html',
  styleUrls: ['./add-trainings-ui.component.css']
})
export class AddTrainingsUiComponent implements OnInit {
  dataList: any[] = [];
  trainingForm: FormGroup;

  constructor(private fb: FormBuilder, private dataService: ProfessionalService,
    private datePipe: DatePipe, private alert: NotificationsService, public dialogRef: MatDialogRef<AddTrainingsUiComponent>,
    private cvDataServices: CurriculumVitaeService

  ) { }

  ngOnInit(): void {
    
    this.trainingForm = this.fb.group({
      training: this.fb.array([
        this.createTraining() // Initializes the first FormGroup
      ])
    });


  }
  get trainingArray(): FormArray {
    return this.trainingForm.get('training') as FormArray;
  }
  addTraining(): void {
    this.trainingArray.push(this.createTraining());
  }

  removeItemFromArray3(arrayName: string, index: number): void {
    if (arrayName === 'training' && this.trainingArray.length > 1) {
      this.trainingArray.removeAt(index);
    }
  }

  //trainings
  createTraining(): FormGroup {
    return this.fb.group({
      training_title: ['', Validators.required],
      training_provider: ['', Validators.required],
      date_completed: ['', Validators.required],
    });
  }



  seminarList: any[] = [];
  submitForm(): void {
    if (this.trainingForm.invalid) {
      this.trainingForm.markAllAsTouched();
      return;
    }

    // ✅ Send directly as array
    let payload = this.trainingForm.get('training')?.value || [];

    // ✅ Format date to YYYY-MM-DD for backend
    payload = payload.map((item: { date_completed: string | number | Date; }) => ({
      ...item,
      date_completed: this.datePipe.transform(item.date_completed, 'yyyy-MM-dd')
    }));

    console.log('🚀 Sending payload:', payload);

    this.cvDataServices.saveTrainings(payload).subscribe({
      next: (res) => {
        if (res.success === true) {
          this.alert.toastrSuccess(res.message);
          this.dialogRef.close(true);
          this.resetForm();
        } else {
          this.alert.toastrWarning(res.message);
        }
      },
      error: (error) => {
        console.error('❌ Failed to save training records:', error);
      }
    });
  }


  // submitForm(): void {
  //   if (this.trainingForm.valid) {
  //     this.dataList = this.trainingArray.value;
  //     this.dataService.setformTraining(this.dataList); // Save to the service or database
  //     this.alert.toastrSuccess('Successfully Added.');
  //     this.dialogRef.close(this.dataList);
  //   } else {
  //     console.error('Form is invalid');
  //   }
  // }


  resetForm(): void {
    while (this.trainingArray.length !== 0) {
      this.trainingArray.removeAt(0);
    }
    this.trainingArray.push(this.createTraining()); // Reset with one blank group
    this.trainingForm.reset();
  }

}

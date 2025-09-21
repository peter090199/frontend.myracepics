import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfessionalService } from 'src/app/services/SharedServices/professional.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';
import { inject } from '@angular/core/testing';

@Component({
  selector: 'app-add-trainings-ui',
  templateUrl: './add-trainings-ui.component.html',
  styleUrls: ['./add-trainings-ui.component.css']
})
export class AddTrainingsUiComponent implements OnInit {
  dataList: any[] = [];
  trainingForm: FormGroup;
  btnSave: string = "Save";



  constructor(private fb: FormBuilder, private dataService: ProfessionalService,
    private datePipe: DatePipe, private alert: NotificationsService, public dialogRef: MatDialogRef<AddTrainingsUiComponent>,
    private cvDataServices: CurriculumVitaeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {

    this.trainingForm = this.fb.group({
      training: this.fb.array([
        this.createTraining() // Initializes the first FormGroup
      ])
    });

    if (this.data?.id) {
      this.btnSave = 'Update';
      this.patchFormData(this.data);
    }
  }

  patchFormData(data: any) {
    const group = this.trainingArray.at(0) as FormGroup;
    group.patchValue({
      training_title: data.training_title,
      training_provider: data.training_provider,
      date_completed: data.date_completed ? new Date(data.date_completed) : ''
    });
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`; // YYYY-MM-DD
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

  loading: boolean = false;
  submitForm(): void {
    if (this.trainingForm.invalid) {
      this.trainingForm.markAllAsTouched();
      return;
    }
    let payload = this.trainingForm.get('training')?.value || [];
    payload = payload.map((item: { date_completed: string | number | Date; }) => ({
      ...item,
      date_completed: this.datePipe.transform(item.date_completed, 'yyyy-MM-dd')
    }));

    console.log('🚀 Sending payload:', payload);

    this.loading = true;

    if (this.btnSave === 'Save') {
      this.cvDataServices.saveTrainings(payload).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success) {
            this.alert.toastrSuccess(res.message);
            this.dialogRef.close(true);
          } else {
            this.alert.toastrWarning(res.message);
          }
        },
        error: (err) => {
          if (err.status === 422 && err.error?.message) {
            this.alert.toastrWarning(err.error.message);
          } else {
            this.alert.toastrError('Failed to save seminar');
          }
        }
      });

    } else {
      // UPDATE MODE → send only one seminar object
      const data = payload[0]; // only the first one
      this.cvDataServices.updateTrainings(this.data.id, data).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success) {
            this.alert.toastrSuccess(res.message);
            this.dialogRef.close(true);
          } else {
            this.alert.toastrWarning(res.message);
          }
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 422 && err.error?.message) {
            this.alert.toastrWarning(err.error.message);
          } else {
            this.alert.toastrError('Failed to save seminar');
          }
        }
      });
    }
  }

  seminarList: any[] = [];
  submitFormxx(): void {
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

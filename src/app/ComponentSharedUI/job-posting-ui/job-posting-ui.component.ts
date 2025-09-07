import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { JobPostingService } from 'src/app/services/Jobs/job-posting.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-job-posting-ui',
  templateUrl: './job-posting-ui.component.html',
  styleUrls: ['./job-posting-ui.component.css']
})
export class JobPostingUIComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  imageForm!: FormGroup;
  jobForm!: FormGroup;
  companyForm!: FormGroup;


  btnSave = "Save";
  loading = false;
  fileError: string | null = null;

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  worktypes: string[] = ['Onsite', 'Work From Home', 'Hybrid'];
  progressValue: number = 0;

  charCount: number = 0;

  responsibilities: string[] = [
    'Develop quality software and web applications',
    'Analyze and maintain existing software applications',
    'Design highly scalable, testable code',
    'Discover and fix programming bugs'
  ];
  qualifications: string[] = [
    "Bachelor's degree or equivalent experience in Computer Science or related field",
    'Development experience with programming languages',
    'SQL database or relational database skills'
  ];

  newResponsibility: string = '';
  newQualification: string = '';

  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<JobPostingUIComponent>,
    private notificationService: NotificationsService,
    private jobServices: JobPostingService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.progressValue = ((0 + 1) / 3) * 100;

    // Step 0 - Image
    this.imageForm = this.fb.group({
      job_image: [null, Validators.required]   // FIXED
    });

    // Step 1 - Job Details
    this.jobForm = this.fb.group({
      job_name: ['', Validators.required],
      job_position: ['', Validators.required],
      job_description: ['', Validators.required], // FIXED
      location: ['', Validators.required],
      benefits: ['', Validators.required],
      job_about: ['', Validators.required],
    });

    // Step 2 - Company Info
    this.companyForm = this.fb.group({
      qualification: ['', Validators.required],
      work_type: ['', Validators.required],
      comp_name: ['', Validators.required],
      comp_description: ['', Validators.required],
    });

 
    if (this.data?.id) {
      this.btnSave = "Update";
      this.fillFormData();
    }
  }

  getProgressValue(stepIndex: number): number {
    const totalSteps = 3;
    return ((stepIndex + 1) / totalSteps) * 100;
  }

  nextStep(stepper?: MatStepper): void {
    (stepper || this.stepper).next();
  }

  previousStep(stepper?: MatStepper): void {
    (stepper || this.stepper).previous();
  }

  onStepChange(event?: any) {
    if (!this.loading) {
      const totalSteps = 3;
      const currentStep = event?.selectedIndex ?? 0;
      this.progressValue = ((currentStep + 1) / totalSteps) * 100;
    }
  }

  onUploadPhoto(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.fileError = 'Only image files are allowed.';
        this.selectedFile = null;
        this.previewUrl = null;
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.fileError = 'Image size must be less than 2MB.';
        this.selectedFile = null;
        this.previewUrl = null;
        return;
      }

      this.selectedFile = file;
      this.imageForm.patchValue({ job_image: file });
      this.imageForm.get('job_image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
      this.fileError = null;
    } else {
      this.fileError = 'Please select a valid image.';
    }
  }

  /** Fill in data when editing */
  fillFormData() {
    this.jobForm.patchValue({
      job_name: this.data.job_name,
      job_position: this.data.job_position,
      job_description: this.data.job_description,
      job_about: this.data.job_about,
      location: this.data.location,
      benefits: this.data.benefits,
    });

    this.companyForm.patchValue({
      qualification: this.data.qualification,
      work_type: this.data.work_type,
      comp_name: this.data.comp_name,
      comp_description: this.data.comp_description,
    });

    this.previewUrl = this.data.job_image || null;
  }

  /** Submit all forms */
  onSubmit(): void {
    if (!this.selectedFile && this.btnSave.toLowerCase() === "save") {
      this.notificationService.toastrError("Please upload a job image before saving.");
      return;
    }

    if (this.jobForm.invalid || this.companyForm.invalid) {
      this.notificationService.toastrError("Please complete all required fields.");
      return;
    }

    this.loading = true;
    const formData = new FormData();

    if (this.selectedFile) {
      formData.append('job_image', this.selectedFile);
    }

    const jobValues = this.jobForm.value;
    const companyValues = this.companyForm.value;

    Object.entries({ ...jobValues, ...companyValues }).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    if (this.btnSave.toLowerCase() === "save") {
      this.jobServices.saveJobPosting(formData).subscribe({
        next: (res) => {
          this.notificationService.toastrSuccess(res.message);
          this.dialogRef.close(true);
          this.loading = false;
        },
        error: (err) => {
          this.notificationService.toastrError(err.error?.message || "Error saving job");
          this.loading = false;
        }
      });
    } else {
      // Uncomment when update service is ready
      // this.jobServices.updateJobPosting(this.data.id, formData).subscribe({
      //   next: (res) => {
      //     this.notificationService.toastrSuccess(res.message);
      //     this.dialogRef.close(true);
      //     this.loading = false;
      //   },
      //   error: (err) => {
      //     this.notificationService.toastrError(err.error?.message || "Error updating job");
      //     this.loading = false;
      //   }
      // });
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  /** Character count for job description */
  updateCharCount() {
    this.charCount = this.jobForm.get('job_description')?.value?.length || 0;
  }

  /** Responsibilities */
  addResponsibility() {
    if (this.newResponsibility.trim()) {
      this.responsibilities.push(this.newResponsibility.trim());
      this.newResponsibility = '';
    }
  }

  removeResponsibility(index: number) {
    this.responsibilities.splice(index, 1);
  }

  /** Qualifications */
  addQualification() {
    if (this.newQualification.trim()) {
      this.qualifications.push(this.newQualification.trim());
      this.newQualification = '';
    }
  }

  removeQualification(index: number) {
    this.qualifications.splice(index, 1);
  }

  // simple text formatting
  formatText(cmd: string) {
    document.execCommand(cmd, false, '');
  }

  addBullet() {
    const ctrl = this.jobForm.get('job_description');
    ctrl?.setValue((ctrl.value || '') + '\n• ');
    this.updateCharCount();
  }
}

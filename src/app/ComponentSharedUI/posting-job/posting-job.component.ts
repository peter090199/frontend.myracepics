import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router, Routes } from '@angular/router';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { JobPostingService } from 'src/app/services/Jobs/job-posting.service';

@Component({
  selector: 'app-posting-job',
  templateUrl: './posting-job.component.html',
  styleUrls: ['./posting-job.component.css']
})
export class PostingJobComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  imageForm!: FormGroup;
  jobForm!: FormGroup;
  companyForm!: FormGroup;

  btnSave = "Save";
  loading = false;
  fileError: string | null = null;

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isImageSelected = false;

  worktypes: string[] = ['Onsite', 'Work From Home', 'Hybrid'];
  progressValue: number = 0;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationsService,
    private jobServices: JobPostingService, private router: Router
  ) { }

  ngOnInit(): void {
    this.progressValue = ((0 + 1) / 3) * 100; // start at step 1

    // Step 0 - Image
    this.imageForm = this.fb.group({
      image: [null, Validators.required]
    });

    // Step 1 - Job Details
    this.jobForm = this.fb.group({
      job_name: ['', Validators.required],
      job_position: ['', Validators.required],
      job_description: ['', Validators.required],
      job_about: ['', Validators.required],
    });

    // Step 2 - Company Info
    this.companyForm = this.fb.group({
      qualification: ['', Validators.required],
      work_type: ['', Validators.required],
      comp_name: ['', Validators.required],
      comp_description: ['', Validators.required],
    });
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
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.fileError = 'Image size must be less than 2MB.';
        return;
      }

      this.selectedFile = file;
      this.imageForm.patchValue({ image: file });
      this.imageForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);

      this.fileError = null;
    }
  }

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

    this.jobServices.saveJobPosting(formData).subscribe({
      next: (res) => {
        this.notificationService.toastrSuccess(res.message);
        this.loading = false;
        this.router.navigateByUrl("/job_posting")
      },
      error: (err) => {
        this.notificationService.toastrError(err.error?.message || "Error saving job");
        this.loading = false;
      }
    });
  }

  // ============ Responsibilities & Qualifications =============
  jobDescription: string = '';
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

  updateCharCount() {
    this.charCount = this.jobDescription.length;
  }

  addResponsibility() {
    if (this.newResponsibility.trim()) {
      this.responsibilities.push(this.newResponsibility.trim());
      this.newResponsibility = '';
    }
  }

  removeResponsibility(index: number) {
    this.responsibilities.splice(index, 1);
  }

  addQualification() {
    if (this.newQualification.trim()) {
      this.qualifications.push(this.newQualification.trim());
      this.newQualification = '';
    }
  }

  removeQualification(index: number) {
    this.qualifications.splice(index, 1);
  }

  formatText(cmd: string) {
    document.execCommand(cmd, false, '');
  }

  addBullet() {
    this.jobDescription += '\n• ';
    this.updateCharCount();
  }
}

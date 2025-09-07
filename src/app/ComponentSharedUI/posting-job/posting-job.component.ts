import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { AppliedQuestionsService } from 'src/app/services/Jobs/applied-questions.service';
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
  appliedQuestionForm!: FormGroup;

  btnSave = "Save";
  loading = false;
  fileError: string | null = null;

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  worktypes: string[] = ['Onsite', 'Work From Home', 'Hybrid'];
  progressValue: number = 0;
  newQuestionText: string = '';
  newQuestionControl = this.fb.control('');

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) @Optional() public data: any,
    private notificationService: NotificationsService,
    private jobServices: JobPostingService,
    private router: Router, private questionService: AppliedQuestionsService
  ) { }

  ngOnInit(): void {
    this.progressValue = this.getProgressValue(0); // start at step 1

    this.imageForm = this.fb.group({
      image: [null, Validators.required]
    });

    this.jobForm = this.fb.group({
      job_name: ['', Validators.required],
      job_position: ['', Validators.required],
      job_description: ['', Validators.required],
      job_about: ['', Validators.required],
      location: ['', Validators.required],
      benefits: ['', Validators.required],
    });

    this.companyForm = this.fb.group({
      qualification: ['', Validators.required],
      work_type: ['', Validators.required],
      //  comp_name: ['', Validators.required],
      // comp_description: ['', Validators.required],
    });

    this.appliedQuestionForm = this.fb.group({
      questions: this.fb.array([])
    });

    //this.loadQuestions();

    if (this.data?.id) {
      this.btnSave = "Update";
      this.fillFormData();
    }
  }

  get questions(): FormArray {
    return this.appliedQuestionForm.get('questions') as FormArray;
  }

  labels = ['Job Name'];

  addQuestion(): void {
    const index = this.questions.length;
    this.questions.push(
      this.fb.group({
        question_text: ['', Validators.required]
      })
    );
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }



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

  onStepChange(event: any) {
    if (!this.loading) {
      const currentStep = event.selectedIndex ?? 0;
      this.progressValue = this.getProgressValue(currentStep);
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

      // ✅ mark the form control as "valid" without patching file
      this.imageForm.get('image')?.setValue('selected');

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);

      this.fileError = null;
    }
  }


  onSubmit(): void {
    // Check for job image if saving for first time
    if (!this.selectedFile && this.btnSave.toLowerCase() === "save") {
      this.notificationService.toastrError("Please upload a job image before saving.");
      return;
    }

    // Validate forms
    if (this.jobForm.invalid || this.companyForm.invalid || this.appliedQuestionForm.invalid) {
      this.notificationService.toastrError("Please complete all required fields.");
      return;
    }

    this.loading = true;
    const formData = new FormData();

    // Append file if uploaded
    if (this.selectedFile) {
      formData.append("job_image", this.selectedFile);
    }

    // Get values
    const jobValues = this.jobForm.value;
    const companyValues = this.companyForm.value;
    const appliedQuestionValues = this.appliedQuestionForm.value;

    // Append job & company fields
    Object.entries({ ...jobValues, ...companyValues }).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    // ✅ Append questions properly as question_text[]
    if (appliedQuestionValues.questions && appliedQuestionValues.questions.length > 0) {
      appliedQuestionValues.questions.forEach((q: any, index: number) => {
        formData.append(`question_text[${index}]`, q.question_text); // ✅ use q.question_text
      });
    }

    console.log("Questions to send:", appliedQuestionValues.questions);


    // Debug check
    for (let pair of (formData as any).entries()) {
      console.log(pair[0], pair[1]);
    }

    // Send request
    this.jobServices.saveJobPosting(formData).subscribe({
      next: (res) => {
        if (res.success == true) {
          console.log(res);
          this.notificationService.toastrSuccess(res.message);
          this.loading = false;
          this.router.navigateByUrl("/job_posting");
        } else {
          this.notificationService.toastrError(res.message);
          this.loading = true;
        }
      },
      error: (err) => {
        this.notificationService.toastrError("Error saving!");
        this.loading = false;
      }
    });
  }


  // onSubmit(): void {
  //   // Check for job image if saving for first time
  //   if (!this.selectedFile && this.btnSave.toLowerCase() === "save") {
  //     this.notificationService.toastrError("Please upload a job image before saving.");
  //     return;
  //   }

  //   // Validate forms
  //   if (this.jobForm.invalid || this.companyForm.invalid || this.appliedQuestionForm.invalid) {
  //     this.notificationService.toastrError("Please complete all required fields.");
  //     return;
  //   }

  //   this.loading = true;
  //   const formData = new FormData();

  //   // Append file if uploaded
  //   if (this.selectedFile) {
  //     formData.append("job_image", this.selectedFile);
  //   }

  //   // Get values
  //   const jobValues = this.jobForm.value;
  //   const companyValues = this.companyForm.value;
  //   const appliedQuestionValues = this.appliedQuestionForm.value;

  //   // Append job & company fields
  //   Object.entries({ ...jobValues, ...companyValues }).forEach(([key, value]) => {
  //     formData.append(key, value as string);
  //   });

  //   // Append questions as JSON array
  //   if (appliedQuestionValues.questions && appliedQuestionValues.questions.length > 0) {
  //     formData.append("questions", JSON.stringify(appliedQuestionValues.questions));
  //   }

  //   for (let pair of (formData as any).entries()) {
  //     console.log(pair[0], pair[1]);
  //   }


  //   // Send request
  //   this.jobServices.saveJobPosting(formData).subscribe({
  //     next: (res) => {
  //       if (res.success == true) {
  //         console.log(res)

  //         this.notificationService.toastrSuccess(res.message);
  //         this.loading = false;
  //         this.router.navigateByUrl("/job_posting");
  //       }
  //       else
  //       {
  //         this.notificationService.toastrError(res.message);
  //         this.loading = true;
  //       }

  //     },
  //     error: (err) => {
  //       this.notificationService.toastrError("error saving!");
  //       this.loading = false;
  //     }
  //   });
  // }


  onSubmitxx(): void {
    if (!this.selectedFile && this.btnSave.toLowerCase() === "save") {
      this.notificationService.toastrError("Please upload a job image before saving.");
      return;
    }

    if (this.jobForm.invalid || this.companyForm.invalid || this.appliedQuestionForm.valid) {
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
    const appliedQuestionFormValues = this.appliedQuestionForm.value;

    Object.entries({ ...jobValues, ...companyValues, ...appliedQuestionFormValues }).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    console.log("testData ", formData)
    return;

    this.jobServices.saveJobPosting(formData).subscribe({
      next: (res) => {
        this.notificationService.toastrSuccess(res.message);
        this.loading = false;
        this.router.navigateByUrl("/job_posting");
      },
      error: (err) => {
        this.notificationService.toastrError(err.error?.message || "Error saving job");
        this.loading = false;
      }
    });
  }




  // loadQuestions() {
  //   const control = this.appliedQuestionForm.get('answers') as FormArray;
  //   this.questions.forEach(q => {
  //     control.push(this.fb.group({
  //       questionId: [q.id],
  //       answer: ['', Validators.required]
  //     }));
  //   });
  // }

  // Add a new question dynamically
  //  addQuestion() {
  //   if (!this.newQuestionText.trim()) return;

  //   console.log(this.newQuestionText)
  //   return;
  //   this.questionService.addQuestion(this.newQuestionText).subscribe({
  //     next: (res) => {
  //       if (res.success) {
  //         this.questions.push(res.question); // dynamically add to list
  //         this.newQuestionText = ''; // clear input
  //       }
  //     },
  //     error: (err) => console.error(err)
  //   });
  // }



  submit() {
    if (this.appliedQuestionForm.valid) {
      console.log(this.appliedQuestionForm.value);
    } else {
      console.log('Form is invalid');
    }
  }


}

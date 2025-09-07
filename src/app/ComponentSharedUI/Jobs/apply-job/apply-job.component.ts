import { Component, Inject, OnInit, OnDestroy, Optional, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

import { CountryCodesService } from 'src/app/services/country-codes.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { JobPostingService } from 'src/app/services/Jobs/job-posting.service';
import { ProfileService } from 'src/app/services/Profile/profile.service';
import { ActivatedRoute } from '@angular/router';
import { AppliedQuestionsService } from 'src/app/services/Jobs/applied-questions.service';

@Component({
  selector: 'app-apply-job',
  templateUrl: './apply-job.component.html',
  styleUrls: ['./apply-job.component.css']
})
export class ApplyJobComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper!: MatStepper;

  profiles: any;
  imageForm!: FormGroup;
  personalForm!: FormGroup;
  companyForm!: FormGroup;

  btnSave = "Save All";
  loading = false;
  fileError: string | null = null;

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  worktypes: string[] = ['Onsite', 'Work From Home', 'Hybrid'];
  progressValue: number = 0;
  error: string = '';

  // country data + search
  countryCodes: { label: string; value: string }[] = [];
  countryControl: FormControl = new FormControl('');
  filteredCountryCodes!: Observable<{ label: string; value: string }[]>;

  private _onDestroy = new Subject<void>();
  resumeName: string | null = null;

  job: any = null;
  questions: any[] = [];

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) @Optional() public data: any,
    private notificationService: NotificationsService,
    private jobServices: JobPostingService,
    private router: Router,
    private profileService: ProfileService,
    private appliedService:AppliedQuestionsService,
    private countrycodeServices: CountryCodesService,private route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    const transNo = this.route.snapshot.paramMap.get('transNo');
    if (transNo) {
      this.fetchJobPosting(transNo);
    }

    this.imageForm = this.fb.group({
      resume: [null, Validators.required]
    });

    this.personalForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      country_code: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
    });

    this.companyForm = this.fb.group({
      qualification: ['', Validators.required],
      work_type: ['', Validators.required],
      comp_name: ['', Validators.required],
      comp_description: ['', Validators.required],
    });

    // Load data
    this.loadProfile();
    this.loadCountryCodes();

    this.progressValue = this.getProgressValue(0);

    if (this.data?.id) {
      this.btnSave = "Update";
      this.fillFormData();
    }


    // wire autocomplete filter (default empty until countryCodes populated)
    this.filteredCountryCodes = this.countryControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

   fetchJobPosting(transNo: string): void {
    this.loading = true;
    this.appliedService.getJobPostingByTransNo(transNo).subscribe({
      next: (res) => {
        if (res.success) {
          this.job = res.job;
          this.questions = res.questions;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load job posting:', err);
        this.loading = false;
      }
    });
  }

  areAllQuestionsAnswered(): boolean {
  if (!this.questions || this.questions.length === 0) return false;
  return this.questions.every(q => q.answer && q.answer.trim().length > 0);
}


  /** Load user profile and prefill */
  loadProfile(): void {
    this.profileService.getProfileByUserOnly().subscribe({
      next: (res) => {
        if (res?.success) {
          const profile = res.message;
          this.personalForm.patchValue({
            email: profile.email || '',
            phone_number: profile.contact_no || ''
          });
          this.previewUrl = profile.photo_pic || null;

          // try to preselect country_code based on contact_no (if +63 etc.)
          if (profile.contact_no) {
            const matched = this.countryCodes.find(c => profile.contact_no.startsWith(c.value));
            if (matched) {
              this.personalForm.patchValue({ country_code: matched.value });
            } else if (profile.contact_no.startsWith('+63')) {
              this.personalForm.patchValue({ country_code: '+63' });
            }
          }
        }
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
      }
    });
  }

  /** Load and transform country codes */
  loadCountryCodes(): void {
    this.countrycodeServices.loadCountryCodes().subscribe({
      next: (res) => {
        if (res && res.phones && res.names) {
          this.countryCodes = Object.entries(res.phones).map(([code, dial]) => ({
            label: `${code} (+${dial})`,  // ✅ Example: "BD (+880)"
            value: `+${code}`             // ✅ Stores only the dial code
          }));
        } else {
          this.countryCodes = [];
        }
      },
      error: (err) => {
        console.error('Error fetching country codes:', err);
        this.countryCodes = [];
      }
    });
  }

  loadCountryCodesxx(): void {
    this.countrycodeServices.loadCountryCodes().subscribe({
      next: (res) => {
        if (res && res.phones && res.names) {
          this.countryCodes = Object.entries(res.phones).map(([code, dial]) => ({
            label: `${res.names[code] || code} (+${dial})`,
            value: `+${dial}`
          }));
        } else {
          this.countryCodes = [];
        }
        // re-evaluate filtered observable by emitting current search value
        const current = (this.countryControl.value as string) || '';
        // push new filtered observable mapping (keeps subscription chain)
        this.filteredCountryCodes = this.countryControl.valueChanges.pipe(
          startWith(current),
          map(value => this._filter(value || ''))
        );
      },
      error: (err) => {
        console.error('Error fetching country codes:', err);
        this.countryCodes = [];
        this.filteredCountryCodes = this.countryControl.valueChanges.pipe(
          startWith(''),
          map(() => [])
        );
      }
    });
  }

  /** Filter logic used by autocomplete */
  private _filter(value: string): { label: string; value: string }[] {
    const filterValue = value.toLowerCase().trim();
    if (!filterValue) {
      return this.countryCodes.slice();
    }
    return this.countryCodes.filter(c =>
      c.label.toLowerCase().includes(filterValue) ||
      c.value.includes(filterValue)
    );
  }

  countryPatterns: { [key: string]: RegExp } = {
    '+63': /^[9]\d{9}$/,            // Philippines (10 digits starting with 9)
    '+1': /^[2-9]\d{9}$/,           // USA/Canada (10 digits)
    '+91': /^[6-9]\d{9}$/,          // India (10 digits starting 6–9)
    '+44': /^\d{10}$/,              // UK (10 digits, simplify for demo)
  };


  /** When user selects an autocomplete option, set the form value (bind in template) */
  onCountrySelected(selectedLabel: string): void {
    const found = this.countryCodes.find(
      c => c.label === selectedLabel || c.value === selectedLabel
    );
    if (found) {
      // Remove the + from the value
      const numericCode = found.value.replace('+', '');
      this.personalForm.patchValue({ country_code: numericCode });

      // dynamically update phone_number validator based on selected country
      const pattern = this.countryPatterns[found.value] || /^[0-9]{7,15}$/;
      this.personalForm.get('phone_number')?.setValidators([
        Validators.required,
        Validators.pattern(pattern)
      ]);
      this.personalForm.get('phone_number')?.updateValueAndValidity();
    }
  }

  /** Resume upload */
  onUploadResume(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (file.type !== 'application/pdf') {
      this.fileError = 'Only PDF files are allowed.';
      this.resumeName = null;
      this.imageForm.reset();
      return;
    }
    this.fileError = null;
    this.resumeName = file.name;
    this.imageForm.patchValue({ resume: file });
    this.imageForm.get('resume')?.updateValueAndValidity();
  }

  fillFormData(): void {
    // fill personal and company forms from `data` if provided
    if (this.data) {
      this.personalForm.patchValue({
        email: this.data.email || '',
        country_code: this.data.country_code || '',
        phone_number: this.data.phone_number || ''
      });

      this.companyForm.patchValue({
        qualification: this.data.qualification || '',
        work_type: this.data.work_type || '',
        comp_name: this.data.comp_name || '',
        comp_description: this.data.comp_description || ''
      });

      this.previewUrl = this.data.job_image || null;
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

  onStepChange(event: any): void {
    if (!this.loading) {
      const currentStep = event.selectedIndex ?? 0;
      this.progressValue = this.getProgressValue(currentStep);
    }
  }
  responseMessage: string = "";

  onCheckCountryCode(): void {
    this.responseMessage = '';

    if (this.personalForm.invalid) {
      this.responseMessage = '⚠️ Please fill out all fields correctly';
      this.showPopup(this.responseMessage);
      return;
    }

    const { country_code, phone_number } = this.personalForm.value;
    //  console.log('Country Code:', country_code, 'Phone Number:', phone_number);

    this.countrycodeServices.validatePhone(country_code, phone_number).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.responseMessage = '';
          this.nextStep(this.stepper);
        } else {
          this.responseMessage = res.message;

          // Optionally map field-specific errors
          if (res.errors?.phone_number) {
            this.personalForm.get('phone_number')?.setErrors({ invalidPhone: true });
          }

          this.showPopup(this.responseMessage);
        }
      },
      error: (err) => {
        if (err.status === 404) {
          this.responseMessage = 'Invalid country code or phone number';
        } else {
          this.responseMessage = 'Server error, try again later';
        }
        this.showPopup(this.responseMessage);
      }
    });
  }

  // Helper method to show popup
  showPopup(message: string): void {
    if (!message) return;
    this.notificationService.toastrWarning(message);
  }


  onSubmit(): void {
    if (this.personalForm.invalid || this.companyForm.invalid) {
      this.notificationService.toastrError("Please complete all required fields.");
      return;
    }

    this.loading = true;
    const formData = new FormData();

    if (this.selectedFile) {
      formData.append('job_image', this.selectedFile);
    }

    const jobValues = this.personalForm.value;
    const companyValues = this.companyForm.value;

    Object.entries({ ...jobValues, ...companyValues }).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

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

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}

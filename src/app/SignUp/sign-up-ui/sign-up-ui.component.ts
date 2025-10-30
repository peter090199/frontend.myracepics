import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SignUpService } from 'src/app/services/SignUp/sign-up.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { MatDialog } from '@angular/material/dialog';
import { TermsModalComponent } from 'src/app/TermsModal/terms-modal/terms-modal.component';
import { PrivacyComponent } from 'src/app/TermsModal/privacy/privacy.component';
import { Route, Router } from '@angular/router';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-sign-up-ui',
  templateUrl: './sign-up-ui.component.html',
  styleUrls: ['./sign-up-ui.component.css']
})

export class SignUpUIComponent implements OnInit {
  userForm: FormGroup;
  companyForm: FormGroup;

  isloading: boolean = false;
  passwordVisible: boolean = false;

  selectedOption: string | undefined;
  professions: { label: string, value: string }[] = [];
  isLoadingIndividual: boolean = false;
  isLoadingCompany: boolean = false;


  options = [
    { value: 'I am over 18 years old' },
    { value: 'I am below 18 years old' },

  ];

  countryCodes = [
    { code: '+1', country: 'USA/Canada' },
    { code: '+7', country: 'Russia/Kazakhstan' },
    { code: '+20', country: 'Egypt' },
    { code: '+27', country: 'South Africa' },
    { code: '+30', country: 'Greece' },
    { code: '+31', country: 'Netherlands' },
    { code: '+32', country: 'Belgium' },
    { code: '+33', country: 'France' },
    { code: '+34', country: 'Spain' },
    { code: '+36', country: 'Hungary' },
    { code: '+39', country: 'Italy' },
    { code: '+40', country: 'Romania' },
    { code: '+41', country: 'Switzerland' },
    { code: '+43', country: 'Austria' },
    { code: '+44', country: 'UK' },
    { code: '+45', country: 'Denmark' },
    { code: '+46', country: 'Sweden' },
    { code: '+47', country: 'Norway' },
    { code: '+48', country: 'Poland' },
    { code: '+49', country: 'Germany' },
    { code: '+52', country: 'Mexico' },
    { code: '+54', country: 'Argentina' },
    { code: '+55', country: 'Brazil' },
    { code: '+56', country: 'Chile' },
    { code: '+57', country: 'Colombia' },
    { code: '+58', country: 'Venezuela' },
    { code: '+60', country: 'Malaysia' },
    { code: '+61', country: 'Australia' },
    { code: '+62', country: 'Indonesia' },
    { code: '+63', country: 'Philippines' },
    { code: '+64', country: 'New Zealand' },
    { code: '+65', country: 'Singapore' },
    { code: '+66', country: 'Thailand' },
    { code: '+81', country: 'Japan' },
    { code: '+82', country: 'South Korea' },
    { code: '+84', country: 'Vietnam' },
    { code: '+86', country: 'China' },
    { code: '+90', country: 'Turkey' },
    { code: '+91', country: 'India' },
    { code: '+92', country: 'Pakistan' },
    { code: '+93', country: 'Afghanistan' },
    { code: '+94', country: 'Sri Lanka' },
    { code: '+95', country: 'Myanmar' },
    { code: '+98', country: 'Iran' },
    { code: '+212', country: 'Morocco' },
    { code: '+213', country: 'Algeria' },
    { code: '+216', country: 'Tunisia' },
    { code: '+218', country: 'Libya' },
    { code: '+220', country: 'Gambia' },
    { code: '+221', country: 'Senegal' },
    { code: '+234', country: 'Nigeria' },
    { code: '+251', country: 'Ethiopia' },
    { code: '+254', country: 'Kenya' },
    { code: '+255', country: 'Tanzania' },
    { code: '+256', country: 'Uganda' },
    { code: '+260', country: 'Zambia' },
    { code: '+263', country: 'Zimbabwe' },
    { code: '+298', country: 'Faroe Islands' },
    { code: '+351', country: 'Portugal' },
    { code: '+352', country: 'Luxembourg' },
    { code: '+353', country: 'Ireland' },
    { code: '+354', country: 'Iceland' },
    { code: '+355', country: 'Albania' },
    { code: '+356', country: 'Malta' },
    { code: '+357', country: 'Cyprus' },
    { code: '+358', country: 'Finland' },
    { code: '+370', country: 'Lithuania' },
    { code: '+371', country: 'Latvia' },
    { code: '+372', country: 'Estonia' },
    { code: '+380', country: 'Ukraine' },
    { code: '+385', country: 'Croatia' },
    { code: '+386', country: 'Slovenia' },
    { code: '+387', country: 'Bosnia and Herzegovina' },
    { code: '+389', country: 'North Macedonia' },
    { code: '+420', country: 'Czech Republic' },
    { code: '+421', country: 'Slovakia' },
    { code: '+423', country: 'Liechtenstein' },
    { code: '+971', country: 'UAE' },
    { code: '+972', country: 'Israel' },
    { code: '+973', country: 'Bahrain' },
    { code: '+974', country: 'Qatar' },
    { code: '+975', country: 'Bhutan' },
    { code: '+976', country: 'Mongolia' },
    { code: '+977', country: 'Nepal' },
    { code: '+992', country: 'Tajikistan' },
    { code: '+993', country: 'Turkmenistan' },
    { code: '+994', country: 'Azerbaijan' },
    { code: '+995', country: 'Georgia' },
    { code: '+996', country: 'Kyrgyzstan' },
    { code: '+998', country: 'Uzbekistan' },
    // Add additional codes as needed
  ];


  fadeIn: any;

  constructor(private fb: FormBuilder,
    private signupService: SignUpService,
    private notifyService: NotificationsService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.countryCodes + this.contactno;
  }
  contactno: any;
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  refreshHomePage() {
    this.router.navigate(['/homepage']).then(() => {
      window.location.reload();
    });
  }

  // Custom domain validator
  comDomainValidator(control: AbstractControl): ValidationErrors | null {
    const domainPattern = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}$/;
    const endsWithCom = /\.com$/;

    if (control.value && (!domainPattern.test(control.value) || !endsWithCom.test(control.value))) {
      return { invalidDomain: true };
    }
    return null;
  }

  get companywebsite() {
    return this.companyForm.get('companywebsite');
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      profession: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      countryCode: new FormControl('', Validators.required),
      contactno: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      fname: new FormControl('', Validators.required),
      lname: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      password_confirmation: new FormControl('', Validators.required),
      agreementTerms: new FormControl(false, Validators.requiredTrue),
      agreementPrivacy: new FormControl(false, Validators.requiredTrue),
      // age: new FormControl('', Validators.required),
      age: 1,
      statuscode: 0
    },
      { validator: this.passwordMatchValidator });

    this.companyForm = this.fb.group({
      company: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      countryCode: new FormControl('', Validators.required),
      contactno: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      fname: new FormControl('', Validators.required),
      lname: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      password_confirmation: new FormControl('', Validators.required),
      agreementTerms: new FormControl(false, Validators.requiredTrue),
      agreementPrivacy: new FormControl(false, Validators.requiredTrue),
      industry: new FormControl('', Validators.required),
      companywebsite: ['', [Validators.required, this.comDomainValidator]],
      designation: new FormControl('', Validators.required),
      statuscode: 1
    },
      { validator: this.passwordMatchValidator2 });
  }
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('password_confirmation')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  passwordMatchValidator2(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('password_confirmation')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
  openModalTerms(title: string, content: string) {
    this.dialog.open(TermsModalComponent, {
      data: { title, content },
      width: '80%',  // You can adjust the modal size
      maxWidth: '600px',
    });
  }

  openModalPrivacy(title: string, content: string) {
    this.dialog.open(PrivacyComponent, {
      data: { title, content },
      width: '80%',  // You can adjust the modal size
      maxWidth: '600px',
    });
  }

  get isAgreementChecked(): boolean {
    return this.userForm.get('agreementTerms')?.value && this.userForm.get('agreementPrivacy')?.value;
  }
  title: string = "";
  industries: string[] = [
    'Accounting/Audit/Tax Services',
    'Advertising/Public Relations/Marketing Services',
    'Architecture/Building/Construction',
    'Athletics/Sports',
    'Charity/Social Services/Non-Profit Organization',
    'Chemical/Plastic/Paper/Petrochemical',
    'Civil Services (Government, Armed Forces)',
    'Clothing/Garment/Textiles',
    'Education',
    'Electronics/Electrical Equipment',
    'Energy/Power/Water/Oil & Gas/Waste Management',
    'Engineering - Building, Civil, Construction/Quantity Survey',
    'Engineering - Electrical/Electronics/Mechanical',
    'Engineering - Others',
    'Entertainment/Recreations',
    'Financial Services',
    'Food and Beverage/Catering',
    'Freight Forwarding/Delivery/Shipping',
    'General Business Services',
    'Health & Beauty Care',
    'Hospitality/Catering',
    'Human Resources Management/Consultancy',
    'Industrial Machinery/Automation Equipment',
    'Information Technology',
    'Insurance/Pension Funding',
    'Interior Design/Graphic Design',
    'Jewelry/Gems/Watches',
    'Laboratory',
    'Legal Services',
    'Management Consultancy/Services',
    'Manufacturing',
    'Mass Transportation',
    'Media/Publishing/Printing',
    'Medical/Pharmaceutical',
    'Mixed Industry Group',
    'Motor Vehicles',
    'Others',
    'Packaging',
    'Performance/Musical/Artistic',
    'Petroleum',
    'Property Development',
    'Property Management/Consultancy',
    'Public Utilities',
    'Research',
    'Security Escort',
    'Security/Fire/Electronic Access Controls',
    'Telecommunication',
    'Tourism/Travel Agency',
    'Toys',
    'Trading and Distribution',
    'Wholesale/Retail'
  ];


  //status: string ="";

  onSubmitIndividual(): void {
    if (this.userForm.invalid) return;
    this.isLoadingIndividual = true;


    if (this.selectedOption === 'I am over 18 years old') {

      if (this.userForm.valid) {
        const formData = this.userForm.getRawValue();
        formData.contactno = `${formData.countryCode}${formData.contactno}`;

        //api => user and client 
        //if(api && pdf sv)
        // this.router.navigateByUrl("/curriculum-vitae");

        //else{
        //}
        this.signupService.signup(formData).subscribe({
          next: (res) => {
            if (res.success === true) {
              this.isloading = true;
              this.isLoadingIndividual = false;
              this.notifyService.toastPopUp(res.message);
              this.userForm.reset();
              this.router.navigateByUrl("/homepage");
              this.isloading = false;
            }
            else {
              this.isloading = false;
              this.isLoadingIndividual = false;
              this.notifyService.toastrInfo(res.message);
            }
          },
          error: (err) => {
            this.notifyService.toastrInfo(err.message);
          },
        });

      }
      else {
        this.notifyService.toastrWarning("Your below 18 years old!");

      }


    } else if (this.selectedOption === 'I am below 18 years old') {
      this.notifyService.toastrWarning('I am below 18 years old. You are not eligible!');
    } else {
      this.notifyService.toastrWarning('Unknown option selected.');
    }

  }

  //clients
  onSubmitCompany(): void {
    if (this.companyForm.invalid) return;
    this.isLoadingCompany = true;
    // if (this.selectedOption === 'I am over 18 years old') {

    if (this.companyForm.valid) {
      const formData = this.companyForm.getRawValue();
      formData.contactno = `${formData.countryCode}${formData.contactno}`;

      this.signupService.signup(formData).subscribe({
        next: (res) => {
          if (res.success === true) {
            this.isloading = true;
            this.isLoadingCompany = false;
            this.notifyService.toastPopUp(res.message);
            this.companyForm.reset();
            this.router.navigateByUrl("/homepage");
            this.isloading = false;
          }
          else {
            this.isloading = false;
            this.isLoadingCompany = false;
            this.notifyService.toastrInfo(res.message);
          }
        },
        error: (err) => {
          this.notifyService.toastrInfo(err.message);
        },
      });

    }
    else {
      this.notifyService.toastrWarning("Your below 18 years old!");

    }


  }
  //  else if (this.selectedOption === 'I am below 18 years old') {
  //   this.notifyService.toastrWarning( 'I am below 18 years old. You are not eligible!');
  // } else {
  //   this.notifyService.toastrWarning('Unknown option selected.');
  // }

  // }
}

import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ProfessionalService } from 'src/app/services/SharedServices/professional.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';

@Component({
  selector: 'app-add-skills-ui',
  templateUrl: './add-skills-ui.component.html',
  styleUrls: ['./add-skills-ui.component.css']
})
export class AddSkillsUIComponent {

  constructor(private dataService: ProfessionalService,
    private alert:NotificationsService,public dialogRef: MatDialogRef<AddSkillsUIComponent>,
    private cvServices: CurriculumVitaeService, @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  separatorKeysCodes: number[] = [ENTER, COMMA];
  skillsCtrl = new FormControl('');

  skills: string[] = [];  // Array to store selected skills
  allSkills: string[] = [
    "Network Configuration",
    "Network Protocols (TCP/IP, UDP, HTTP, DNS, etc.)",
    "Network Security",
    "Firewall Management",
    "VPN Setup and Management",
    "Wi-Fi and LAN/WAN Configuration",
    "Cloud Networking",
    "Network Troubleshooting and Diagnostics",
    "Routing and Switching",
    "Load Balancing and Failover",
    "DNS Management",
    "Network Performance Optimization",
    "Network Automation",
    "Network Monitoring and Analysis",
    "QoS (Quality of Service) Management",
    "SDN (Software-Defined Networking)",
    "VLAN Configuration",
    "Network Virtualization",
    "IP Address Management (IPAM)",
    "Packet Analysis",
    "IT Specialist",
    "Front End Developer",
    "Back End Developer",
    "Full Stack Developer"
  ];

   @Output() saveData = new EventEmitter<string[]>(); // Output event for Save button

  btnSave:string = "Add";
  ngOnInit(): void {
    this.loadSkills();
  }

    loadSkills() {
    this.cvServices.getSkills().subscribe({
      next: (res) => {
        if (res.success == true) {
          this.skillsCtrl = res.data;
          console.log(this.skillsCtrl)
        } else {
          this.alert.toastrWarning(res.message);
        }
      }, 
      error: (err) => {
      //  console.error('API error:', err);
      },
    });
  }

  filteredSkills = this.skillsCtrl.valueChanges.pipe(
    startWith(null),
    map((skill: string | null) =>
      skill ? this._filter(skill) : this.allSkills.slice()
    )
  );

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add the skill if it's not already in the list
    if (value && !this.skills.includes(value)) {
      this.skills.push(value);
      this.save();  // Call passData after adding a skill
    }

    // Clear the input field after adding
    event.chipInput!.clear();
    this.skillsCtrl.setValue(null);
  }

  remove(skill: string): void {
    const index = this.skills.indexOf(skill);

    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (!this.skills.includes(value)) {
      this.skills.push(value);
     // this.passData();  // Call passData after selecting a skill
    }
    this.skillsCtrl.setValue(null);
  }

//   seminarList: any[] = [];
// submitForm(): void {
//   if (this.seminarForm.valid) {
//     this.seminarList = this.seminarArray.value;
//     this.dataService.setformSeminar(this.seminarList); // Save to the service or database
//     this.alert.toastrSuccess('Successfully Added.');
//     this.dialogRef.close(this.seminarList);
//   } else {
//     console.error('Form is invalid');
//   }
// }

  // passData(): void {
  //   const formattedSkills = this.skills.map(skill => ({ skills: skill }));
  //   console.log(formattedSkills);
  //   this.dataService.setformSkills(formattedSkills);
  //   this.alert.toastrSuccess("Successfully Added.");
  //   this.dialogRef.close(formattedSkills);
  // }

  save(): void {
  const skills = this.skills.map(skill => ({ skills: skill })); // ✅ key should be 'skills'
  console.log(skills);

  this.cvServices.saveSkills(skills).subscribe({
    next: (res) => {
      if (res.success) {
        this.alert.toastrSuccess(res.message);
        this.dialogRef.close(true);
        this.resetForm();
      } else {
        this.alert.toastrError(res.message);
      }
    },
    error: (err) => {
      console.error('Error saving skills:', err);
      this.alert.toastrError('Failed to save skills.');
    }
  });
}


 // Reset the form: clear skills array, reset the input control
 resetForm(): void {
  this.skills = [];  // Clear selected skills
  this.skillsCtrl.setValue('');  // Clear the input field
}
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allSkills.filter(skill => skill.toLowerCase().includes(filterValue));
  }
}

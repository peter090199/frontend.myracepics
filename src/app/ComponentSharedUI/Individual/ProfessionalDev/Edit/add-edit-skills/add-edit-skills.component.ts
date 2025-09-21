import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';

@Component({
  selector: 'app-add-edit-skills',
  templateUrl: './add-edit-skills.component.html',
  styleUrls: ['./add-edit-skills.component.css']
})
export class AddEditSkillsComponent implements OnInit {
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
  filteredSkills: string[] = [];
  skills: string[] = []; // final list of selected skills

  constructor(
    public dialogRef: MatDialogRef<AddEditSkillsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private alert: NotificationsService,
    private cvServices: CurriculumVitaeService
  ) {
    if (!this.data) {
      this.data = { skill: '' };
    }
  }

  ngOnInit(): void {
    this.filteredSkills = this.allSkills;
  }

  filterSkills(value: string): void {
    const filterValue = value ? value.toLowerCase() : '';
    this.filteredSkills = this.allSkills.filter((skill) =>
      skill.toLowerCase().includes(filterValue)
    );
  }

  onSkillSelected(event: any): void {
    if (event.option && event.option.value) {
      const selectedSkill = event.option.value;
      if (!this.skills.includes(selectedSkill)) {
        this.skills.push(selectedSkill); // add unique skill to list
      }
      this.data.skill = ''; // reset input field
    }
  }

  removeSkill(index: number): void {
    this.skills.splice(index, 1);
  }

  updateSkill(): void {
    const payload = {
      skills: this.data.skills   // make sure this.data has { id, skills }
    };

    //console.log('Payload sending to backend:',this.data.id," ", payload);

    this.cvServices.updateSkills(this.data.id, payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.alert.toastrSuccess(res.message);
          this.dialogRef.close(true);
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

  // updateSkillsxx(): void {
  //   console.log('Payload sending to backend:', this.data);
  //   // return;
  //   this.cvServices.updateSkills(this.data).subscribe({

  //     next: (res) => {
  //       if (res.success) {
  //         this.alert.toastrSuccess(res.message);
  //         this.dialogRef.close(true);
  //       } else {
  //         this.alert.toastrError(res.message);
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error saving skills:', err);
  //       this.alert.toastrError('Failed to save skills.');
  //     }
  //   });
  // }
}

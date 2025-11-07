import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-save-jobs',
  templateUrl: './save-jobs.component.html',
  styleUrls: ['./save-jobs.component.css']
})
export class SaveJobsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

  // Input: currently selected job
  @Input() selectedJob: any;

  // Input: list of saved jobs (can be static)
  @Input() savedJobs: any[] = [
    {
      transNo: '001',
      job_name: 'Frontend Developer',
      comp_name: 'TechCorp',
      work_type: 'Full-time',
      job_image: 'assets/images/company1.png'
    },
    {
      transNo: '002',
      job_name: 'Backend Developer',
      comp_name: 'DevSolutions',
      work_type: 'Part-time',
      job_image: 'assets/images/company2.png'
    },
    {
      transNo: '003',
      job_name: 'UI/UX Designer',
      comp_name: 'Creative Minds',
      work_type: 'Freelance',
      job_image: 'assets/images/company3.png'
    }
  ];

  // Emit events to parent when a job is clicked or removed
  @Output() toggleSave = new EventEmitter<any>();

  // Select a job
  onJobClick(job: any) {
    this.selectedJob = job;
    this.toggleSave.emit(job); // notify parent
  }

  // Remove a job
  removeJob(job: any, event: Event) {
    event.stopPropagation(); 
    this.savedJobs = this.savedJobs.filter(j => j.transNo !== job.transNo);
    if (this.selectedJob?.transNo === job.transNo) this.selectedJob = null;
    this.toggleSave.emit({ ...job, remove: true });
  }

  // Check if job is selected
  isSelected(job: any): boolean {
    return this.selectedJob?.transNo === job.transNo;
  }
}

import { Component, OnInit } from '@angular/core';
interface Job {
  companyName: string;
  companyLogo?: string;
  position: string;
  location: string;
  jobType: string; // Full-time, Part-time, Remote, etc.
  postedDate: Date;
  applyUrl?: string;
}

@Component({
  selector: 'app-jobs-client',
  templateUrl: './jobs-client.component.html',
  styleUrls: ['./jobs-client.component.css']
})
export class JobsClientComponent implements OnInit {

  jobsList: Job[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs() {
    // Sample job data (replace with API call if needed)
    this.jobsList = [
      {
        companyName: 'TechCorp Solutions',
        companyLogo: 'assets/images/techcorp.png',
        position: 'Frontend Developer',
        location: 'Iloilo City, Philippines',
        jobType: 'Full-time',
        postedDate: new Date('2025-11-10'),
        applyUrl: 'https://techcorp.com/apply/frontend'
      },
      {
        companyName: 'DevSolutions Inc.',
        companyLogo: 'assets/images/devsolutions.png',
        position: 'Backend Developer',
        location: 'Remote',
        jobType: 'Remote',
        postedDate: new Date('2025-11-12'),
        applyUrl: 'https://devsolutions.com/careers/backend'
      },
      {
        companyName: 'Startup Hub',
        companyLogo: 'assets/images/startuphub.png',
        position: 'UI/UX Designer',
        location: 'Makati, Philippines',
        jobType: 'Part-time',
        postedDate: new Date('2025-11-15'),
        applyUrl: 'https://startuphub.com/jobs/uiux'
      },
      {
        companyName: 'GlobalTech',
        companyLogo: 'assets/images/globaltech.png',
        position: 'Full Stack Developer',
        location: 'Cebu City, Philippines',
        jobType: 'Full-time',
        postedDate: new Date('2025-11-17'),
        applyUrl: 'https://globaltech.com/apply/fullstack'
      }
    ];
    // Sort by latest posted date
    this.jobsList.sort((a, b) => b.postedDate.getTime() - a.postedDate.getTime());

  }

  openJobApply(job: Job) {
    if (job.applyUrl) {
      window.open(job.applyUrl, '_blank');
    }
  }
}

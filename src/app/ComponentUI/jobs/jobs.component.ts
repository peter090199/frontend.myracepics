import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { JobListService } from 'src/app/services/Jobs/job-list.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  // jobs = [
  //   {
  //     title: 'Junior to Mid-Level Front-End Developer',
  //     company: 'Somewhere',
  //     location: 'Philippines (Remote)',
  //     status: 'Promoted',
  //     logo: 'assets/company1.png'
  //   },
  //   {
  //     title: 'React Developer',
  //     company: 'Home Credit Philippines',
  //     location: 'Taguig, NCR, Philippines (Hybrid)',
  //     status: 'Actively reviewing applicants',
  //     logo: 'assets/company2.png'
  //   },
  //   {
  //     title: 'Vue.js Frontend Developer',
  //     company: 'PickFans',
  //     location: 'Philippines (Remote)',
  //     status: 'Actively reviewing applicants',
  //     logo: 'assets/company3.png'
  //   }
  // ];
  jobs: any = [];
  success: boolean = false;
  isLoading: boolean = false;
  recentSearch = {
    term: 'software engineer',
    count: 139,
    location: 'Calgary, Alberta, Canada'
  };

  constructor(private jobListServices: JobListService) { }
  ngOnInit(): void {
    this.getJobPosting();
  }


  async getJobPosting(): Promise<void> {
    try {
      this.isLoading = true;
      const res = await firstValueFrom(this.jobListServices.getActiveJobs());
      if (res.success) {
        this.success == true;
        this.jobs = res.data.map((job: any) => ({
          ...job,
          job_image: job.job_image
            ? `https://lightgreen-pigeon-122992.hostingersite.com${job.job_image}`
            : null
        }));

      } else {
        this.success = false;
      }

    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      this.isLoading = false;
    }
  }

  removeJob(job: any) {
    this.jobs = this.jobs.filter((j: any) => j !== job);
  }

  clearSearches() {
    this.recentSearch = { term: '', count: 0, location: '' };
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { JobListService } from 'src/app/services/Jobs/job-list.service';

@Component({
  selector: 'app-jobs-profile',
  templateUrl: './jobs-profile.component.html',
  styleUrls: ['./jobs-profile.component.css']
})
export class JobsProfileComponent implements OnInit {
  jobs: any[] = [];
  success = false;
  isLoading = false;
  selectedJob: any = null;

  recentSearch = {
    term: 'software engineer',
    count: 139,
    location: 'Calgary, Alberta, Canada'
  };

  skeletonRows = Array.from({ length: 5 });

  constructor(
    private jobListServices: JobListService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getJobPosting();

    // ✅ After jobs are loaded, check the route param
    const transNo = this.route.snapshot.paramMap.get('transNo');
    if (transNo) {
      this.selectedJob = this.jobs.find(job => job.transNo == transNo) || null;
    }
  }

  async getJobPosting(): Promise<void> {
    try {
      this.isLoading = true;
      const res = await firstValueFrom(this.jobListServices.getActiveJobs());

      if (res.success) {
        this.jobs = res.data.map((job: any) => ({
          ...job,
          job_image: job.job_image
            ? `https://lightgreen-pigeon-122992.hostingersite.com${job.job_image}`
            : null
        }));
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      this.isLoading = false;
    }
  }

  removeJob(job: any) {
    this.jobs = this.jobs.filter(j => j !== job);
    if (this.selectedJob?.transNo === job.transNo) {
      this.selectedJob = null;
    }
  }

  clearSearches() {
    this.recentSearch = { term: '', count: 0, location: '' };
  }

  selectJob(job: any) {
    this.selectedJob = job;
  }
}

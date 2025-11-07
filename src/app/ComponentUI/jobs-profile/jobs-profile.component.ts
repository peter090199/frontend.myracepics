import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private route: ActivatedRoute, private router: Router
  ) { }



  closeSidebar() {
    this.selectedJob = null;
  }

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate(['/recommended-jobs', this.selectedJob.transNo]);
  }

  goToJob(job: any) {
    // Navigate programmatically
    this.router.navigate(['/recommended-jobs', job.transNo]);

    // Optional: select job to show sidebar
    this.selectedJob = job;
  }



  savedJobs: any;
  // Handle save/un-save or select job from child component
  toggleSaveJob(job: any) {
    if (!job) return;

    // Remove job
    if (job.remove) {
      this.savedJobs = this.savedJobs.filter((j: { transNo: any; }) => j.transNo !== job.transNo);
      if (this.selectedJob?.transNo === job.transNo) this.selectedJob = null;
      return;
    }

    // Add job if not saved
    const index = this.savedJobs.findIndex((j: { transNo: any; }) => j.transNo === job.transNo);
    if (index === -1) {
      this.savedJobs.push(job);
      this.selectedJob = job; // Optional: select it
    } else {
      // Highlight existing saved job
      this.selectedJob = job;
    }
  }



}

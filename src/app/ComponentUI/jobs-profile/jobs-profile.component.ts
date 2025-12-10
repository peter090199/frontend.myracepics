import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { JobListService } from 'src/app/services/Jobs/job-list.service';
import { AuthService } from 'src/app/services/auth.service';

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
    private route: ActivatedRoute, private router: Router,
    private authService: AuthService
  ) { }

  saved = false;

  toggleHeart() {
    this.saved = !this.saved;
  }
  getStatusIcon(status: string | undefined): string {
    switch (status) {
      case 'default': return 'send';
      case 'applied_active': return 'hourglass_top';         // user applied and active
      case 'review': return 'hourglass_top';        // under review
      case 'reject': return 'close';                // rejected
      case 'approved': return 'check_circle';       // approved
      default: return 'send';                       // not applied / default
    }
  }

  getStatusText(status: string | undefined): string {
    switch (status) {
      case 'applied_active': return 'Pending';
      case 'review': return 'Under Review';
      case 'reject': return 'Rejected';
      case 'approved': return 'Approved';
      default: return 'Apply Now';                  // not applied / default
    }
  }


  getStatusColor(status: string | undefined): string {
    switch (status) {
      case 'default': return '#3071e0ff';
      case 'applied_active': return '#ec4a04ff';        // blue
      case 'review': return '#ffb300';        // yellow / amber
      case 'reject': return '#d32f2f';        // red
      case 'approved': return '#388e3c';      // green
      default: return '#1976d2';              // default blue
    }
  }

  closeSidebar() {
    this.selectedJob = null;
  }

  currentUserCode: any;
  async ngOnInit(): Promise<void> {
    const ownCode = this.authService.getAuthCode(); // get logged-in user
    if (ownCode) {
      this.currentUserCode = ownCode;
      console.log(this.currentUserCode);
    }

    await this.getJobPosting();

    // ✅ After jobs are loaded, check the route param
    const transNo = this.route.snapshot.paramMap.get('transNo');
    if (transNo) {
      this.selectedJob = this.jobs.find(job => job.transNo == transNo) || null;
    }
     await this.loadAppliedStatus(this.selectedJob);
  }

  getButtonStatus(job: any): string {
    if (!job) return 'default';
    return job.code === this.currentUserCode ? 'default' : job.applied_status;
  }


  async getJobPosting(): Promise<void> {
    try {
      this.isLoading = true;
      const res = await firstValueFrom(this.jobListServices.getActiveJobs());

      if (res.success) {
        this.jobs = res.data.map((job: any) => ({
          ...job,
          job_image: job.job_image
            ? `https://exploredition.com${job.job_image}`
            : null
        }));
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      this.isLoading = false;
    }
  }


  async loadAppliedStatus(job: any) {
    if (!job?.transNo) return;

    try {
      const res = await firstValueFrom(
        this.jobListServices.getAppliedStatus(job.transNo)
      );

      if (res.success) {
        job.applied_status = res.applied_status;  // 🔥 Set status to the job
        this.selectedJob = job;                    // Update sidebar UI
      } else {
        job.applied_status = 'default';            // If job not applied
      }
    } catch (error) {
      job.applied_status = 'default';              // Fallback
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

  async selectJob(job: any) {
    this.selectedJob = job;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate(['/recommended-jobs', this.selectedJob.transNo]);
    // 🔥 NEW: Fetch applied_status for this transNo
    await this.loadAppliedStatus(job);
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

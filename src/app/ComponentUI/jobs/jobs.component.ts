import { Component, OnInit, Renderer2 } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { JobListService } from 'src/app/services/Jobs/job-list.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  jobs: any = [];
  success: boolean = false;
  isLoading: boolean = false;
    isSidebarActive = false;

  recentSearch = {
    term: 'software engineer',
    count: 139,
    location: 'Calgary, Alberta, Canada'
  };

  constructor(private jobListServices: JobListService,private renderer: Renderer2

  ) { }
  skeletonRows = Array.from({ length: 5 });
  ngOnInit(): void {
    this.getJobPosting();
  }


  async getJobPosting(): Promise<void> {
    try {
      this.isLoading = true;
      const res = await firstValueFrom(this.jobListServices.getActiveJobs());
      if (res.success) {
        this.isLoading = false;
        this.jobs = res.data.map((job: any) => ({
          ...job,
          job_image: job.job_image
            ? `https://lightgreen-pigeon-122992.hostingersite.com${job.job_image}`
            : null
        }));

      } else {
        this.isLoading = false;
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

  openSidebar() {
    this.isSidebarActive = true;
    const sidebar = document.querySelector('.leftsidebar') as HTMLElement;
    const overlay = document.querySelector('.sidebar-overlay') as HTMLElement;

    if (sidebar && overlay) {
      sidebar.classList.add('active');
      overlay.classList.add('active');
    }
  }

  // Close sidebar (remove 'active' class)
  closeSidebar() {
    this.isSidebarActive = false;
    const sidebar = document.querySelector('.leftsidebar') as HTMLElement;
    const overlay = document.querySelector('.sidebar-overlay') as HTMLElement;

    if (sidebar && overlay) {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    }
  }


}

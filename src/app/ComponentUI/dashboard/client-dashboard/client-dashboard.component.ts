import { Component, OnInit } from '@angular/core';
import { forkJoin, firstValueFrom } from 'rxjs';
import { JobListService } from 'src/app/services/Jobs/job-list.service';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {

  totalVacancies: number = 0;
  totalApplicants: number = 0;
  totalPendingReviews: number = 0;
  totalhired: number = 0;

  displayedColumns = ['job', 'applicants', 'status', 'actions'];
  isLoading: boolean = false;

  constructor(private activeJobs: JobListService) { }

  ngOnInit(): void {
    this.loadDashboardCounts();
  }

  /**
   * Load all dashboard counts in parallel (FAST)
   */
  async loadDashboardCounts(): Promise<void> {
    try {
      this.isLoading = true;

      const [vacanciesRes, appliedRes, totalpendingreview, totalhired] = await firstValueFrom(
        forkJoin([
          this.activeJobs.getJobVacanciesByCode(), // vacancies count
          this.activeJobs.getAppliedJobCount(),         // applicants count
          this.activeJobs.getPendingReviews(),
          this.activeJobs.getHired()
        ])
      );

      if (vacanciesRes?.success) {
        this.totalVacancies = vacanciesRes.total;
      }

      if (appliedRes?.success) {
        this.totalApplicants = appliedRes.total; // ✅ FIXED
      }

      if (totalpendingreview?.success) {
        this.totalPendingReviews = totalpendingreview.total; // ✅ FIXED
      }

      if (totalhired?.success) {
        this.totalhired = totalhired.total; // ✅ FIXED
      }

    } catch (error) {
      console.error('Error loading dashboard counts:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Sample table data (can be removed later)
  vacancies = [
    { title: 'Frontend Developer', applicants: 45, status: 'Active' },
    { title: 'Backend Developer', applicants: 62, status: 'Active' },
    { title: 'UI/UX Designer', applicants: 21, status: 'Closed' }
  ];
}

import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-page-not-found-component',
  templateUrl: './page-not-found-component.component.html',
  styleUrls: ['./page-not-found-component.component.css']
})
export class PageNotFoundComponentComponent implements OnInit, OnDestroy {
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;

  private countdownInterval: any;
  private targetDate: Date = new Date('2025-12-31T23:59:59'); // 🎯 Set launch date

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = this.targetDate.getTime() - now;

      if (distance <= 0) {
        clearInterval(this.countdownInterval);
        this.days = this.hours = this.minutes = this.seconds = 0;
      } else {
        this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
        this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
      }
    }, 1000);
  }
}


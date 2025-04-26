import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, timer } from 'rxjs';
import { switchMapTo } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class InactivityService {
  timeoutInMs = 5 * 60 * 1000; // 5 minutes

  constructor(private router: Router) {}

  startWatching() {
    merge(
      fromEvent(window, 'mousemove'),
      fromEvent(window, 'keydown'),
      fromEvent(window, 'click'),
      fromEvent(window, 'scroll')
    )
      .pipe(
        switchMapTo(timer(this.timeoutInMs))
      )
      .subscribe(() => {
        sessionStorage.clear();
        localStorage.removeItem('chatmessages');
        this.router.navigate(['/homepage']);
      });
  }
}

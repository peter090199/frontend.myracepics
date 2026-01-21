import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-google-call-back',
  template: `<p>Signing you in...</p>`,
  styleUrls: ['./google-call-back.component.css']
})
export class GoogleCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 🔐 Read query params once
    const token  = this.route.snapshot.queryParamMap.get('token');
    const role   = this.route.snapshot.queryParamMap.get('role');
    const userId = this.route.snapshot.queryParamMap.get('user_id');

    // ❌ Invalid callback
    if (!token) {
      sessionStorage.clear();
      this.router.navigate(['/login']);
      return;
    }

    // ✅ Store session
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('role', role ?? '');
    sessionStorage.setItem('is_online', 'true');

    if (userId) {
      sessionStorage.setItem('user_id', userId);
    }

    // ✅ ROLE-BASED REDIRECT (YOUR LOGIC)
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin/admin-dashboard']);
        break;

      case 'masteradmin':
        this.router.navigate(['/masteradmin/admin-dashboard']);
        break;

      case 'photographer':
        this.router.navigate(['/photographer/allevents']);
        break;

      case 'runner':
        this.router.navigate(['/runner/allevents']);
        break;

      default:
        this.router.navigate(['/']); // fallback
    }
  }
}

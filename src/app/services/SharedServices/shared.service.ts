import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() {}

  getSettingsUrl(profile: any): string {
    if (!profile) return '/profile';

    switch (profile.role_code) {
      case 'DEF-CLIENT':
        return `/recruiter/settings`;
      case 'DEF-MASTERADMIN':
        return `/masteradmin/settings`;
      case 'DEF-ADMIN':
        return `/admin/settings`;
      default:
        return `/profile/settings`;
    }
  }

  getProfileUrl(profile: any): string {
    if (!profile) return '/recruiter/profile';

    const code = profile.code || ''; // adjust based on your API

    switch (profile.role_code) {
      case 'DEF-CLIENT':
        return `/recruiter/client_profile/${code}`;
      case 'DEF-MASTER-ADMIN':
        return `/masteradmin/profile/${code}`;
      case 'DEF-ADMIN':
        return `/admin/profile/${code}`;
      default:
        return `/recruiter/profile/${code}`;
    }
  }

  getProfileUrlBycode(code: any): string {
    if (!code) return '/profile';
    switch (code) {
      case 'DEF-USERS':
        return `/recruiter/profile/${code}`;
      case 'DEF-MASTER-ADMIN':
        return `/masteradmin/profile/${code}`;
      case 'DEF-ADMIN':
        return `/admin/profile/${code}`;
      default:
        return `/profile/${code}`;
    }
  }

  
}

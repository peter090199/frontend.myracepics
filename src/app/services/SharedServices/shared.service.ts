import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  eventProfileLink(event: any): any[] {
    const role = sessionStorage.getItem('role');

    const roleRouteMap: any = {
      runner: 'runner',
      admin: 'admin',
      masteradmin: 'masteradmin',
      photographer: 'photographer'
    };

    const baseRoute = roleRouteMap[role ?? ''] ?? 'homepage';
    return ['/', baseRoute, 'eventprofile', event.title, event.uuid];
  }

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


  /**
   * Check if the event date is more than 4 days ago
   * @param eventDate string or Date
   * @returns true if expired
   */
  isEventExpired1(eventDate: string | Date): boolean {
    const event = new Date(eventDate);
    const now = new Date();

    const diffInDays =
      (now.getTime() - event.getTime()) / (1000 * 60 * 60 * 24);

    return diffInDays > 4;
  }

  /**
   * Get tooltip message for expired events
   * @param eventDate string or Date
   * @returns tooltip string if expired, empty otherwise
   */
  getExpiredTooltip1(eventDate: string | Date): string {
    return this.isEventExpired1(eventDate)
      ? 'Event is more than 4 days ago. Upload is disabled.'
      : '';
  }



  getEventStatusxx(eventDate: string | Date): 'completed' | 'today' | 'upcoming' {
    const today = new Date();
    const event = new Date(eventDate);

    // Completed if more than 4 days ago
    const diffTime = today.getTime() - event.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays > 4) return 'completed';
    if (
      today.getFullYear() === event.getFullYear() &&
      today.getMonth() === event.getMonth() &&
      today.getDate() === event.getDate()
    ) return 'today';

    return 'upcoming';
  }

  getEventTooltipxx(eventDate: string | Date): string {
    const status = this.getEventStatusxx(eventDate);
    if (status === 'completed') return 'Event is more than 4 days ago. Upload is disabled.';
    if (status === 'today') return 'Event is today! You can upload photos.';
    return 'Upcoming event';
  }

  getEventStatus(eventDate: string | Date): 'completed' | 'today' | 'upload' | 'upcoming' {
    const today = new Date();
    const event = new Date(eventDate);

    // Difference in days
    const diffTime = today.getTime() - event.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 4) return 'completed';       // More than 4 days ago
    if (diffDays >= 1 && diffDays <= 3) return 'upload';  // 1 to 3 days ago
    if (
      today.getFullYear() === event.getFullYear() &&
      today.getMonth() === event.getMonth() &&
      today.getDate() === event.getDate()
    ) return 'today';                            // Today
    if (diffDays < 0) return 'upcoming';        // Future event

    return 'upcoming';
  }

  getEventTooltip(eventDate: string | Date): string {
    const status = this.getEventStatus(eventDate);
    switch (status) {
      case 'completed': return 'Event is more than 4 days ago. Upload is disabled.';
      case 'upload': return 'Event was 1–3 days ago. Upload is allowed.';
      case 'today': return 'Event is today! You can upload photos.';
      case 'upcoming': return 'Upcoming event. Upload not allowed yet.';
    }
  }



}

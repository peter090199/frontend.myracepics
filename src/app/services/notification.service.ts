// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';
// import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';
// import { _url } from 'src/global-variables';

// @Injectable({
//   providedIn: 'root',
// })
// export class NotificationService {

//   private echo: Echo<any>;
//   private unreadCountSubject = new BehaviorSubject<number>(0); // Controls count stream
//   public unreadCount$ = this.unreadCountSubject.asObservable(); // Public observable

//   private notificationSub!: Subscription;
//    userId: number = 0;

//   constructor(private http: HttpClient) {
//     // Setup Pusher
//      (window as any).Pusher = Pusher;
//     this.echo = new Echo({
//       broadcaster: 'pusher',
//       key: 'e0cd7653f3ae9bbbd459', // Replace with actual key
//       cluster: 'ap1',
//       forceTLS: true,
//     });

//     // this.initRealtimeConnection();
//     this.startNotificationPolling(); 
//   }

//   private(channel: string) {
//     return this.echo.private(channel); // Returning an Echo private channel
//   }
  
//   private initRealtimeConnection(): void {
//     const storedId = localStorage.getItem('userId');
//     if (storedId) {
//       const userId = parseInt(storedId, 10);
//       this.listenForNotifications(userId);
//     } else {
//       console.warn('User ID not found in localStorage');
//     }
//   }

//   // Get current unread count
//   getUnreadCount(): Observable<number> {
//     return this.unreadCountSubject.asObservable();
//   }

//  // private unreadCountSubject = new BehaviorSubject<{ unreadCount: number }>({ unreadCount: 0 });
//   public unreadCount2$ = this.unreadCountSubject.asObservable();
  
//   // Real-time listener using Echo + Pusher
//     listenForNotifications(userId: number) {
//       this.echo.private(`user.${userId}`) // Listen on the private channel for the user
//         .listen('notifications.count', (event: { unreadCount: number }) => {
//           console.log('New unread count:', event.unreadCount);
//           this.unreadCountSubject.next(event.unreadCount); // Update the unread count in the service
//         });
//     }


//   // Optional: Stop listening
//   unsubscribeFromNotifications() {
//     this.echo.leave(`user.${this.userId}`);
//   }

//   startNotificationPolling() {
//     if (this.notificationSub) return; 
  
//     this.notificationSub = interval(2000).subscribe(() => {
//       this.getNotifications().subscribe(count => {
//         this.unreadCountSubject.next(count);
//       });
//     });
//   }



//   ngOnDestroy() {
//     if (this.notificationSub) {
//       this.notificationSub.unsubscribe(); // Clean up
//     }
//   }
  
//   // HTTP call to get unread count
//   getNotifications(): Observable<number> {
//     const headers = new HttpHeaders({
//       'Authorization': `Bearer ${localStorage.getItem('token')}`
//     });
//     return this.http.get<number>(`${_url}update_count`, { headers });
//   }


// }


import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private pusher = new Pusher('e0cd7653f3ae9bbbd459', {
    cluster: 'ap1',
  });

  private channel = this.pusher.subscribe('message.sent');
  // Track notifications per user
  private notificationCounts = new BehaviorSubject<{ [key: string]: number }>({}); 
  notificationCounts$ = this.notificationCounts.asObservable();

  private count = new BehaviorSubject<number>(0);
  count$ = this.count.asObservable();

  constructor() {
    const channel = this.pusher.subscribe('message.sent');

    channel.bind('chat', (data: any) => {
      console.log('New message data received:', data.message);

      // Check if data contains sender and receiver IDs
      const userId = data.receiverId;  // Assuming receiverId is passed in the broadcasted event
      const currentCounts = this.notificationCounts.value;

      // Increment the notification count for the user
      currentCounts[userId] = (currentCounts[userId] || 0) + 1;
      this.notificationCounts.next({ ...currentCounts });
    });
  }

  resetCount() {
    this.count.next(0); // Call this when the user opens the dropdown
  }
}

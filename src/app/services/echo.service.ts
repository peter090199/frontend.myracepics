import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { BehaviorSubject, interval, Observable, takeUntil } from 'rxjs';
import { _url } from 'src/global-variables';


@Injectable({
  providedIn: 'root'
})
export class EchoService {
  private echo: Echo<any>;
  userId: number = 0;
  private previousUnreadCount = 0;

  private notificationCountSubject = new BehaviorSubject<number>(0);
  notificationCount$ = this.notificationCountSubject.asObservable();

  private readonly countsSubject = new BehaviorSubject<any>({ unread: 0, read: 0 });
  private stopPolling$ = new BehaviorSubject<boolean>(false);

  // ✅ Notification audio
  private notificationAudio = new Audio('assets/sounds/notification.mp3');

  constructor(private http: HttpClient

  ) {
    this.userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
    console.log('🔑 User ID:', this.userId);

    // 🔊 Configure notification audio
    this.notificationAudio.volume = 0.8;
    this.notificationAudio.load();

    // 🔗 Setup Echo with Pusher
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: 'e0cd7653f3ae9bbbd459',
      cluster: 'ap1',
      forceTLS: true,
    });

    // 📢 Listen to public notification (optional)
    this.echo.channel('notification.count')
      .listen('notifications', (data: any) => {
        console.log('📢 Public Notification:', data);
        this.playNotificationSoundIfNeeded(data.unreadCount);
      });

    // 🔔 Listen to user-specific notifications
    this.listenToNotificationCount();
  }

  listenToNotificationCount() {
    this.echo.channel(`notification.count.${this.userId}`)
      .listen('.NotificationCountUpdated', (data: any) => {
        console.log('📬 Private Notification Count Update:', data);
        this.notificationCountSubject.next(data.unreadCount);
        this.playNotificationSoundIfNeeded(data.unreadCount);
      });


    // 📥 Initial load from backend
    this.getMessageCount().subscribe({
      next: (res) => {
        this.notificationCountSubject.next(res.unreadCount);
        this.previousUnreadCount = res.unreadCount;
      },
      error: (err) => {
        console.error('❌ Error fetching count:', err);
      }
    });

    this.loadRealtimeCounts();
  }

  getMessageCount(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
    return this.http.get<any>(`${_url}update_count`, { headers });
  }

  getCounts$() {
    return this.countsSubject.asObservable();
  }

  loadRealtimeCounts(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
    return this.http.get<any>(`${_url}update_count`, { headers });
  }

  startPolling() {
    interval(2000)
      .pipe(takeUntil(this.stopPolling$))
      .subscribe(() => {
        this.loadRealtimeCounts();
      });
  }

  stopPolling() {
    this.stopPolling$.next(true);
  }

  // ✅ Play sound only if new notifications are received
  private playNotificationSoundIfNeeded(currentUnreadCount: number) {
    if (currentUnreadCount > this.previousUnreadCount) {
      this.notificationAudio.currentTime = 0;
      this.notificationAudio.play().catch((err) => {
        console.warn('🔇 Audio autoplay blocked or failed:', err);
      });
    }
    this.previousUnreadCount = currentUnreadCount;
  }
}

// import { HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';
// import { HttpClient } from '@angular/common/http';
// import { _url } from 'src/global-variables';
// import { BehaviorSubject, interval, Observable, takeUntil } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class EchoService {
//   private echo: Echo<any>;
//   userId:number = 0;
//   notificationCount: number = 0;
//   private notificationCountSubject = new BehaviorSubject<number>(0);
//   notificationCount$ = this.notificationCountSubject.asObservable();
  
//   private readonly countsSubject = new BehaviorSubject<any>({ unread: 0, read: 0 });
//   private stopPolling$ = new BehaviorSubject<boolean>(false);
//   private notificationAudio = new Audio('assets/sounds/notification.mp3'); // 👈 audio object

//   constructor(private http:HttpClient,) {
//     this.userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
//     console.log(this.userId)

//     this.echo = new Echo({
//       broadcaster: 'pusher',
//       key: 'e0cd7653f3ae9bbbd459',
//       cluster: 'ap1', 
//       forceTLS: true,
//     });

//     this.echo.channel('notification.count')
//       .listen('notifications', (data: any) => {
//         this.notificationCount = data.unreadCount;
//         console.log( data.unreadCount)
//         this.playNotificationSound(); // 👈 play sound
//       });

//       this.listenToNotificationCount();
//    }

//    playNotificationSound() {
//     this.notificationAudio.currentTime = 0; // rewind to start
//     this.notificationAudio.play().catch((err) => {
//       console.warn('🔇 Unable to play notification sound:', err);
//     });
//   }
//   listenToNotificationCount() {
//     this.echo.channel(`notification.count.${this.userId}`)
//       .listen('.NotificationCountUpdated', (data: any) => {
//         console.log('🔄 Realtime Count Update:', data);
//         this.notificationCountSubject.next(data.unreadCount);
//       });

//       this.getMessageCount().subscribe({
//         next: (res) => {
//           this.notificationCountSubject.next(res.unreadCount);
//         },
//         error: (err) => {
//           console.error('❌ Error fetching count:', err);
//         }
//       });
      
//   }

//   getMessageCount(): Observable<any> {
//     const headers = new HttpHeaders({
//       'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Include auth token
//     });
//     return this.http.get<any>(`${_url}update_count`,{headers});
//   }

//   getCounts$() {
//     return this.countsSubject.asObservable();
//   }

//   loadRealtimeCounts() {
//     this.http.get<any>(`${_url}update_count`).subscribe((counts) => {
//       this.countsSubject.next(counts);
//     });
//   }

//   startPolling() {
//     interval(2000)
//       .pipe(takeUntil(this.stopPolling$)) // Stop when we unsubscribe or when dialog closes
//       .subscribe(() => {
//         this.loadRealtimeCounts();
//       });
//   }

//   stopPolling() {
//     this.stopPolling$.next(true);
//   }
  
// }
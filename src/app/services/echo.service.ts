
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { HttpClient } from '@angular/common/http';
import { _url } from 'src/global-variables';
import { BehaviorSubject, interval, Observable, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EchoService {
  private echo: Echo<any>;
  userId:number = 0;
  notificationCount: number = 0;
  private notificationCountSubject = new BehaviorSubject<number>(0);
  notificationCount$ = this.notificationCountSubject.asObservable();
  
  private readonly countsSubject = new BehaviorSubject<any>({ unread: 0, read: 0 });
  private stopPolling$ = new BehaviorSubject<boolean>(false);

  constructor(private http:HttpClient,) {
    this.userId = parseInt(localStorage.getItem('userId') || '0', 10);
    console.log(this.userId)

    this.echo = new Echo({
      broadcaster: 'pusher',
      key: 'e0cd7653f3ae9bbbd459',
      cluster: 'ap1', 
      forceTLS: true,
    });

  //   this.echo.channel('notification.count')
  //     .listen('notifications', (data: any) => {
  //       this.notificationCount = data.unreadCount;
  //       console.log( data.unreadCount)
  //     });


   }


  listenToNotificationCount() {
    this.echo.channel(`notification.count.${this.userId}`)
      .listen('.NotificationCountUpdated', (data: any) => {
        console.log('🔄 Realtime Count Update:', data);
        this.notificationCountSubject.next(data.unreadCount);
      });

      this.getMessageCount().subscribe({
        next: (res) => {
          this.notificationCountSubject.next(res.unreadCount);
        },
        error: (err) => {
          console.error('❌ Error fetching count:', err);
        }
      });
      
  }

  getMessageCount(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Include auth token
    });
    return this.http.get<any>(`${_url}update_count`,{headers});
  }

  getCounts$() {
    return this.countsSubject.asObservable();
  }

  loadRealtimeCounts() {
    this.http.get<any>(`${_url}update_count`).subscribe((counts) => {
      this.countsSubject.next(counts);
    });
  }

  startPolling() {
    interval(2000)
      .pipe(takeUntil(this.stopPolling$)) // Stop when we unsubscribe or when dialog closes
      .subscribe(() => {
        this.loadRealtimeCounts();
      });
  }

  stopPolling() {
    this.stopPolling$.next(true);
  }
  
  
  // listen() {
  //   this.echo.channel(`chat.${this.receiverId}`)
  //     .listen('.message.sent', (data: any) => {
  //       this.notificationCount++;  
  //       console.log('Public message received for receiver ID:', this.receiverId, data.message);
  //       console.log('Notification Count:', data.unreadCount);
  //     });
  // }
  
  

}



// import { Injectable } from '@angular/core';
// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class EchoService {
//   private echo: Echo<any>;

//   // ✅ Unread Messages Count (Persistent)
//   private unreadMessagesCount = new BehaviorSubject<number>(this.getStoredCount('unreadMessagesCount'));
//   unreadMessages$ = this.unreadMessagesCount.asObservable();

//   // ✅ Notifications Count (Persistent)
//   private notificationCountSubject = new BehaviorSubject<number>(this.getStoredCount('notificationCount'));
//   notificationCount$ = this.notificationCountSubject.asObservable();

//   // ✅ Total Unread Notifications (Messages + Notifications)
//   private totalUnreadSubject = new BehaviorSubject<number>(this.getStoredCount('totalUnread'));
//   totalUnread$ = this.totalUnreadSubject.asObservable();

//   constructor() {
//     (window as any).Pusher = Pusher;

//     this.echo = new Echo({
//       broadcaster: 'pusher',
//       key: 'e0cd7653f3ae9bbbd459', // Replace with your Pusher Key
//       cluster: 'ap1', // Match your Pusher region
//       forceTLS: true,
//     });

//     // ✅ Debug Connection Status
//     this.echo.connector.pusher.connection.bind('connected', () => {
//       console.log('✅ Laravel Echo Connected!');
//     });

//     this.echo.connector.pusher.connection.bind('error', (err: any) => {
//       console.error('❌ Pusher Connection Error:', err);
//     });

//     // const storedId = localStorage.getItem('userId');
//     // if (storedId) {
//     //   const userId = parseInt(storedId, 10);
//     //   this.listenToNotifications(userId);
//     // } else {
//     //   console.warn('User ID not found in localStorage');
//     // }

//     // ✅ Listen to real-time updates
//    // this.listenToMessages();
//   }

//   // ✅ Listen for Real-Time Messages
//   listenToMessages() {
//     this.echo.channel('chat').listen('.message.sent', (data: any) => {
//       console.log(data);
//       this.incrementMessageCount();
//     });
//   }

//   // ✅ Listen for Real-Time Notifications
//   listenToNotificationsxx() {
//     this.echo.channel('chat').listen('.message.sent', (data: any) => {
//       console.log('🔔 New Notification:', data);
//       // Assuming 'data.unreadCount' contains the updated count
//       this.notificationCountSubject.next(data.unreadCount);  // Update the unread count
//     });
//   }

//   listenToNotifications(userId: number) {
//     this.echo.private(`user.${userId}`)
//       .listen('notifications.count', (event: { unreadCount: number }) => {
//         console.log('New unread count:', event.unreadCount);
//         this.notificationCountSubject.next(event.unreadCount); // Update the unread count
//       })
//       .error((err: any) => {
//         console.error('❌ Error receiving the event:', err);
//       });
//   }

  
//   unsubscribeFromNotifications(userId: number) {
//     this.echo.leave(`user.${userId}`); // Leave the private channel
//   }


//   // ✅ Increment Message Count
//   private incrementMessageCount() {
//     const newCount = this.unreadMessagesCount.value + 1;
//     this.unreadMessagesCount.next(newCount);
//     this.storeCount('unreadMessagesCount', newCount);
//     this.updateTotalUnread();
//   }

//   // ✅ Increment Notification Count
//   private incrementNotificationCount() {
//     const newCount = this.notificationCountSubject.value + 1;
//     this.notificationCountSubject.next(newCount);
//     this.storeCount('notificationCount', newCount);
//     this.updateTotalUnread();
//   }

//   // ✅ Reset Unread Messages Count
//   resetMessageCount() {
//     this.unreadMessagesCount.next(0);
//     this.storeCount('unreadMessagesCount', 0);
//     this.updateTotalUnread();
//   }

//   // ✅ Reset Notification Count
//   resetNotificationCount() {
//     this.notificationCountSubject.next(0);
//     this.storeCount('notificationCount', 0);
//     this.updateTotalUnread();
//   }

//   // ✅ Fetch Notifications from Backend (Simulated API Call)
//   loadNotifications(): void {
//     setTimeout(() => {
//       const notifications = [{ id: 1 }, { id: 2 }]; // Example Notifications
//       const count = notifications.length;
//       this.notificationCountSubject.next(count);
//       this.storeCount('notificationCount', count);
//       this.updateTotalUnread();
//     }, 1000);
//   }

//   // ✅ Update Total Unread Count (Messages + Notifications)
//   private updateTotalUnread() {
//     const total = this.unreadMessagesCount.value + this.notificationCountSubject.value;
//     this.totalUnreadSubject.next(total);
//     this.storeCount('totalUnread', total);
//   }

//   // ✅ Store Count in localStorage
//   private storeCount(key: string, value: number) {
//     localStorage.setItem(key, value.toString());
//   }

//   // ✅ Retrieve Count from localStorage
//   private getStoredCount(key: string): number {
//     return Number(localStorage.getItem(key)) || 0;
//   }

//   private chatMessages: { [receiverId: number]: BehaviorSubject<any[]> } = {};
//     // ✅ Subscribe to chat messages for a specific receiver
//     listenToChat(receiverId: number) {
//       if (!this.chatMessages[receiverId]) {
//         this.chatMessages[receiverId] = new BehaviorSubject<any[]>([]);
//       }
  
//       this.echo.private(`chat.${receiverId}`).listen('.message.sent', (data: any) => {
//         console.log(`📩 New message for receiver ${receiverId}:`, data);
//         this.addMessage(receiverId, data.message);
//       });
  
//       return this.chatMessages[receiverId].asObservable();
//     }
    
//   // ✅ Add new message to the chat history
//   private addMessage(receiverId: number, message: any) {
//     const currentMessages = this.chatMessages[receiverId]?.value || [];
//     this.chatMessages[receiverId]?.next([...currentMessages, message]);
//   }

//   // ✅ Get the latest messages for a receiver
//   getChatMessages(receiverId: number) {
//     if (!this.chatMessages[receiverId]) {
//       this.chatMessages[receiverId] = new BehaviorSubject<any[]>([]);
//     }
//     return this.chatMessages[receiverId].asObservable();
//   }


// }


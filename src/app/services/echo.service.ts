import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EchoService {
  private echo: Echo<any>;

  // ✅ Unread Messages Count (Persistent)
  private unreadMessagesCount = new BehaviorSubject<number>(this.getStoredCount('unreadMessagesCount'));
  unreadMessages$ = this.unreadMessagesCount.asObservable();

  // ✅ Notifications Count (Persistent)
  private notificationCountSubject = new BehaviorSubject<number>(this.getStoredCount('notificationCount'));
  notificationCount$ = this.notificationCountSubject.asObservable();

  // ✅ Total Unread Notifications (Messages + Notifications)
  private totalUnreadSubject = new BehaviorSubject<number>(this.getStoredCount('totalUnread'));
  totalUnread$ = this.totalUnreadSubject.asObservable();

  constructor() {
    (window as any).Pusher = Pusher;

    this.echo = new Echo({
      broadcaster: 'pusher',
      key: 'e0cd7653f3ae9bbbd459', // Replace with your Pusher Key
      cluster: 'ap1', // Match your Pusher region
      forceTLS: true,
    });

    // ✅ Debug Connection Status
    this.echo.connector.pusher.connection.bind('connected', () => {
      console.log('✅ Laravel Echo Connected!');
    });

    this.echo.connector.pusher.connection.bind('error', (err: any) => {
      console.error('❌ Pusher Connection Error:', err);
    });

    // ✅ Listen to real-time updates
    this.listenToMessages();
    this.listenToNotifications();
  }

  // ✅ Listen for Real-Time Messages
  listenToMessages() {
    this.echo.channel('chat').listen('.message.sent', (data: any) => {
      console.log('📩 Received message:', data);
      this.incrementMessageCount();
    });
  }

  // ✅ Listen for Real-Time Notifications
  listenToNotifications() {
    this.echo.channel('notifications').listen('.notification.sent', (data: any) => {
      console.log('🔔 New Notification:', data);
      this.incrementNotificationCount();
    });
  }

  // ✅ Increment Message Count
  private incrementMessageCount() {
    const newCount = this.unreadMessagesCount.value + 1;
    this.unreadMessagesCount.next(newCount);
    this.storeCount('unreadMessagesCount', newCount);
    this.updateTotalUnread();
  }

  // ✅ Increment Notification Count
  private incrementNotificationCount() {
    const newCount = this.notificationCountSubject.value + 1;
    this.notificationCountSubject.next(newCount);
    this.storeCount('notificationCount', newCount);
    this.updateTotalUnread();
  }

  // ✅ Reset Unread Messages Count
  resetMessageCount() {
    this.unreadMessagesCount.next(0);
    this.storeCount('unreadMessagesCount', 0);
    this.updateTotalUnread();
  }

  // ✅ Reset Notification Count
  resetNotificationCount() {
    this.notificationCountSubject.next(0);
    this.storeCount('notificationCount', 0);
    this.updateTotalUnread();
  }

  // ✅ Fetch Notifications from Backend (Simulated API Call)
  loadNotifications(): void {
    setTimeout(() => {
      const notifications = [{ id: 1 }, { id: 2 }]; // Example Notifications
      const count = notifications.length;
      this.notificationCountSubject.next(count);
      this.storeCount('notificationCount', count);
      this.updateTotalUnread();
    }, 1000);
  }

  // ✅ Update Total Unread Count (Messages + Notifications)
  private updateTotalUnread() {
    const total = this.unreadMessagesCount.value + this.notificationCountSubject.value;
    this.totalUnreadSubject.next(total);
    this.storeCount('totalUnread', total);
  }

  // ✅ Store Count in localStorage
  private storeCount(key: string, value: number) {
    localStorage.setItem(key, value.toString());
  }

  // ✅ Retrieve Count from localStorage
  private getStoredCount(key: string): number {
    return Number(localStorage.getItem(key)) || 0;
  }
}

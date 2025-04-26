import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private notifications: any[] = []; 
  private notificationCountSubject = new BehaviorSubject<number>(0);
  notificationCount$ = this.notificationCountSubject.asObservable(); // Expose Observable
  
  private unreadMessagesSubject = new BehaviorSubject<number>(0);
  unreadMessages$ = this.unreadMessagesSubject.asObservable();
  
  constructor(private http: HttpClient) {}



  getActiveMessages(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Include auth token
    });
    return this.http.get(`${_url}getActiveUsers`, { headers });
  }

  loadNotifications(): void {
    this.getMessageCount().subscribe({
      next: (res) => {
        this.notifications = res;
        const count = this.notifications.length;
  
        this.unreadMessagesSubject.next(count); // ✅ Push new count dynamically
      },
      error: (err) => console.error('❌ Error fetching notifications:', err),
    });
  }


  
  getNotifications(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Include auth token
    });
    return this.http.get<any>(`${_url}notifications`,{headers});
  }

    
  getMessagesReceive(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Include auth token
    });
    return this.http.get<any>(`${_url}messages_receive`,{headers});
  }


    
  getIsRead(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Include auth token
    });
    return this.http.get<any>(`${_url}getNotificationsIsUnRead`,{headers});
  }

  getIsReadMessages(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Include auth token
    });
    return this.http.get<any>(`${_url}messages_unReadReceive`,{headers});
  }


  getMessageCount(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Include auth token
    });
    return this.http.get<any>(`${_url}update_count`,{headers});
  }



   // ✅ Mark messages as read
   markMessagesAsRead(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Include auth token
    });
    return this.http.post<any>(`${_url}messages/read`, { id: id }, {headers});
  }

  markMessagesAllRead(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Include auth token
    });
  
    return this.http.post<any>(`${_url}messages/mark_allAsread`, {}, { headers });
  }
  
  // Fetch Messages
  getMessages(receiverId: number): Observable<any> {
    const url = `${_url}receivemessages/${receiverId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Include auth token
    });
    return this.http.get(url, { headers });
  }

  // Send Message
  sendMessage(receiverId: number, message: string): Observable<any> {
    const url = `${_url}send-message`;
    const body = { receiver_id: receiverId, message: message };
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 
      'Content-Type': 'application/json'
    });
    return this.http.post(url, body, { headers });
  }


  addNotification(notification: any): void {
    this.notifications.push(notification);
    this.notificationCountSubject.next(this.notifications.length); // ✅ Update count dynamically
  }

  clearNotifications(): void {
    this.notificationCountSubject.next(0); // ✅ Reset count when messages are read
  }


}

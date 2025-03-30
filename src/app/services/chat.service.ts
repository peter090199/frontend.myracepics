import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { _url } from 'src/global-variables';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) {}
  //get active users chat
  getActiveMessages(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Include auth token
    });
    return this.http.get(`${_url}getActiveUsers`, { headers });
  }

  getNotifications(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Include auth token
    });
    return this.http.get<any[]>(`${_url}notifications`,{headers});
  }

   // ✅ Mark messages as read
   markMessagesAsRead(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Include auth token
    });
    return this.http.post<any>(`${_url}messages/read`, { id: id }, {headers});
  }

  
  // Fetch Messages
  getMessages(receiverId: number): Observable<any> {
    const url = `${_url}receivemessages/${receiverId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Include auth token
    });
    return this.http.get(url, { headers });
  }

  // Send Message
  sendMessage(receiverId: number, message: string): Observable<any> {
    const url = `${_url}send-message`;
    const body = { receiver_id: receiverId, message: message };
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`, 
      'Content-Type': 'application/json'
    });
    return this.http.post(url, body, { headers });
  }
}

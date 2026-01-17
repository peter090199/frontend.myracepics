import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { _url } from 'src/global-variables';


@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http: HttpClient) { }

  private getAuthToken(): string {
    return sessionStorage.getItem('token') || ''; // Fetch the token from localStorage or other storage
  }


  private createHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }

  private createParams(): HttpParams {
    return new HttpParams().set('desc_code', 'top_navigation');
  }


  private handleAuthError(error: any): Observable<any> {
    if (error.status === 401) {
      console.error('Unauthorized: Please log in.');
      alert('Unauthorized access. Please log in again.');
    } else if (error.status === 403) {
      console.error('Forbidden: You do not have permission to access this resource.');
      alert('Forbidden: You do not have the required permissions.');
    } else {
      console.error('An error occurred:', error.message);
      alert('An unexpected error occurred. Please try again.');
    }
    return of(null); // Return an observable with a fallback value
  }


  saveEvent(data: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post(`${_url}events/save`, data, { headers }).pipe(
      catchError(error => this.handleAuthError(error))
    );
  }


  getevents(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${_url}events/getevents`, { headers });
  }
  getEventByUuid(uuid: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${_url}events/getEventByUuid/${uuid}`, { headers });
  }

  
   getEventByUuidx(uuid: any): Observable<any> {
    return this.http
      .get<{ success: boolean; event: any }>(
        `${_url}events/getEventByUuid/${uuid}`
      )
      .pipe(
        map(res => {
          const event = res.event;

          return {
            ...event,
            image:
              typeof event.image === 'string'
                ? JSON.parse(event.image)
                : event.image
          };
        })
      );
  }


  getEvent(uiid: string | number): Observable<{ success: boolean; event: Event }> {
    return this.http.get<{ success: boolean; event: Event }>(`${_url}events/getEventByUuid/${uiid}`);
  }

  // deleteQuestionById(question_id: number): Observable<any> {
  //   const headers = this.createHeaders();
  //   return this.http.delete<any>(`${_url}deleteQuestionById/${question_id}`, { headers });
  // }

  //  getJobPostingByTransNo(transNo: string): Observable<any> {
  //   const headers = this.createHeaders();
  //   return this.http.get(`${_url}getJobPostingByTransNo/${transNo}`,{headers});
  // }

  // //appliedjob
  //   saveAppliedJob(formData: FormData): Observable<any> {
  //   const headers = this.createHeaders();
  //   return this.http.post(`${_url}saveAppliedJob`, formData, { headers }).pipe(
  //     catchError(error => this.handleAuthError(error))
  //   );
  // }

  // getAppliedJob(): Observable<any> {
  //   const headers = this.createHeaders();
  //   return this.http.get(`${_url}getAppliedJob`,{headers});
  // }

  // getAppliedJobByTransNo(transNo: any): Observable<any> {
  //   const headers = this.createHeaders();
  //   return this.http.get(`${_url}getAppliedJobByTransNo/${transNo}`,{headers});
  // }
  //  getInterviewAppliedJobs(): Observable<any> {
  //   const headers = this.createHeaders();
  //   return this.http.get(`${_url}getInterviewAppliedJobs`,{headers});
  // }
  // getAllAppliedJobsByCode(): Observable<any> {
  //   const headers = this.createHeaders();
  //   return this.http.get(`${_url}getAllAppliedJobsByCode`,{headers});
  // }

}

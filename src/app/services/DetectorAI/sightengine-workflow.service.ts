import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface SightengineResponse {
  summary: {
    action: string;          // e.g., 'accept' or 'reject'
    reject_prob: number;     // probability of rejection
    reject_reason: string[]; // array of rejection reasons
  };
  [key: string]: any;        // other data
}

@Injectable({
  providedIn: 'root'
})
export class SightengineWorkflowService {

  private API_URL = 'https://api.sightengine.com/1.0/check-workflow.json';
  private API_USER = '1497099119';  // replace with your API user
  private API_SECRET = 'KE2kugJ8pDFMH7EkpsUUPLFZ6czZdhDu'; // replace with your secret
  private WORKFLOW_ID = 'wfl_jGkQeN7H45jxF0rFztfFL'; // your workflow ID

  constructor(private http: HttpClient) { }

  checkImage(file: File): Observable<SightengineResponse> {
    const formData = new FormData();
    formData.append('media', file);
    formData.append('workflow', this.WORKFLOW_ID);
    formData.append('api_user', this.API_USER);
    formData.append('api_secret', this.API_SECRET);

    return this.http.post<SightengineResponse>(this.API_URL, formData);
  }

  checkVideos(file: File): Observable<SightengineResponse> {
    const formData = new FormData();
    formData.append('media', file);
    formData.append('workflow', this.WORKFLOW_ID);
    formData.append('api_user', this.API_USER);
    formData.append('api_secret', this.API_SECRET);

    return this.http.post<SightengineResponse>(this.API_URL, formData);
  }
}

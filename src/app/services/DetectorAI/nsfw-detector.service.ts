// import { Injectable } from '@angular/core';
// import 
// import * as tf from '@tensorflow/tfjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class NsfwDetectorService {
//   private model: nsfwjs.NSFWJS | null = null;

//   constructor() {}

//   async loadModel() {
//     if (!this.model) {
//       this.model = await nsfwjs.load();
//     }
//   }

//   async classifyImage(image: HTMLImageElement) {
//     await this.loadModel();
//     return this.model!.classify(image);
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NsfwDetectorService {

  private apiUrl = 'https://api.deepai.org/api/nsfw-detector';
  private apiKey = '0abeffc8-39cc-4549-a3ea-9108c6ed023f'; // replace with your free key

  constructor(private http: HttpClient) { }

  detectNSFW(imageUrl: string): Observable<any> {
    const headers = new HttpHeaders({
      'Api-Key': this.apiKey,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, { image: imageUrl }, { headers });
  }
  
}


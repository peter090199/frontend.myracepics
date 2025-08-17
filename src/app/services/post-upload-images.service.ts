import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { _url } from 'src/global-variables';

@Injectable({
  providedIn: 'root'
})
export class PostUploadImagesService {
  RequiredRefresh: any;
  constructor(private http: HttpClient) { }
  private getAuthToken(): string {
    return sessionStorage.getItem('token') || ''; 
  }
  private getParamsCode(): string {
    return sessionStorage.getItem('code') || ''; 
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // Log the error for debugging
      return of(result as T);
    };
  }
  
  private createHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }


  slides: { posts: string; thumbnail: string; caption: string }[] = [];

  private imagesSource = new BehaviorSubject<FormData | null>(null);
    images$ = this.imagesSource.asObservable();
  
    setImages(images: FormData) {
      this.imagesSource.next(images);
    }
  
    clearImages() {
      this.imagesSource.next(null);
    }

    addImages(images: { posts: string; thumbnail: string; caption: string }[]) {
      this.slides.push(...images);
    }
    
    getPreviewImages() {
      return this.slides;
    }
    

    uploadImages(formData:FormData): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post<any>(`${_url}savePost`, formData, { headers });
    }


    getDataPostAddFollow(): Observable<any> {
      const headers = this.createHeaders();
     // const params = new HttpParams().set('code', code); // Set code as query param
      return this.http.get(`${_url}getPost`, { headers });
    }
    
    likePost(postId: number, liked: boolean) {
      return this.http.post(`${_url}post/${postId}/like`, { liked });
    }
    
    getDataPost(code:any): Observable<any> {
      const headers = this.createHeaders();
      const params = new HttpParams().set('code', code); // Set code as query param
      return this.http.get(`${_url}post`, { headers, params });
    }
    
  
  saveAndUpdate(formData:FormData): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post<any>(`${_url}saveOrUpdateImages`, formData, { headers });
  }


  //update
  updateImages(formData:FormData): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post<any>(`${_url}updateImages`, formData, { headers });
  }

  //get
  getImages(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${_url}post`, { headers});
  }
  
  //public
  getPublicImages(): Observable<any> {
    return this.http.get(`${_url}websitemodule/getImagesPublic`);
  }
  
  get_blogByPublic(): Observable<any> {
    return this.http.get(`${_url}websitemodule/get_blogByPublic`);
  }
  
  deleteImage(transCode: any) {
    const headers = this.createHeaders();
    return this.http.delete<{message(message: any): unknown; success: boolean }>(`${_url}deleteByTransCode/${transCode}`, {headers});
  }

  deletePost(posts_uuId: any) {
    const headers = this.createHeaders();
    return this.http.delete(`${_url}post/${posts_uuId}`, { headers });
  }

  deletePosts_uuind(posts_uuInd: any) {
    const headers = this.createHeaders();
    return this.http.post(`${_url}deleteindidualpost/${posts_uuInd}`, {}, { headers });
  }
  
  
}








  // uploadImagescc(files: File[],transNo:any,title:any, description:any, stats:any): Observable<any> {
  //   const formData = new FormData();
  //   files.forEach(file => {
  //     formData.append('files[]', file);
  //   });
  //   formData.append('transNo', transNo);
  //   formData.append('title', title);
  //   formData.append('description', description);
  //   formData.append('stats', stats);
  //   const headers = this.createHeaders();
  //   return this.http.post<any>(`${_url}upload_images`, formData, { headers });
  // }

  // uploadImagesx(files: File[], authToken: string,transNo:any,title:any, description:any): Observable<any> {
  //   const formData = new FormData();
  //   files.forEach(file => {
  //     formData.append('files[]', file);
  //   });
  //   formData.append('transNo', transNo);
  //   formData.append('title', title);
  //   formData.append('description', description);
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${authToken}`,
  //     'Accept': 'application/json'
  //   });
  //   return this.http.post<any>(`${_url}upload_images`, formData, { headers });
  // }

  
  // getImagesxxx(): Observable<Blob[]> {
  //   const headers = this.createHeaders();
  //   return this.http.get<Blob[]>(`${_url}get_images`, { headers, responseType: 'blob' as 'json' });
  // }
 

  // getImages(): Observable<any> {
  //   const headers = this.createHeaders();
    
  //   return this.http.get<any>(`${_url}get_images`, { headers }).pipe(
  //     tap(res => {
  //       if (res.requiresRefresh) {
  //         location.reload(); // 🔄 Refresh the page if required
  //       }
  //     })
  //   );
  // }



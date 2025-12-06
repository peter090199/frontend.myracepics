import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { _url } from 'src/global-variables';

@Injectable({
  providedIn: 'root'
})
export class PostUploadImagesService {

  constructor(private http: HttpClient) {}

  // ---------------------------
  // AUTH HELPERS
  // ---------------------------

  private getAuthToken(): string {
    return sessionStorage.getItem('token') || '';
  }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
    });
  }

  private handleError<T>(op = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${op} failed: `, error);
      return of(result as T);
    };
  }

  // ---------------------------
  // IMAGE STATE (BehaviorSubject)
  // ---------------------------

  private imagesSource = new BehaviorSubject<FormData | null>(null);
  images$ = this.imagesSource.asObservable();

  setImages(images: FormData) {
    this.imagesSource.next(images);
  }

  clearImages() {
    this.imagesSource.next(null);
  }

  // Used by your preview gallery
  slides: { posts: string; thumbnail: string; caption: string }[] = [];

  addImages(images: { posts: string; thumbnail: string; caption: string }[]) {
    this.slides.push(...images);
  }

  getPreviewImages() {
    return this.slides;
  }

  // ---------------------------
  // UPLOAD / UPDATE POSTS
  // ---------------------------

  uploadImages(formData: FormData): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post(`${_url}savePost`, formData, { headers })
      .pipe(catchError(this.handleError('uploadImages')));
  }

  updatePostByTransNo(formData: FormData, transNo: any): Observable<any> {
    const headers = this.createHeaders();
    formData.append('transNo', transNo);

    return this.http.post(`${_url}updatePostByTransNo/${transNo}`, formData, { headers })
      .pipe(catchError(this.handleError('updatePostByTransNo')));
  }

  saveAndUpdate(formData: FormData): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post(`${_url}saveOrUpdateImages`, formData, { headers })
      .pipe(catchError(this.handleError('saveAndUpdate')));
  }

  updateImages(formData: FormData): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post(`${_url}updateImages`, formData, { headers })
      .pipe(catchError(this.handleError('updateImages')));
  }

  // ---------------------------
  // GET POSTS
  // ---------------------------

  /** Get posts from user + followed accounts */
  getDataPostAddFollowXX(page = 1, perPage = 5): Observable<any> {
    const headers = this.createHeaders();

    const params = new HttpParams()
      .set('page', page)
      .set('per_page', perPage);

    return this.http.get(`${_url}/posts/followed`, { headers, params })
      .pipe(catchError(this.handleError('getDataPostAddFollowXX')));
  }

  getDataPostAddFollow(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${_url}getPost`, { headers })
      .pipe(catchError(this.handleError('getDataPostAddFollow')));
  }

  getDataPost(code: any): Observable<any> {
    const headers = this.createHeaders();
    const params = new HttpParams().set('code', code);

    return this.http.get(`${_url}post`, { headers, params })
      .pipe(catchError(this.handleError('getDataPost')));
  }

  // ---------------------------
  // PUBLIC PAGES
  // ---------------------------

  getPublicImages(): Observable<any> {
    return this.http.get(`${_url}websitemodule/getImagesPublic`)
      .pipe(catchError(this.handleError('getPublicImages')));
  }

  get_blogByPublic(): Observable<any> {
    return this.http.get(`${_url}websitemodule/get_blogByPublic`)
      .pipe(catchError(this.handleError('get_blogByPublic')));
  }

  // ---------------------------
  // LIKE / DELETE
  // ---------------------------

  likePost(postId: number, liked: boolean) {
    return this.http.post(`${_url}post/${postId}/like`, { liked })
      .pipe(catchError(this.handleError('likePost')));
  }

  deleteImage(transCode: any) {
    const headers = this.createHeaders();
    return this.http.delete(`${_url}deleteByTransCode/${transCode}`, { headers })
      .pipe(catchError(this.handleError('deleteImage')));
  }

  deletePost(posts_uuId: any) {
    const headers = this.createHeaders();
    return this.http.delete(`${_url}post/${posts_uuId}`, { headers })
      .pipe(catchError(this.handleError('deletePost')));
  }

  deletePosts_uuind(posts_uuInd: any) {
    const headers = this.createHeaders();
    return this.http.post(`${_url}deleteindidualpost/${posts_uuInd}`, {}, { headers })
      .pipe(catchError(this.handleError('deletePosts_uuind')));
  }
}

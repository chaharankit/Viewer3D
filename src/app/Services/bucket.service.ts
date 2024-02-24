import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
declare const Autodesk: any;
@Injectable({
  providedIn: 'root',
})
export class BucketService {
  authToken: any | null = null;
  baseUrl: string = 'https://developer.api.autodesk.com';
  bucketItem: string = '/oss/v2/buckets/apptestbucket/objects';
  bucket: any = '/oss/v2/buckets';
  constructor(private http: HttpClient, private auth: AuthService) {}
  getToken(): any {
    this.auth.generateToken().subscribe(
      (response) => {
        this.authToken = JSON.parse(response.body)['access_token'];
        console.log('Token Response:', JSON.parse(response.body));
        // Handle the token response as needed
      },
      (error) => {
        console.error('Token Error:', error);
        // Handle errors if any
      }
    );
  }

  GetBucketData(token: string): Observable<any> {
    const authheader = `Bearer ${token}`;
    const headers = new HttpHeaders({
      Authorization: `${authheader}`,
    });

    return this.http.get<any>(this.baseUrl + this.bucket, { headers });
  }
  GetBucketItems(token: string, bucketName: string): Observable<any> {
    const authheader = `Bearer ${token}`;
    const headers = new HttpHeaders({
      Authorization: `${authheader}`,
    });
    return this.http.get(
      this.baseUrl + `/oss/v2/buckets/${bucketName}/objects`,
      { headers }
    );
  }
  CreateBucket(token: any, body: any): Observable<any> {
    //const token = this.auth.getTokenData();
    const authheader = `Bearer ${token}`;
    const headers = new HttpHeaders({
      Authorization: `${authheader}`,
    });
    return this.http.post(this.baseUrl + '/oss/v2/buckets', body, {
      headers: headers,
    });
  }

  DeleteBucket(token:any,bucketName:string): Observable<any>{
    const authheader = `Bearer ${token}`;
    const headers = new HttpHeaders({
      Authorization: `${authheader}`,
    });
    return this.http.delete(this.baseUrl +`/oss/v2/buckets/${bucketName}`,{headers:headers});
  }

}

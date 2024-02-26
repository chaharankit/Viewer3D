import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadfileService {
  constructor(private http: HttpClient) {}
  baseUrl: string = 'https://developer.api.autodesk.com';

  GenerateUploadUrl(
    bucketName: string,
    objectKey: string,
    token: any
  ): Observable<any> {
    const authheader = `Bearer ${token}`;
    const headers = new HttpHeaders({
      Authorization: `${authheader}`,
    });
    return this.http.get(
      this.baseUrl +
        `/oss/v2/buckets/${bucketName}/objects/${objectKey}/signeds3upload`,
      { headers }
    );
  }
}

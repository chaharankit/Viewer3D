import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ExportJob } from '../models/bucket-create';

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
  UploadFileOnUrl(selectedFile: File, uploadUrl: string): Observable<any> {
    const formData = new FormData();
    const headers = new HttpHeaders({
      'Content-Type': `application/octet-stream`,
    });
    //formData.append('file', selectedFile, selectedFile.name);
    //return this.http.put(uploadUrl, formData,{headers:headers});
    return this.readFileAsArrayBuffer(selectedFile).pipe(
      switchMap((arrayBuffer) => {
        return this.http.put(uploadUrl, arrayBuffer, {
          headers,
          responseType: 'text',
        });
      })
    );
  }
  //
  //
  readFileAsArrayBuffer(file: File): Observable<ArrayBuffer> {
    return new Observable((observer) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result instanceof ArrayBuffer) {
          observer.next(event.target.result);
          observer.complete();
        } else {
          observer.error(new Error('Error reading file as ArrayBuffer'));
        }
      };

      reader.onerror = () => {
        observer.error(new Error('Error reading file'));
      };

      reader.readAsArrayBuffer(file);

      // Cleanup function
      return () => {
        reader.abort();
      };
    });
  }

  //
  //
  CompleteUploadOfFile(
    bucketName: string,
    fileName: string,
    uploadKey: string,
    token: any
  ): Observable<any> {
    const authheader = `Bearer ${token}`;
    const body = {
      uploadKey: `${uploadKey}`,
    };
    const headers = new HttpHeaders({
      Authorization: `${authheader}`,
      'x-ads-meta-Content-Type': 'application/octet-stream',
      'Content-Type': 'application/json',
    });
    return this.http.post(
      this.baseUrl +
        `/oss/v2/buckets/${bucketName}/objects/${fileName}/signeds3upload`,
      body,
      { headers: headers }
    );
  }

  StartTranslationOfFile(urn: string, token: any): Observable<any> {
    const authheader = `Bearer ${token}`;
    const headers = new HttpHeaders({
      Authorization: `${authheader}`,
      'x-ads-force': 'true',
    });
    const body = new ExportJob();
    body.input.urn = urn;
    return this.http.post(
      this.baseUrl + '/modelderivative/v2/designdata/job',
      body,
      { headers: headers }
    );
  }
  CheckManifest(urn: string, token: any): Observable<any> {
    const authheader = `Bearer ${token}`;
    const headers = new HttpHeaders({
      Authorization: `${authheader}`,
    });
    return this.http.get(
      this.baseUrl + `/modelderivative/v2/designdata/${urn}/manifest`,
      { headers: headers }
    );
  }
}

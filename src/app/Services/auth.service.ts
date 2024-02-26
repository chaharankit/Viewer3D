import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  ClientId: string = 'RJw3sjtXLLatKjGe71i8XPkGCzdvhDicVRtThhNgKBYmTkL9';
  ClientSecret: string = 'Z8ZC2HRtLteJx0Dx7Sh4lj1BIcjXLU1HC4Wuz3SA2GV49KCxqdtYV8NaPg7yPdhm';
  baseUrl: string = 'https://developer.api.autodesk.com';
  url: string = '/authentication/v2/token';
  private apiUrl = 'https://developer.api.autodesk.com/authentication/v2/token';
  private clientId = 'RJw3sjtXLLatKjGe71i8XPkGCzdvhDicVRtThhNgKBYmTkL9';
  private clientSecret = 'Z8ZC2HRtLteJx0Dx7Sh4lj1BIcjXLU1HC4Wuz3SA2GV49KCxqdtYV8NaPg7yPdhm';
  private authToken: any | null = null;
  generateToken(): Observable<any> {
    if (this.authToken) {
      // If the token already exists, return it
      return of(this.authToken);
    } else {
      // If the token doesn't exist, fetch and return a new token
      return this.getToken();
    }
  }
  getTokenData(): any {
    this.generateToken().subscribe(
      (response) => {
        return JSON.parse(response.body)['access_token'];
      },
      (error) => {
        console.error('Token Error:', error);
        // Handle errors if any
      }
    );
  }
  getToken(): Observable<any> {
    const baseUserId = btoa(`${this.clientId}:${this.clientSecret}`);
    const authheader = `Basic ${baseUserId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `${authheader}`,
    });

    const body = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set(
        'scope',
        'data:read data:write data:create bucket:read bucket:create bucket:delete'
      );

    const options = {
      headers: headers,
      observe: 'response' as 'body',
      responseType: 'text' as 'json',
      withCredentials: true,
    };

    return this.http.post(this.apiUrl, body.toString(), options).pipe(
      map((response) => {
        this.authToken = response; // Store the token in the variable
        return this.authToken;
      }),
      catchError((error) => {
        console.error('Token Error:', error);
        throw error; // Propagate the error
      })
    );
  }
}

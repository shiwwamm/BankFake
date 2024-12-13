import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }


  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/login`, credentials);
  }

  register(user: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/register`, user);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
}

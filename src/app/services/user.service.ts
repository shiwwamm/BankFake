import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../environment/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiUrl = '';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.baseUrl}/api/user`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.baseUrl}/api/user`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${environment.baseUrl}/api/user`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${environment.baseUrl}/api/user`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.baseUrl}/api/user`);
  }
}

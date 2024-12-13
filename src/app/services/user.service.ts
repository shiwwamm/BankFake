import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateUserDTO, User } from '../models/user';
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
    return this.http.get<User>(`${environment.baseUrl}/api/user/${id}`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${environment.baseUrl}/api/user`, user);
  }

  updateUser(id: number, updateUserDto: UpdateUserDTO): Observable<void> {
    return this.http.put<void>(`${environment.baseUrl}/api/user/${id}`, updateUserDto);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.baseUrl}/api/user`);
  }
}

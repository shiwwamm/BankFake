import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account, UpdateAccountDTO } from '../models/accounts';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${environment.baseUrl}/api/account`);
  }

  getAccountsByUserId(id: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${environment.baseUrl}/api/account/useraccounts/${id}`);
  }

  getAccountById(id: number): Observable<Account> {
    return this.http.get<Account>(`${environment.baseUrl}/api/account/${id}`);
  }

  addAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(`${environment.baseUrl}/api/account`, account);
  }

  updateAccount(id: number, updateAccountDto: UpdateAccountDTO): Observable<void> {
    return this.http.put<void>(`${environment.baseUrl}/api/account/${id}`, updateAccountDto);
  }

  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.baseUrl}/api/account/${id}`);
  }

  getUserIds(): Observable<number[]> {
    return this.http.get<number[]>(`${environment.baseUrl}/api/user/ids`);
  }
}

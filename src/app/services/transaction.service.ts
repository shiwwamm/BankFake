import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionDTO, CreateTransactionDTO } from '../models/transaction';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  getTransactions(): Observable<TransactionDTO[]> {
    return this.http.get<TransactionDTO[]>(`${environment.baseUrl}/api/transaction`);
  }

  addTransaction(transaction: CreateTransactionDTO): Observable<TransactionDTO> {
    return this.http.post<TransactionDTO>(`${environment.baseUrl}/api/transaction`, transaction);
  }
}

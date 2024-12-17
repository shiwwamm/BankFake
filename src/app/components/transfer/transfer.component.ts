import { Component, OnInit } from '@angular/core';
import { CreateTransactionDTO, TransactionDTO, TransactionDetailsDTO } from '../../models/transaction';
import { Account } from '../../models/accounts';
import { AccountService } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';
import { FormsModule } from '@angular/forms';
import { forkJoin, of, switchMap } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css'
})
export class TransferComponent implements OnInit{
  transactions: TransactionDTO[] = [];
  accounts: Account[] = [];
  newTransaction: CreateTransactionDTO = { fromAccountId: 0, toAccountId: 0, amount: 0 };
  senderDetails: Account | null = null;
  receiverDetails: Account | null = null;
  showAddTransactionForm: boolean = false; 
  transactionsDetails: TransactionDetailsDTO[] = [];

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // this.loadTransactions();
    this.loadAccounts();
    this.loadTransactionDetails();
    
  }
  // loadTransactions(): void {
  //   this.transactionService.getTransactions().subscribe((data) => (this.transactions = data));
  // }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe((data) => (this.accounts = data));
  }

  onSenderChange(sid: number): void {
    if(sid){
    this.accountService.getAccountById(sid).subscribe((data) => {
      this.senderDetails = data;
    });
  } else {
    this.senderDetails = null;
  }
  }

  onReceiverChange(rid: number): void {
    if(rid){
    this.accountService.getAccountById(rid).subscribe((data) => {
      this.receiverDetails = data;
    });
  } else {
    this.receiverDetails = null;
  }
  }

  addTransaction(): void {
    this.transactionService.addTransaction(this.newTransaction).subscribe(() => {
      this.loadTransactionDetails();
      this.newTransaction = { fromAccountId: 0, toAccountId: 0, amount: 0 };
      this.senderDetails = null;
      this.receiverDetails = null;
    });
  }

  toggleAddTransactionForm() {
    this.showAddTransactionForm = !this.showAddTransactionForm;
  }
  

  loadTransactionDetails(): void {
    this.transactionService.getTransactions().pipe(
      switchMap(transactions => {
        const transactionObservables = transactions.map(transaction => {
          return forkJoin({
            transaction: of(transaction),
            fromAccount: this.accountService.getAccountById(transaction.fromAccountId),
            toAccount: this.accountService.getAccountById(transaction.toAccountId),
            fromUser: this.accountService.getAccountById(transaction.fromAccountId).pipe(
              switchMap(account => this.userService.getUserById(account.userId))
            ),
            toUser: this.accountService.getAccountById(transaction.toAccountId).pipe(
              switchMap(account => this.userService.getUserById(account.userId))
            ),
          });
        });
        return forkJoin(transactionObservables); 
      })
    ).subscribe((result) => {
      this.transactionsDetails = result.map((res) => {
        return {
          transactionId: res.transaction.transactionId,
          amount: res.transaction.amount,
          fromAccountNumber: res.fromAccount.accountNumber,
          fromUsername: res.fromUser.username,
          fromUserId: res.fromUser.userId,
          toAccountNumber: res.toAccount.accountNumber,
          toUsername: res.toUser.username,
          toUserId: res.toUser.userId,
        } as TransactionDetailsDTO;
      });
    });
  }
  
}

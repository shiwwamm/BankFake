import { Component, OnInit } from '@angular/core';
import { CreateTransactionDTO, TransactionDTO } from '../../models/transaction';
import { Account } from '../../models/accounts';
import { AccountService } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';
import { FormsModule } from '@angular/forms';

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

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
    this.loadAccounts();
  }
  loadTransactions(): void {
    this.transactionService.getTransactions().subscribe((data) => (this.transactions = data));
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe((data) => (this.accounts = data));
  }

  onSenderChange(): void {
    this.senderDetails = this.accounts.find(
      (account) => account.accountId === this.newTransaction.fromAccountId
    ) || null;
  }

  onReceiverChange(): void {
    this.receiverDetails = this.accounts.find(
      (account) => account.accountId === this.newTransaction.toAccountId
    ) || null;
  }

  addTransaction(): void {
    this.transactionService.addTransaction(this.newTransaction).subscribe(() => {
      this.loadTransactions();
      this.newTransaction = { fromAccountId: 0, toAccountId: 0, amount: 0 };
      this.senderDetails = null;
      this.receiverDetails = null;
    });
  }
}

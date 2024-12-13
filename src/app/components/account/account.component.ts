import { Component, OnInit } from '@angular/core';
import { Account } from '../../models/accounts';
import { AccountService } from '../../services/account.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit{
  accounts: Account[] = [];
  newAccount: Account = { accountId: 0, userId: 0, accountNumber: '', balance: 0 };
  editingAccount: Account | null = null;
  userIds: number[] = [];

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadAccounts();
    this.loadUserIds();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe((data) => (this.accounts = data));
  }
  
  loadUserIds(): void {
    this.accountService.getUserIds().subscribe((data) => (this.userIds = data));
  }

  addAccount(): void {
    this.accountService.addAccount(this.newAccount).subscribe(() => {
      this.loadAccounts();
      this.newAccount = { accountId: 0, userId: 0, accountNumber: '', balance: 0 };
    });
  }

  editAccount(account: Account): void {
    this.editingAccount = { ...account };
  }

  updateAccount(): void {
    if (this.editingAccount) {
      this.accountService.updateAccount(this.editingAccount).subscribe(() => {
        this.loadAccounts();
        this.editingAccount = null;
      });
    }
  }

  deleteAccount(id: number): void {
    this.accountService.deleteAccount(id).subscribe(() => this.loadAccounts());
  }

}

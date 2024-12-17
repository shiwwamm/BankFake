import { Component, OnInit } from '@angular/core';
import { Account, UpdateAccountDTO } from '../../models/accounts';
import { AccountService } from '../../services/account.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { forkJoin } from 'rxjs';
import { User } from '../../models/user';
import { TransactionService } from '../../services/transaction.service';

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
  showAddAccountsForm: boolean = false;
  usersWithNames: any;

  constructor(
    private accountService: AccountService, 
    private userService: UserService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
    // this.loadUserIds();
    this.loadUserIdsWithUsernames();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe((data) => (this.accounts = data));
  }

  // loadUserIds(): void {
  //   this.accountService.getUserIds().subscribe((data) => (
  //     this.userIds = data.sort((a: number, b: number) => a - b)
  //   ));
  // }

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
      const updateAccountDto: UpdateAccountDTO = {
        balance: this.editingAccount.balance,
      };
      this.accountService.updateAccount(this.editingAccount.accountId,updateAccountDto ).subscribe(() => {
        this.loadAccounts();
        this.editingAccount = null;
      });
    }
  }

  deleteAccount(accountId: number): void {
    this.transactionService.getTransactionsByAccountId(accountId).subscribe(transactions => {
      if (transactions.length > 0) {
        transactions.forEach(transaction => {
          this.transactionService.deleteTransaction(transaction.transactionId).subscribe();
        });
      }
  
      this.accountService.deleteAccount(accountId).subscribe(() => {
        this.loadAccounts();
      });
    });
  }

  toggleAddAccountForm() {
    this.showAddAccountsForm = !this.showAddAccountsForm;
  }

  loadUserIdsWithUsernames(): void {
    this.accountService.getUserIds().subscribe((ids) => {
      this.userIds = ids.sort((a: number, b: number) => a - b);
      const userObservables = this.userIds.map((id: number) =>
        this.userService.getUserById(id)
      );
      forkJoin(userObservables).subscribe((users) => {
        this.usersWithNames = users.map((user: User) => ({
          id: user.userId,
          username: user.username,
        }));
        console.log(this.usersWithNames);
      });
    });
  }

}

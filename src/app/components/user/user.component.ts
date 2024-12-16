import { Component, OnInit } from '@angular/core';
import { UpdateUserDTO, User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/accounts';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  public users: User[] = [];
  public newUser: User = { userId: 0, username: '', email: '', phoneNumber: '' };
  public editingUser: User | null = null;
  public userAccounts: Account[] | null = null;
  public selectedUser: User | null = null;
  showAddUserForm: boolean = false;

  constructor(private userService: UserService, private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((data) => (this.users = data));
  }

  addUser(): void {
    this.userService.addUser(this.newUser).subscribe(() => {
      this.loadUsers();
      this.newUser = { userId: 0, username: '', email: '', phoneNumber: '' };
      this.showAddUserForm = false;
    });
  }

  editUser(user: User): void {
    this.editingUser = { ...user };
  }

  updateUser(): void {
    if (this.editingUser) {
      const updateUserDto: UpdateUserDTO = {
        username: this.editingUser.username,
        email: this.editingUser.email,
        phoneNumber: this.editingUser.phoneNumber,
      };
      this.userService.updateUser(this.editingUser.userId, updateUserDto).subscribe(() => {
        this.loadUsers();
        this.editingUser = null;
      });
    }
  }


  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(() => this.loadUsers());
  }

  getUserAccounts(id: number) {
    this.accountService.getAccountsByUserId(id).subscribe((accounts) => {
      this.userAccounts = accounts,
      this.selectedUser = this.users.find((user) => user.userId === id) || null;
    });
  }

  toggleAddUserForm() {
    this.showAddUserForm = !this.showAddUserForm;
  }
}

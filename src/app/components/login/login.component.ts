import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router, private notificationService: NotificationService) {}

  login(): void {
    if (!this.email || !this.password) {
      this.notificationService.showError('Both fields are required');
      // this.errorMessage = 'Both fields are required';
      return;
    }
    this.authService.login({ email: this.email, password: this.password }).subscribe(
      (response) => {
        localStorage.setItem('authToken', response.accessToken);
        this.router.navigate(['/']);
        this.notificationService.showSuccess('Login Successful');
      },
      (error) => {
        this.errorMessage = 'Invalid email or password';
      }
    );
  }

}

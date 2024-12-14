import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './services/notification.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');

  const router = inject(Router);
  const notificationService = inject(NotificationService);
  

  const clonedRequest = token ? req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }) : req;

  return next(clonedRequest).pipe(
    catchError((error) => {
      if(error.status === 401) {
        notificationService.showError('Unauthorized. Please log in.');
        router.navigate(['/login']);
      } else if (error.status === 403) {
        notificationService.showError('Access forbidden. You do not have permissions');
      } else { 
        notificationService.showError(error.message || 'An unexpected error occured. Good luck. Adios!');
      }

      return throwError(() => error);
    })
  );
};
